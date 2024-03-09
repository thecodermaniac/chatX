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
      className={`absolute top-[50%] left-[50%] bg-white py-3 transition-all border-2 rounded-lg px-4 translate-x-[-50%] translate-y-[-50%] z-40 ${
        openModal ? "scale-100" : "scale-0"
      }`}
    >
      <img
        src={closeIcon}
        className="absolute top-2 right-2 w-6 h-6 hover:cursor-pointer"
        onClick={() => {
          setModal({ type: "changeChat", payload: false });
        }}
      />
      <p className="text-lg">Create or Join room</p>
      <input
        className="w-full px-2 py-1 border-2 my-4 rounded-lg"
        onChange={(e) => {
          setname(e.target.value);
        }}
      />
      <button
        className="bg-blue-500 w-full px-3 py-1 rounded-full mx-auto my-3 text-white"
        onClick={() => {
          createChat(name);
          setname("");
        }}
      >
        Lets Go!
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
