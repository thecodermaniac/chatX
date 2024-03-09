import React, { useState } from "react";
import closeIcon from "../assets/close.png";
import useAxios from "../useAxios";
import useUser from "../context/UserProvider";

const RequestChatModal: React.FC<RequestModal> = ({ openModal, setModal }) => {
  const { User } = useUser();
  const [userId, setId] = useState("");
  function sentRequest() {
    useAxios
      .post("/api/user/add-connection", {
        sender: User?.userId,
        receiver: userId,
      })
      .then(function () {
        alert("Request Sent");
      })
      .catch(function (error) {
        alert(error.message);
      });
  }
  return (
    <div
      className={`absolute top-[50%] left-[50%] bg-white py-3 transition-all border-2 rounded-lg px-4 translate-x-[-50%] translate-y-[-50%] z-60 ${
        openModal ? "scale-100" : "scale-0"
      }`}
    >
      <img
        src={closeIcon}
        className="absolute top-2 right-2 w-6 h-6 hover:cursor-pointer"
        onClick={() => {
          setModal({ type: "changeRequest", payload: false });
        }}
      />
      <p className="text-lg">Sent Request</p>
      <input
        value={userId}
        className="w-full px-2 py-1 border-2 my-4 rounded-lg"
        onChange={(e) => {
          setId(e.target.value);
        }}
      />
      <button
        className="bg-blue-500 w-full px-3 py-1 rounded-full mx-auto my-3 text-white"
        onClick={() => {
          sentRequest();
          setModal({ type: "changeRequest", payload: false });
          setId("");
        }}
      >
        Send
      </button>
    </div>
  );
};

export default RequestChatModal;

interface RequestModal {
  openModal: boolean;
  setModal: any;
}
