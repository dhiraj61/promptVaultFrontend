import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [preview, setPreview] = useState(null);
  const api = import.meta.env.VITE_API_URL


  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setAvatar(file);
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("email", email);
      formData.append("password", password);
      if (avatar) formData.append("avatar", avatar);

      const res = await axios.post(
        `${api}/api/auth/register`,
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (res.status === 201 || res.status === 200) {
        toast.success("Registered successfully!");
        navigate("/login")
      }
    } catch (err) {
      console.error("Registration failed:", err.response?.data || err.message);
      toast.error(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-gray-50 w-full min-h-dvh flex flex-col justify-center items-center gap-4 px-[8vw] sm:px-[18vw] md:px-[25vw] xl:px-[30vw] 2xl:px-[32vw] py-4"
    >
      <img
        src={preview || "https://via.placeholder.com/100"}
        alt="avatar preview"
        className="w-24 h-24 rounded-full object-cover"
      />

      <input
        type="file"
        className="w-full h-16 border-b outline-0 p-4"
        onChange={handleFileChange}
        required
      />

      <input
        className="w-full h-16 border-b outline-0 p-4"
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="John Doe"
        required
      />

      <input
        className="w-full h-16 border-b outline-0 p-4"
        type="text"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="johndoe@gmail.com"
        required
      />

      <input
        className="w-full h-16 border-b outline-0 p-4"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="******"
        required
      />

      <button className="w-1/2 p-4 rounded-2xl shadow-2xl text-2xl active:scale-95">
        Register
      </button>

      <div className="flex flex-row gap-2">
        <h1 className="text-gray-400">Have an Account?</h1>
        <h1
          className="text-blue-500 cursor-pointer"
          onClick={() => navigate("/login")}
        >
          Login
        </h1>
      </div>
    </form>
  );
};

export default Register;
