import React, { useState } from "react";
import closeIcon from "../assets/close.png";
const CreateChatModal: React.FC<CreateChatModal> = ({
  createChat,
  openModal,
  setModal,
}) => {
  const [name, setname] = useState("");
  return (
    <div
      className={`absolute top-[50%] left-[50%] bg-white px-2 py-3 translate-x-[-50%] translate-y-[-50%] z-40 ${
        openModal ? "scale-100" : "scale-0"
      }`}
    >
      <img
        src={closeIcon}
        className="absolute top-0 right-4 w-5 h-5"
        onClick={() => {
          setModal(false);
        }}
      />
      <input
        className="w-full px-2 py-1"
        onChange={(e) => {
          setname(e.target.value);
        }}
      />
      <button
        className="bg-blue-500 w-full"
        onClick={() => {
          createChat(name);
        }}
      >
        Create Room
      </button>
    </div>
  );
};

export default CreateChatModal;

interface CreateChatModal {
  createChat: any;
  openModal: boolean;
  setModal: any;
}
