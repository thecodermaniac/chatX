import { useState } from "react";
import useUser from "../context/UserProvider";

const UserSection = () => {
  const { User, setUser } = useUser();
  const [open, setOpen] = useState(false);
  function handleSignout() {
    localStorage.removeItem("chatX-User");
    setUser({});
  }
  return (
    <div
      className="w-fit px-2 py-3 flex flex-col"
      onClick={() => {
        setOpen((prev) => !prev);
      }}
    >
      <div className="flex flex-row items-center justify-between gap-6 w-full">
        <p className=" rounded-[100%] bg-cyan-900 w-10 h-10 text-white flex items-center justify-center">
          {User?.userName === undefined ? "X" : User?.userName[0]}
        </p>
        <p className="p-1 text-xl">{User.userName}</p>
      </div>
      <div className="relative">
        <div
          className={`absolute transition-max-h ease-in-out duration-500 z-20 overflow-hidden bg-white w-fit rounded-md left-0 top-4 flex flex-col gap-2 divide-y-2 ${
            open ? "h-16 border-2" : "h-0 border-0"
          }`}
        >
          <p className="px-4">{User.userId}</p>
          <p
            className="text-lg text-red-400 font-semibold hover:cursor-pointer px-4"
            onClick={() => {
              handleSignout();
            }}
          >
            Sign out
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserSection;
