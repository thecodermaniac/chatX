import React, { useState } from "react";
import closeIcon from "../assets/close.png";
import api from "../services/api"; // Use new API instance

interface RequestModalProps {
  openModal: boolean;
  setModal: any; // Using 'any' to match your reducer dispatch type
}

const RequestChatModal: React.FC<RequestModalProps> = ({ openModal, setModal }) => {
  const [targetUserTag, setTargetUserTag] = useState("");
  const [loading, setLoading] = useState(false);

  function sentRequest() {
    if(!targetUserTag.trim()) return;

    setLoading(true);

    // POST /api/v1/friends/send/{targetUserTag}
    // We don't need to send a body, the URL contains the target
    api.post(`/friends/send/${targetUserTag}`)
      .then(function (response) {
        alert(response.data); // "Friend request successfully sent..."
        setModal({ type: "changeRequest", payload: false });
        setTargetUserTag("");
      })
      .catch(function (error) {
        // Backend returns helpful error messages (e.g. "User not found")
        const msg = error.response?.data || error.message;
        alert("Error: " + msg);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  // Close handler
  const handleClose = () => {
    setModal({ type: "changeRequest", payload: false });
    setTargetUserTag("");
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-300 ${
        openModal ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
      }`}
    >
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-40 backdrop-blur-sm"
        onClick={handleClose}
      ></div>

      {/* Modal Content */}
      <div className={`bg-white w-full max-w-sm rounded-xl shadow-2xl p-6 relative transform transition-transform duration-300 ${
         openModal ? "scale-100" : "scale-90"
      }`}>
        
        <img
          src={closeIcon}
          className="absolute top-4 right-4 w-6 h-6 cursor-pointer hover:opacity-70"
          onClick={handleClose}
          alt="Close"
        />

        <h3 className="text-xl font-bold text-gray-800 mb-2">Add a Friend</h3>
        <p className="text-sm text-gray-500 mb-4">Enter the User Tag of the person you want to connect with.</p>
        
        <input
          value={targetUserTag}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-shadow"
          placeholder="e.g. aritra123"
          onChange={(e) => setTargetUserTag(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sentRequest()}
        />

        <button
          className={`w-full py-3 rounded-lg mt-6 text-white font-bold transition-all ${
            loading 
              ? "bg-purple-300 cursor-not-allowed" 
              : "bg-purple-600 hover:bg-purple-700 shadow-lg hover:shadow-xl"
          }`}
          onClick={sentRequest}
          disabled={loading}
        >
          {loading ? "Sending..." : "Send Request"}
        </button>
      </div>
    </div>
  );
};

export default RequestChatModal;