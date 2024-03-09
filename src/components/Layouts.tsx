import React, { useState, useEffect, useReducer } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import closeIcon from "../assets/close.png";
import menuIcon from "../assets/menu.png";
import CreateChatModal from "./CreateChatModal";
import useUser from "../context/UserProvider";
import { getNames } from "../utils/getName";
import useAxios from "../useAxios";
import UserSection from "./UserSection";
import modalReducers from "../reducers/layModalReducers";
import RequestChatModal from "./RequestModal";
import RequestDropDown from "./RequestDropDown";

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
  const [rooms, setRoom] = useState([{ name: "Global", value: "global" }]);
  function navigateToChat(roomName: string) {
    navigate(`/chat/${User.userName}/${roomName}`);
  }

  function newChat(roomName: string) {
    setRoom([...rooms, { name: roomName, value: roomName.toLowerCase() }]);
  }

  useEffect(() => {
    useAxios
      .get(`/api/user/get-connection/${User.userId}`)
      .then(function (response) {
        console.log(response.data);
        const userList = getNames(response.data.list, User.userName);
        console.log(userList);
        setRoom([...rooms, ...userList]);
      });
  }, []);
  return (
    <div className="w-full h-[100vh] flex flex-col items-center space-y-6">
      <nav className="flex justify-between w-full items-center">
        <h2 className="text-3xl font-bold mx-auto">ChatX</h2>
        <RequestDropDown />
        <UserSection />
      </nav>
      <CreateChatModal
        createChat={newChat}
        setModal={modalDispatch}
        openModal={isChatOpen}
      />
      <RequestChatModal setModal={modalDispatch} openModal={isRequestOpen} />
      {location.pathname !== "/" && (
        <img
          src={menuIcon}
          className="w-6 h-6 absolute top-3 left-4 z-10"
          onClick={() => {
            modalDispatch({ type: "changeSidebar", payload: true });
          }}
        />
      )}
      {location.pathname !== "/" && (
        <div
          className={`fixed h-screen left-0 transition-all overflow-hidden z-20 bg-white border-r-4 rounded-xl ${
            isSideBarOpen
              ? "lg:w-[20%] md:w-[40%] w-[60%] px-4"
              : "w-0 border-r-0 px-0"
          }`}
        >
          <img
            src={closeIcon}
            className="absolute w-7 h-7 right-4 mb-4 hover:cursor-pointer"
            onClick={() => {
              modalDispatch({ type: "changeSidebar", payload: false });
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
                    setReceiver(val.name);
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
          <div className="flex flex-row w-full mt-5 gap-3">
            <button
              className="flex-1 py-3 border-4 border-gray-500 rounded-xl"
              onClick={() => {
                modalDispatch({ type: "changeChat", payload: true });
              }}
            >
              New Chat +
            </button>
            <button
              className="flex-1 py-3 border-4 border-gray-500 rounded-xl"
              onClick={() => {
                modalDispatch({ type: "changeRequest", payload: true });
              }}
            >
              Send Request
            </button>
          </div>
        </div>
      )}

      {children}
    </div>
  );
};

export default Layouts;

interface LayoutProps {
  children: any;
}
