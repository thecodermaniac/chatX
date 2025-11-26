import React, { useState, useEffect } from "react";
import closeIcon from "../assets/close.png";
import api from "../services/api";

interface CreateModalProps {
  openModal: boolean;
  setModal: any; // Dispatch function from reducer
  createChat?: (val: any) => void; // Optional callback if you want to update UI immediately
}

interface Friend {
  id: number;
  userTag: string;
  displayName: string;
}

const CreateChatModal: React.FC<CreateModalProps> = ({ openModal, setModal, createChat }) => {
  const [groupName, setGroupName] = useState("");
  const [friends, setFriends] = useState<Friend[]>([]);
  const [selectedMemberIds, setSelectedMemberIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);

  // 1. Fetch Friends List when modal opens
  useEffect(() => {
    if (openModal) {
      api.get<Friend[]>("/friends/list")
        .then((response) => {
          setFriends(response.data);
        })
        .catch((err) => console.error("Failed to fetch friends", err));
    }
  }, [openModal]);

  // 2. Handle Checkbox Selection
  const toggleFriend = (id: number) => {
    setSelectedMemberIds((prev) =>
      prev.includes(id)
        ? prev.filter((memberId) => memberId !== id) // Remove if exists
        : [...prev, id] // Add if new
    );
  };

  // 3. Handle Submit
  const handleSubmit = async () => {
    if (!groupName.trim()) {
      alert("Please enter a group name.");
      return;
    }
    if (selectedMemberIds.length === 0) {
      alert("Please select at least one friend.");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        groupName: groupName,
        memberIds: selectedMemberIds
      };

      const response = await api.post("/groups/create", payload);
      
      console.log("Group Created:", response.data);
      alert(`Group "${response.data.name}" created successfully!`);

      // Optional: Call parent function if you want to update the sidebar list instantly
      if (createChat) createChat(response.data);

      handleClose();
      // Reload page to show new group in sidebar (Quick fix for now)
      window.location.reload(); 
    } catch (error: any) {
      console.error(error);
      alert(error.response?.data?.message || "Failed to create group.");
    } finally {
      setLoading(false);
    }
  };

  // 4. Reset & Close
  const handleClose = () => {
    setModal({ type: "changeChat", payload: false });
    setGroupName("");
    setSelectedMemberIds([]);
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center transition-all duration-300 ${
        openModal ? "visible opacity-100" : "invisible opacity-0 pointer-events-none"
      }`}
    >
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-40 backdrop-blur-sm"
        onClick={handleClose}
      ></div>

      {/* Modal Content */}
      <div className={`bg-white w-full max-w-md rounded-xl shadow-2xl p-6 relative transform transition-transform duration-300 ${
         openModal ? "scale-100" : "scale-90"
      }`}>
        
        {/* Close Button */}
        <img
          src={closeIcon}
          className="absolute top-4 right-4 w-6 h-6 cursor-pointer hover:opacity-70"
          onClick={handleClose}
          alt="Close"
        />

        <h3 className="text-xl font-bold text-gray-800 mb-4">Create New Group</h3>
        
        {/* Group Name Input */}
        <div className="mb-4">
            <label className="block text-sm font-bold text-gray-600 mb-1">Group Name</label>
            <input
            value={groupName}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-shadow"
            placeholder="e.g. Project Team"
            onChange={(e) => setGroupName(e.target.value)}
            />
        </div>

        {/* Friend Selection List */}
        <div className="mb-6">
            <label className="block text-sm font-bold text-gray-600 mb-2">Select Members</label>
            <div className="h-48 overflow-y-auto border border-gray-200 rounded-lg p-2 bg-gray-50">
                {friends.length === 0 ? (
                    <p className="text-center text-gray-400 text-sm mt-4">You have no friends to add yet.</p>
                ) : (
                    friends.map((friend) => (
                        <div 
                            key={friend.id} 
                            className={`flex items-center p-2 mb-1 rounded cursor-pointer transition-colors ${
                                selectedMemberIds.includes(friend.id) ? "bg-purple-100 border border-purple-200" : "hover:bg-gray-100"
                            }`}
                            onClick={() => toggleFriend(friend.id)}
                        >
                            <div className={`w-5 h-5 rounded border flex items-center justify-center mr-3 ${
                                selectedMemberIds.includes(friend.id) ? "bg-purple-600 border-purple-600" : "border-gray-400 bg-white"
                            }`}>
                                {selectedMemberIds.includes(friend.id) && (
                                    <span className="text-white text-xs">✓</span>
                                )}
                            </div>
                            <div>
                                <p className="font-semibold text-sm text-gray-800">{friend.userTag}</p>
                                {friend.displayName && <p className="text-xs text-gray-500">{friend.displayName}</p>}
                            </div>
                        </div>
                    ))
                )}
            </div>
            <p className="text-right text-xs text-gray-400 mt-1">
                {selectedMemberIds.length} members selected
            </p>
        </div>

        {/* Create Button */}
        <button
          className={`w-full py-3 rounded-lg text-white font-bold transition-all ${
            loading 
              ? "bg-purple-300 cursor-not-allowed" 
              : "bg-purple-600 hover:bg-purple-700 shadow-lg hover:shadow-xl"
          }`}
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Creating Group..." : "Create Group"}
        </button>
      </div>
    </div>
  );
};

export default CreateChatModal;