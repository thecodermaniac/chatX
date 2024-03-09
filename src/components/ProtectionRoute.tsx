import { Navigate, Outlet } from "react-router-dom";
import useUser from "../context/UserProvider";
const ProtectionRoute = () => {
  const { User } = useUser();

  return Object.keys(User).length !== 0 ? (
    <Outlet />
  ) : (
    <Navigate to="/" replace />
  );
};

export default ProtectionRoute;
