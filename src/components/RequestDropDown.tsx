import React, { useEffect, useState } from "react";
import bellIcon from "../assets/bell.png";
import crossIcon from "../assets/cross.png";
import correctIcon from "../assets/correct.png";
import api from "../services/api"; // Use the new API instance

// Matches Java FriendRequestDTO
interface FriendRequest {
  requestId: number;
  senderId: number;
  senderUserTag: string;
  senderDisplayName?: string;
}

const RequestDropDown: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [reqList, setList] = useState<FriendRequest[]>([]);

  // 1. Fetch Pending Requests
  function fetchActiveReq() {
    // GET /api/v1/friends/pending
    api.get<FriendRequest[]>("/friends/pending")
      .then(function (response) {
        setList(response.data);
      })
      .catch(function (error) {
        console.error(error);
      });
  }

  // 2. Reject Request
  function deleteActiveReq(senderId: number) {
    // DELETE /api/v1/friends/reject/{senderId}
    api.delete(`/friends/reject/${senderId}`)
      .then(function (response) {
        alert("Request rejected.");
        fetchActiveReq(); // Refresh list
      })
      .catch(function (error) {
        alert(error.response?.data || "Failed to reject request");
      });
  }

  // 3. Accept Request
  function acceptRequest(senderId: number) {
    // POST /api/v1/friends/accept/{senderId}
    api.post(`/friends/accept/${senderId}`)
      .then(function (response) {
        alert("Friend request accepted!");
        fetchActiveReq(); // Refresh list
      })
      .catch(function (error) {
        alert(error.response?.data || "Failed to accept request");
      });
  }

  // Fetch when dropdown opens
  useEffect(() => {
    if (open) {
      fetchActiveReq();
    }
  }, [open]);

  return (
    <div className="relative mx-4 hover:cursor-pointer">
      {/* Bell Icon */}
      <div className="relative" onClick={() => setOpen((prev) => !prev)}>
        <img src={bellIcon} className="w-6 h-6 hover:opacity-80 transition-opacity" alt="Notifications" />
        {reqList.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
            {reqList.length}
          </span>
        )}
      </div>

      {/* Dropdown Menu */}
      {open && (
        <div className="absolute z-50 bg-white border border-gray-200 shadow-xl w-72 rounded-lg right-0 top-10 flex flex-col overflow-hidden animate-fade-in-down">
          <div className="bg-purple-600 text-white px-4 py-2 text-sm font-semibold">
            Friend Requests
          </div>
          
          <div className="max-h-64 overflow-y-auto divide-y divide-gray-100">
            {reqList.length === 0 ? (
              <p className="text-center text-gray-500 py-4 text-sm">No pending requests</p>
            ) : (
              reqList.map((req, ind) => (
                <div
                  className="flex flex-row items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors"
                  key={ind}
                >
                  <div className="flex flex-col">
                    <p className="font-semibold text-gray-800 text-sm">{req.senderUserTag}</p>
                    <p className="text-xs text-gray-500">wants to connect</p>
                  </div>
                  
                  <div className="flex flex-row items-center gap-2">
                    {/* Reject Button */}
                    <button 
                      className="p-1 hover:bg-red-100 rounded-full transition-colors"
                      title="Reject"
                      onClick={() => deleteActiveReq(req.senderId)}
                    >
                      <img src={crossIcon} className="w-5 h-5" alt="Reject" />
                    </button>
                    
                    {/* Accept Button */}
                    <button 
                      className="p-1 hover:bg-green-100 rounded-full transition-colors"
                      title="Accept"
                      onClick={() => acceptRequest(req.senderId)}
                    >
                      <img src={correctIcon} className="w-5 h-5" alt="Accept" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default RequestDropDown;