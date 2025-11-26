import React, { useState, useEffect, useReducer } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import closeIcon from "../assets/close.png";
import menuIcon from "../assets/menu.png";
import CreateChatModal from "./CreateChatModal";
import useUser from "../context/UserProvider";
import api from "../services/api"; // Use your configured Axios instance
import UserSection from "./UserSection";
import modalReducers, { LayoutState } from "../reducers/layModalReducers";
import RequestChatModal from "./RequestModal";
import RequestDropDown from "./RequestDropDown";

// Define what a list item looks like
interface ChatListItem {
  id: number | string; // ID for groups, ID for friends
  name: string;        // Display Name or Group Name
  uniqueTag: string;   // userTag (for friends) or string ID (for groups)
  type: "FRIEND" | "GROUP";
}

interface LayoutProps {
  children: React.ReactNode;
}

const Layouts: React.FC<LayoutProps> = ({ children }) => {
  const { User, setReceiver } = useUser();
  const navigate = useNavigate();
  const location = useLocation();

  const [{ isSideBarOpen, isChatOpen, isRequestOpen }, modalDispatch] =
    useReducer(modalReducers, {
      isSideBarOpen: true,
      isChatOpen: false,
      isRequestOpen: false,
    });

  const [chatList, setChatList] = useState<ChatListItem[]>([]);

  // Navigate to the chat page
  function navigateToChat(item: ChatListItem) {
    if (item.type === "FRIEND") {
      // For friends, we use their userTag (e.g., aritra123)
      navigate(`/chat/${item.uniqueTag}/private`);
    } else {
      // For groups, we might need a specific route, or we handle it in ChatPage
      // For now, let's pass the Group ID as the "roomname"
      // NOTE: You might need to update ChatPage to handle numeric Group IDs
      navigate(`/chat/${item.id}/group`);
    }
  }

  // Fetch Friends and Groups on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Run both requests in parallel
        const [friendsRes, groupsRes] = await Promise.all([
          api.get("/friends/list"),
          api.get("/groups"),
        ]);

        // 1. Process Friends
        const friendItems: ChatListItem[] = friendsRes.data.map((f: any) => ({
          id: f.id,
          name: f.displayName || f.userTag,
          uniqueTag: f.userTag,
          type: "FRIEND",
        }));

        // 2. Process Groups
        const groupItems: ChatListItem[] = groupsRes.data.map((g: any) => ({
          id: g.id,
          name: g.name,
          uniqueTag: g.id.toString(),
          type: "GROUP",
        }));

        // Combine them (Groups first, then Friends, or however you prefer)
        setChatList([...groupItems, ...friendItems]);
      } catch (error) {
        console.error("Error fetching chat list:", error);
      }
    };

    if (User?.userTag) {
      fetchData();
    }
  }, [User]);

  return (
    <div className="w-full h-[100vh] flex flex-col items-center space-y-6 bg-gray-50 text-gray-800">
      {/* Navbar */}
      <nav className="flex justify-between w-full items-center p-4 bg-white shadow-sm z-30">
        <div className="flex items-center gap-4">
          {location.pathname !== "/" && (
            <img
              src={menuIcon}
              className="w-6 h-6 cursor-pointer hover:opacity-70"
              onClick={() => {
                modalDispatch({ type: "changeSidebar", payload: true });
              }}
              alt="Menu"
            />
          )}
          <h2 className="text-3xl font-bold text-purple-600">ChatX</h2>
        </div>
        
        <div className="flex flex-row items-center gap-4">
            <RequestDropDown />
            <UserSection  />
        </div>
      </nav>

      {/* Modals */}
      <CreateChatModal
        createChat={(val: any) => console.log("Create Group logic here", val)} 
        setModal={modalDispatch}
        openModal={isChatOpen}
      />
      <RequestChatModal setModal={modalDispatch} openModal={isRequestOpen} />

      {/* Sidebar */}
      {location.pathname !== "/" && (
        <div
          className={`fixed h-screen left-0 top-0 transition-all duration-300 ease-in-out z-40 bg-white border-r shadow-2xl ${
            isSideBarOpen
              ? "lg:w-[20%] md:w-[40%] w-[75%] px-4"
              : "w-0 px-0 border-none overflow-hidden"
          }`}
        >
          {/* Close Icon */}
          <div className="flex justify-end pt-4">
            <img
              src={closeIcon}
              className="w-7 h-7 cursor-pointer hover:rotate-90 transition-transform"
              onClick={() => {
                modalDispatch({ type: "changeSidebar", payload: false });
              }}
              alt="Close"
            />
          </div>

          {/* Chat List */}
          <h3 className="text-gray-400 font-bold uppercase text-xs mt-4 mb-2">Your Chats</h3>
          <div className="flex flex-col gap-2 overflow-y-auto h-[60vh] mt-2">
            {chatList.length === 0 && <p className="text-center text-gray-400 mt-10">No chats yet.</p>}
            
            {chatList.map((chat, ind) => {
              return (
                <div
                  className="w-full px-3 py-3 flex flex-row items-center gap-3 hover:bg-purple-50 rounded-xl cursor-pointer transition-colors"
                  key={ind}
                  onClick={() => {
                    navigateToChat(chat);
                    setReceiver(chat.name); // Updates Context
                    // On Mobile: Close sidebar after selection
                    if (window.innerWidth < 768) {
                        modalDispatch({ type: "changeSidebar", payload: false });
                    }
                  }}
                >
                  <p
                    className={`rounded-full w-10 h-10 text-white flex items-center justify-center font-bold text-sm shadow-md ${
                        chat.type === 'GROUP' ? 'bg-orange-500' : 'bg-purple-600'
                    }`}
                  >
                    {chat.name[0].toUpperCase()}
                  </p>
                  <div className="flex flex-col">
                    <p className="font-semibold text-gray-700">{chat.name}</p>
                    <span className="text-[10px] text-gray-400 uppercase tracking-wider">{chat.type}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Action Buttons */}
          <div className="absolute bottom-5 left-0 w-full px-4 flex flex-col gap-3">
            <button
              className="w-full py-3 bg-purple-100 text-purple-700 font-bold rounded-xl hover:bg-purple-200 transition-colors"
              onClick={() => {
                modalDispatch({ type: "changeChat", payload: true });
              }}
            >
              Create Group +
            </button>
            <button
              className="w-full py-3 border-2 border-purple-500 text-purple-600 font-bold rounded-xl hover:bg-purple-50 transition-colors"
              onClick={() => {
                modalDispatch({ type: "changeRequest", payload: true });
              }}
            >
              Add Friend
            </button>
          </div>
        </div>
      )}

      {/* Main Content (ChatPage) */}
      <div className={`flex-1 w-full ${isSideBarOpen ? 'md:pl-0' : ''}`}>
          {children}
      </div>
    </div>
  );
};

export default Layouts;