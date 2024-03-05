import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Layouts from "../components/Layouts";
import useUser from "../context/UserProvider";
import useAxios from "../useAxios";
const LoginPage = () => {
  const { User, setUser } = useUser();
  const navigate = useNavigate();
  const [login, setLogin] = useState({
    email: "",
    password: "",
  });
  function handleLogin(event: any) {
    event.preventDefault();
    useAxios
      .post("/api/user/login", { ...login })
      .then(function (response) {
        const loggedUser = response.data;
        localStorage.setItem("chatX-User", JSON.stringify(response.data));
        setUser(response.data);
        console.log(User);
        navigate(`/chat/${loggedUser.userName}/global`);
      })
      .catch(function (error) {
        console.error(error.message);
      })
      .finally(function () {
        console.log("Network Error");
      });
  }

  useEffect(() => {
    let existing = JSON.parse(localStorage.getItem("chatX-User") || "{}");
    console.log('ki dabi',Object.keys(existing));

    if (Object.keys(existing).length !== 0) {
      setUser(existing);
      navigate(`/chat/${existing?.userName}/global`);
    }
  }, []);

  return (
    <Layouts>
      <form className="w-full max-w-sm flex flex-col space-y-6">
        <p className="block text-gray-500 font-bold text-center mb-1 md:mb-0 pr-4">
          {" "}
          Welcome back, User. Please Login
        </p>
        <div className="flex flex-col items-center mb-6 space-y-6">
          <label
            className="block text-gray-500 font-bold mb-1 md:mb-0 pr-4 w-full"
            htmlFor="email"
          >
            Email
          </label>
          <input
            className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
            id="username"
            type="text"
            placeholder="Your name or nickname"
            value={login.email}
            onChange={(e) => setLogin({ ...login, email: e.target.value })}
            required
          />
          <label
            className="block text-gray-500 font-bold mb-1 md:mb-0 pr-4 w-full"
            htmlFor="password"
          >
            Password
          </label>
          <input
            className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
            id="username"
            type="text"
            placeholder="Your name or nickname"
            value={login.password}
            onChange={(e) => setLogin({ ...login, password: e.target.value })}
            required
          />
        </div>
        <div className="md:flex md:items-center">
          <div className="md:w-1/3"></div>
          <div className="md:w-2/3"></div>
          <button
            className="self-center shadow bg-purple-500 hover:bg-purple-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded"
            type="submit"
            onClick={(e) => {
              handleLogin(e);
            }}
          >
            Log in the Chat
          </button>
        </div>
      </form>
    </Layouts>
  );
};

export default LoginPage;
