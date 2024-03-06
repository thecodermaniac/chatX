import React, { useEffect, useRef, useState } from "react";
import Layouts from "../components/Layouts";
import { useParams } from "react-router-dom";
import sendIcon from "../components/sendIcon";
import useUser from "../context/UserProvider";

interface Message {
  sender: string;
  body: string;
  sentAt: string;
}

const ChatPage: React.FC = () => {
  const { Receiver } = useUser();
  const [messages, setMessages] = useState<{ [key: string]: Message[] }>({});
  const [isConnectionOpen, setConnectionOpen] = useState<boolean>(false);
  const [messageBody, setMessageBody] = useState<string>("");

  const { username, roomname } = useParams<{
    username: string;
    roomname: string;
  }>();
  const ws = useRef<WebSocket | null>(null);

  const sendMessage = () => {
    if (messageBody) {
      ws.current?.send(
        JSON.stringify({
          sender: username,
          body: messageBody,
          room: roomname,
        })
      );
      setMessageBody("");
    }
  };

  useEffect(() => {
    console.log(import.meta.env.VITE_CHAT_ENDPOINT);

    ws.current = new WebSocket(import.meta.env.VITE_CHAT_ENDPOINT);
    ws.current.onopen = () => {
      console.log("Connection Opened");
      setConnectionOpen(true);

      ws.current?.send(JSON.stringify({ initial: true, room: roomname }));
      // setMessages([]);
    };
    ws.current.onmessage = (event) => {
      console.log("fun", event);
      const data = JSON.parse(event.data) as Message;
      setMessages((prevState) => {
        if (prevState[roomname as string]) {
          // If the key already exists, add the new value to the existing array
          return {
            ...prevState,
            [roomname as string]: [...prevState[roomname as string], data],
          };
        } else {
          // If the key does not exist, create a new array with the new value
          return {
            ...prevState,
            [roomname as string]: [data],
          };
        }
      });
    };
    return () => {
      console.log("Cleaning up...");
      ws.current?.close(3001, JSON.stringify({ room: roomname }));
    };
  }, [roomname]);

  const scrollTarget = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollTarget.current) {
      scrollTarget.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages[roomname as string]?.length]);

  return (
    <Layouts>
      <h2 className="text-3xl font-bold">{Receiver}</h2>
      <div
        id="chat-view-container"
        className="flex flex-col md:w-2/3 lg:w-1/3 w-full px-4  overflow-y-auto"
      >
        {messages[roomname as string]?.map((message: any, index: number) => (
          <div
            key={index}
            className={`my-3 rounded py-3 px-2 w-fit text-white ${
              message.sender === username
                ? "self-end bg-lime-600"
                : "bg-sky-600"
            }`}
          >
            <div className="flex items-center">
              <div className="ml-2">
                <div className="flex flex-row">
                  <div className="text-sm font-medium leading-5 text-gray-900">
                    {message.sender} at
                  </div>
                  <div className="ml-1">
                    <div className="text-sm font-bold leading-5 text-gray-900">
                      {new Date(message.sentAt).toLocaleTimeString(undefined, {
                        timeStyle: "short",
                      })}{" "}
                    </div>
                  </div>
                </div>
                <div className="mt-1 text-sm font-semibold leading-5">
                  {message.body}
                </div>
              </div>
            </div>
          </div>
        ))}
        <div ref={scrollTarget}></div>
      </div>
      <footer className="pb-5 md:w-2/3 lg:w-1/3 w-full px-4">
        <p>
          You are chatting as <span className="font-bold">{username}</span>
        </p>

        <div className="flex flex-row">
          <input
            id="message"
            type="text"
            className="w-full border-2 border-gray-200 focus:outline-none rounded-md p-2 hover:border-purple-400"
            placeholder="Type your message here..."
            value={messageBody}
            onChange={(e) => setMessageBody(e.target.value)}
            required
          />
          <button
            aria-label="Send"
            onClick={sendMessage}
            className="m-3"
            disabled={!isConnectionOpen}
          >
            {sendIcon}
          </button>
        </div>
      </footer>
    </Layouts>
  );
};

export default ChatPage;
