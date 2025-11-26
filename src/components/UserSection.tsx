import { useState } from "react";
import useUser from "../context/UserProvider";
import { useNavigate } from "react-router-dom";

// NOTE: Do NOT add <LayoutProps> or ({ children }) here.
// UserSection does not accept any props.
const UserSection = () => {
  const { User, setUser } = useUser();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  function handleSignout() {
    localStorage.removeItem("chatX-User");
    localStorage.removeItem("token"); 
    setUser({ userId: 0, userTag: "", displayName: "" });
    navigate("/");
  }

  return (
    <div className="w-fit px-2 py-3 flex flex-col relative">
      <div
        className="flex flex-row items-center justify-between gap-6 w-full hover:cursor-pointer"
        onClick={() => setOpen((prev) => !prev)}
      >
        <p className="rounded-[100%] bg-cyan-900 w-10 h-10 text-white flex items-center justify-center font-bold uppercase">
          {User?.userTag ? User.userTag[0] : "?"}
        </p>
        <p className="p-1 text-xl font-medium">{User?.userTag || "Guest"}</p>
      </div>

      {/* Dropdown Menu */}
      {open && (
        <div className="absolute z-50 bg-white border-2 border-gray-200 rounded-md shadow-lg left-0 top-16 w-full min-w-[150px] flex flex-col gap-2 py-2">
          <p className="px-4 text-sm text-gray-500">ID: {User?.userId}</p>
          <hr />
          <p
            className="text-lg text-red-500 font-semibold hover:bg-gray-100 cursor-pointer px-4 py-1"
            onClick={handleSignout}
          >
            Sign out
          </p>
        </div>
      )}
    </div>
  );
};

export default UserSection;