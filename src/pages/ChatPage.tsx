import React, { useEffect, useRef, useState } from "react";
import Layouts from "../components/Layouts";
import { useParams } from "react-router-dom";
import sendIcon from "../components/sendIcon";
import useUser from "../context/UserProvider";
import api from "../services/api";
import { Client } from "@stomp/stompjs";

interface ChatMessage {
  id?: number;
  senderTag: string;
  recipientTag?: string;
  groupId?: number;
  content: string;
  timestamp: string;
}

const ChatPage: React.FC = () => {
  const { User } = useUser();
  const { roomId, chatType } = useParams<{ roomId: string; chatType: string }>();

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isConnectionOpen, setConnectionOpen] = useState<boolean>(false);
  const [messageBody, setMessageBody] = useState<string>("");

  const stompClientRef = useRef<Client | null>(null);
  const scrollTarget = useRef<HTMLDivElement>(null);

  // Refs to hold latest state for the WebSocket callback
  const userRef = useRef(User);
  const roomIdRef = useRef(roomId);

  useEffect(() => {
    userRef.current = User;
    roomIdRef.current = roomId;
  }, [User, roomId]);

  // 1. FETCH HISTORY
  useEffect(() => {
    if (!roomId || !chatType) return;

    setMessages([]);
    
    const fetchHistory = async () => {
      try {
        let endpoint = chatType === "private" 
          ? `/chat/history/${roomId}` 
          : `/groups/${roomId}/messages`;

        const response = await api.get<ChatMessage[]>(endpoint);
        setMessages(response.data);
      } catch (err) {
        console.error("Failed to fetch history:", err);
      }
    };

    fetchHistory();
  }, [roomId, chatType]);

  // 2. WEBSOCKET CONNECTION
  useEffect(() => {
    const token = localStorage.getItem("token");
    // Ensure we have a userTag before connecting
    if (!token || !roomId || !User.userTag) return;

    const client = new Client({
      brokerURL: "ws://localhost:8080/ws",
      connectHeaders: { Authorization: `Bearer ${token}` },
      debug: (str) => console.log(str),
      
      onConnect: () => {
        setConnectionOpen(true);

        if (chatType === "group") {
          const destination = `/topic/group/${roomId}`;
          client.subscribe(destination, (msg) => {
            const receivedMsg: ChatMessage = JSON.parse(msg.body);
            setMessages((prev) => [...prev, receivedMsg]);
          });
        } else {
          // === FIX IS HERE ===
          // We use the EXPLICIT path including the userTag.
          // This matches exactly what Spring sends to: /user/{userTag}/queue/messages
          const userQueueDestination = `/user/${User.userTag}/queue/messages`;
          
          console.log("Subscribing to Explicit User Queue:", userQueueDestination);
          
          client.subscribe(userQueueDestination, (msg) => {
            const receivedMsg: ChatMessage = JSON.parse(msg.body);
            
            const currentRoom = roomIdRef.current;
            const myTag = userRef.current.userTag;

            // Filter logic
            const isFromCurrentContact = receivedMsg.senderTag === currentRoom;
            const isMyEcho = receivedMsg.senderTag === myTag && receivedMsg.recipientTag === currentRoom;

            if (isFromCurrentContact || isMyEcho) {
              setMessages((prev) => [...prev, receivedMsg]);
            }
          });
        }
      },
    });

    client.activate();
    stompClientRef.current = client;

    return () => {
      if (client.active) client.deactivate();
      setConnectionOpen(false);
    };
  }, [chatType, User.userTag]); // Reconnect if userTag changes

  // 3. SEND MESSAGE
  const sendMessage = () => {
    if (messageBody && stompClientRef.current && isConnectionOpen && roomId) {
      let destination = chatType === "group" ? "/app/group/chat" : "/app/chat";
      
      let payload: any = { content: messageBody };
      
      if (chatType === "group") {
        payload.groupId = parseInt(roomId!);
      } else {
        payload.recipientTag = roomId;
      }

      stompClientRef.current.publish({
        destination: destination,
        body: JSON.stringify(payload),
      });

      setMessageBody("");
    }
  };

  // 4. SCROLL
  useEffect(() => {
    scrollTarget.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <Layouts>
      <div className="flex flex-col h-full">
        <div className="p-4 bg-white border-b shadow-sm flex flex-row items-center gap-3">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${chatType === 'group' ? 'bg-orange-500' : 'bg-purple-600'}`}>
             {roomId ? roomId.charAt(0).toUpperCase() : "?"}
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-800">{roomId}</h2>
            <p className="text-xs text-gray-500 uppercase tracking-wider">{chatType}</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
          {messages.map((msg, index) => {
            const isMe = msg.senderTag === User.userTag;
            return (
              <div key={index} className={`my-2 flex ${isMe ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[70%] rounded-xl px-4 py-2 shadow-sm ${isMe ? "bg-purple-600 text-white rounded-tr-none" : "bg-white text-gray-800 border border-gray-200 rounded-tl-none"}`}>
                  {!isMe && chatType === "group" && <p className="text-xs font-bold text-orange-600 mb-1">{msg.senderTag}</p>}
                  <p className="text-sm leading-relaxed">{msg.content}</p>
                  <p className={`text-[10px] text-right mt-1 ${isMe ? "text-purple-200" : "text-gray-400"}`}>
                    {msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString([], {timeStyle: 'short'}) : "Sending..."}
                  </p>
                </div>
              </div>
            );
          })}
          <div ref={scrollTarget} />
        </div>

        <div className="p-4 bg-white border-t">
          <div className="flex items-center bg-gray-100 rounded-full px-4 py-2 border border-transparent focus-within:border-purple-300 transition-colors">
            <input
              type="text"
              className="flex-1 bg-transparent focus:outline-none text-gray-700"
              placeholder={`Message ${chatType === 'group' ? 'Group' : '@' + roomId}...`}
              value={messageBody}
              onChange={(e) => setMessageBody(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button
              onClick={sendMessage}
              disabled={!isConnectionOpen || !messageBody.trim()}
              className={`ml-2 p-2 rounded-full transition-all ${isConnectionOpen && messageBody.trim() ? "text-purple-600 hover:bg-purple-200 hover:scale-110" : "text-gray-400 cursor-not-allowed"}`}
            >
              {sendIcon}
            </button>
          </div>
        </div>
      </div>
    </Layouts>
  );
};

export default ChatPage;