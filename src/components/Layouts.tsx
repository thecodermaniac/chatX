import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import closeIcon from "../assets/close.png";
import menuIcon from "../assets/menu.png";
import CreateChatModal from "./CreateChatModal";
import useUser from "../context/UserProvider";
const Layouts: React.FC<LayoutProps> = ({ children }) => {
  const { name } = useUser();
  console.log("name", name);

  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(true);
  const [modalOpen, setModal] = useState(false);
  const [rooms, setRoom] = useState([{ name: "Global", value: "global" }]);
  function navigateToChat(roomName: string) {
    navigate(`/chat/${name}/${roomName}`);
  }

  function newChat(roomName: string) {
    setRoom([...rooms, { name: roomName, value: roomName.toLowerCase() }]);
  }
  return (
    <div className="w-full h-screen flex flex-col justify-center items-center space-y-6">
      <CreateChatModal
        createChat={newChat}
        setModal={setModal}
        openModal={modalOpen}
      />
      {location.pathname !== "/" && (
        <img
          src={menuIcon}
          className="w-6 h-6 absolute top-3 left-4 z-10"
          onClick={() => {
            setOpen(true);
          }}
        />
      )}
      {location.pathname !== "/" && (
        <div
          className={`absolute h-[100vh] left-0 transition-all overflow-hidden z-20 bg-white border-r-4 rounded-xl px-4 ${
            open ? "lg:w-[20%] md:w-[40%] w-[60%]" : "w-0 border-r-0 px-0"
          }`}
        >
          <img
            src={closeIcon}
            className="absolute w-7 h-7 right-4 mb-4 hover:cursor-pointer"
            onClick={() => {
              setOpen(false);
            }}
          />
          <div className="flex flex-col gap-3 divide-y-2 mt-6">
            {rooms.map((val, ind) => {
              return (
                <div
                  className="w-full px-2 py-3 flex flex-row items-center justify-between"
                  key={ind}
                  onClick={() => {
                    navigateToChat(val.value);
                  }}
                >
                  <p className=" rounded-[100%] bg-cyan-900 w-10 h-10 text-white flex items-center justify-center">
                    {val.name[0]}
                  </p>
                  <p className="p-1">{val.name}</p>
                </div>
              );
            })}
          </div>

          <button
            className="w-full py-3 border-4 border-gray-500 rounded-xl mt-5"
            onClick={() => {
              setModal(true);
            }}
          >
            New Chat +
          </button>
        </div>
      )}
      <h2 className="text-3xl font-bold">ChatX</h2>
      {children}
    </div>
  );
};

export default Layouts;

interface LayoutProps {
  children: any;
}
