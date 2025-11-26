import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
// Import the configured axios instance
import api from "../services/api"; 

const RegisterPage = () => {
  const navigate = useNavigate();
  const [register, setRegister] = useState({
    userTag: "",       // Changed from email
    password: "",
    displayName: "",   // Changed from name
  });
  const [error, setError] = useState("");

  function handleRegister(event: React.FormEvent) {
    event.preventDefault();
    setError("");

    // Payload matches Java RegisterRequest DTO
    const payload = {
      userTag: register.userTag,
      displayName: register.displayName,
      password: register.password
    };

    api.post("/auth/register", payload)
      .then(function (response) {
        console.log(response);
        
        console.log("Registration successful");
        navigate("/"); // Redirect to login
      })
      .catch(function (error) {
        console.error(error);
        // Display error message from backend if available
        setError(error.response?.data || "Registration failed. Try a different User Tag.");
      });
  }

  return (
    <div className="flex flex-col items-center h-screen justify-center">
      <form className="w-full max-w-sm flex flex-col space-y-6">
        <p className="block text-gray-500 font-bold text-center mb-1 md:mb-0 pr-4">
          Hello! New user. Welcome to ChatX
        </p>

        {error && <p className="text-red-500 text-center text-sm">{error}</p>}

        <div className="flex flex-col items-center mb-6 space-y-6">
          {/* USER TAG INPUT */}
          <div className="w-full">
            <label className="block text-gray-500 font-bold mb-1 md:mb-0 pr-4 w-full" htmlFor="userTag">
              User Tag (Unique ID)
            </label>
            <input
              className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
              id="userTag"
              type="text"
              placeholder="e.g. aritra123"
              value={register.userTag}
              onChange={(e) => setRegister({ ...register, userTag: e.target.value })}
              required
            />
          </div>

          {/* DISPLAY NAME INPUT */}
          <div className="w-full">
            <label className="block text-gray-500 font-bold mb-1 md:mb-0 pr-4 w-full" htmlFor="displayName">
              Display Name
            </label>
            <input
              className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
              id="displayName"
              type="text"
              placeholder="Your actual name"
              value={register.displayName}
              onChange={(e) => setRegister({ ...register, displayName: e.target.value })}
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
              value={register.password}
              onChange={(e) => setRegister({ ...register, password: e.target.value })}
              required
            />
          </div>
        </div>

        <div className="md:flex md:items-center">
          <button
            className="w-full shadow bg-purple-500 hover:bg-purple-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded"
            type="submit"
            onClick={handleRegister}
          >
            Register Yourself
          </button>
        </div>
      </form>
      <div className="mt-4">
        <p className="mx-auto text-md">
          Registered user?{" "}
          <Link to={"/"} className="underline underline-offset-2 ">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;