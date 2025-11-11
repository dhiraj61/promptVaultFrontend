import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate()
  const api = import.meta.env.VITE_API_URL


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${api}/auth/login`,
        { email, password },
        { withCredentials: true }
      );

      if (res) {
        window.location.href = '/profile'
      }
    } catch (err) {
      toast.error("Login failed:", err.response?.data || err.message);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-gray-50 w-full min-h-dvh flex flex-col justify-center items-center gap-4 px-[8vw] sm:px-[18vw] md:px-[25vw] xl:px-[30vw] 2xl:px-[32vw] py-4"
    >
      <input
        className="w-full h-16 border-b outline-0 p-4 "
        type="text"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
        }}
        placeholder="johndoe@gmail.com"
        required
      />
      <input
        className="w-full h-16 border-b outline-0 p-4 "
        type="password"
        value={password}
        onChange={(e) => {
          setPassword(e.target.value);
        }}
        placeholder="******"
        required
      />
      <button className="w-1/2 p-4 rounded-2xl shadow-2xl text-2xl active:scale-95">
        Login
      </button>
      <div className="flex flex-row gap-2">
        <h1 className="text-gray-400">Don't Have an Account ? </h1>
        <h1
          className="text-blue-500"
          onClick={() => {
            navigate("/register");
          }}
        >
          Register
        </h1>
      </div>
    </form>
  );
};

export default Login;
