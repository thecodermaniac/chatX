import { useNavigate, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import useUser from "../context/UserProvider";
// Import the configured axios instance
import api from "../services/api";

const LoginPage = () => {
  const { User, setUser, setReceiver } = useUser();
  const navigate = useNavigate();
  const [login, setLogin] = useState({
    userTag: "", // Changed from email
    password: "",
  });

  function handleLogin(event: React.FormEvent) {
    event.preventDefault();

    // Payload matches Java Login Request
    const payload = {
        userTag: login.userTag,
        password: login.password
    };

    api.post("/auth/login", payload)
      .then(function (response) {
        // The backend returns: { token, userTag, userId }
        const { token, userTag, userId } = response.data;

        // 1. Store Token (CRITICAL for api.ts interceptor)
        localStorage.setItem("token", token);
        
        // 2. Store User Data (for your Context/UI)
        const userData = { userTag, userId };
        localStorage.setItem("chatX-User", JSON.stringify(userData));
        
        setUser(userData);
        
        // Redirect to chat
        navigate(`/chat/${userTag}/global`);
      })
      .catch(function (error) {
        console.error(error);
        alert("Login failed! Check credentials.");
      });
  }

  // Check if already logged in
  useEffect(() => {
    const existing = JSON.parse(localStorage.getItem("chatX-User") || "{}");
    const token = localStorage.getItem("token");

    if (token && existing && existing.userTag) {
      setUser(existing);
      navigate(`/chat/${existing.userTag}/global`);
      setReceiver("Global");
    }
  }, []);

  return (
    <div className="flex flex-col items-center h-screen justify-center">
      <form className="w-full max-w-sm flex flex-col space-y-6" onSubmit={handleLogin}>
        <p className="block text-gray-500 font-bold text-center mb-1 md:mb-0 pr-4">
          Welcome back, User. Please Login
        </p>
        <div className="flex flex-col items-center mb-6 space-y-6">
          
          {/* USER TAG INPUT */}
          <div className="w-full">
            <label className="block text-gray-500 font-bold mb-1 md:mb-0 pr-4 w-full" htmlFor="userTag">
              User Tag
            </label>
            <input
              className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
              id="userTag"
              type="text"
              placeholder="e.g. aritra123"
              value={login.userTag}
              onChange={(e) => setLogin({ ...login, userTag: e.target.value })}
              required
            />
          </div>

          {/* PASSWORD INPUT */}
          <div className="w-full">
            <label className="block text-gray-500 font-bold mb-1 md:mb-0 pr-4 w-full" htmlFor="password">
              Password
            </label>
            <input
              className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
              id="password"
              type="password"
              placeholder="********"
              value={login.password}
              onChange={(e) => setLogin({ ...login, password: e.target.value })}
              required
            />
          </div>
        </div>

        <div className="md:flex md:items-center">
            <button
            className="w-full self-center shadow bg-purple-500 hover:bg-purple-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded"
            type="submit"
            >
            Log in to Chat
            </button>
        </div>
      </form>
      <div className="mt-4">
        <p className="mx-auto text-md">
          New user?{" "}
          <Link to={"/register"} className="underline underline-offset-2 ">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;