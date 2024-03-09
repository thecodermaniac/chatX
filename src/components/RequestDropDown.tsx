import React, { useEffect, useState } from "react";
import bellIcon from "../assets/bell.png";
import crossIcon from "../assets/cross.png";
import correctIcon from "../assets/correct.png";
import useAxios from "../useAxios";
import useUser from "../context/UserProvider";
const RequestDropDown: React.FC = () => {
  const { User } = useUser();
  const [open, setOpen] = useState(false);
  const [reqList, setList] = useState<any>([]);
  function fetchActiveReq() {
    useAxios
      .get(`/api/user/get-req-list/${User.userId}`)
      .then(function (response) {
        setList(response.data.requestList);
      })
      .catch(function (error) {
        alert(error.message);
      });
  }

  function deleteActiveReq(receiverId: string) {
    useAxios
      .post("/api/user/reject-request", { ConId: receiverId })
      .then(function (response) {
        alert(response.data.message);
        fetchActiveReq();
      })
      .catch(function (error) {
        alert(error.message);
      });
  }

  function acceptRequest(receiverId: string) {
    useAxios
      .put("/api/user/accept-request", { ConId: receiverId })
      .then(function (response) {
        alert(response.data.message);
        fetchActiveReq();
      })
      .catch(function (error) {
        alert(error.message);
      });
  }
  useEffect(() => {
    fetchActiveReq();
  }, [open]);

  return (
    <div className="mx-4 hover:cursor-pointer">
      <img
        src={bellIcon}
        className="w-6 h-6"
        onClick={() => {
          setOpen((prev) => !prev);
        }}
      />
      <div className="relative">
        <div
          className={`absolute transition-max-h ease-in-out duration-500 z-20  bg-white w-56 rounded-md right-0 top-4 flex flex-col gap-2 divide-y-2 ${
            open
              ? "h-64 border-2 overflow-y-visible"
              : "h-0 border-0 overflow-hidden"
          }`}
        >
          {reqList.map((val: any, ind: number) => {
            return (
              <div
                className="flex flex-row items-center justify-between px-3"
                key={ind}
              >
                <p>{val.user1.userName}</p>
                <div className="flex flex-col items-center">
                  <img
                    src={crossIcon}
                    className="w-6 h-6"
                    alt=""
                    onClick={() => {
                      deleteActiveReq(val._id);
                    }}
                  />
                  <img
                    src={correctIcon}
                    className="w-6 h-6"
                    alt=""
                    onClick={() => {
                      acceptRequest(val._id);
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default RequestDropDown;
