
import { Navigate, Outlet } from "react-router-dom";
import useUser from "../context/UserProvider";

const ProtectionRoute = () => {
  const { User } = useUser();

  // We check if the User context is populated OR if a token exists in storage.
  // Checking local storage helps prevent a flicker of "redirect" on page refresh 
  // before the Context has time to rehydrate.
  const isAuthenticated = User.userTag || localStorage.getItem("token");

  return isAuthenticated ? (
    <Outlet />
  ) : (
    <Navigate to="/" replace />
  );
};

export default ProtectionRoute;