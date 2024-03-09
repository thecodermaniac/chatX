import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import useAxios from "../useAxios";

const RegisterPage = () => {
  const navigate = useNavigate();
  const [register, setRegister] = useState({
    email: "",
    password: "",
    name: "",
  });

  function handleRegister(event: any) {
    event.preventDefault();
    useAxios
      .post("/api/user/register", { ...register })
      .then(function (response) {
        console.log(response.data.message);
        navigate("/");
      })
      .catch(function (error) {
        console.log(error.message);
      });
  }
  return (
    <div className="flex flex-col items-center h-screen justify-center">
      <form className="w-full max-w-sm flex flex-col space-y-6">
        <p className="block text-gray-500 font-bold text-center mb-1 md:mb-0 pr-4">
          {" "}
          Hello! new user. Welcome to ChatX
        </p>
        <div className="flex flex-col items-center mb-6 space-y-6">
          <label
            className="block text-gray-500 font-bold mb-1 md:mb-0 pr-4 w-full"
            htmlFor="email"
          >
            Username
          </label>
          <input
            className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
            id="username"
            type="text"
            placeholder="Your name or nickname"
            value={register.name}
            onChange={(e) => setRegister({ ...register, name: e.target.value })}
            required
          />
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
            value={register.email}
            onChange={(e) =>
              setRegister({ ...register, email: e.target.value })
            }
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
            value={register.password}
            onChange={(e) =>
              setRegister({ ...register, password: e.target.value })
            }
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
              handleRegister(e);
            }}
          >
            Register Yourself
          </button>
        </div>
      </form>
      <div>
        <p className="mx-auto text-md">
          Registered user ?{" "}
          <Link to={"/"} className="underline underline-offset-2 ">
            login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
