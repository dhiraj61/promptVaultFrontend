import axios from "axios"
import { useState } from "react"
import { useNavigate } from "react-router-dom"

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await axios.post(
        "http://localhost:3000/api/auth/login",
        { email, password },
        { withCredentials: true }
      );

      if (res) {
        navigate("/profile");
      }
    } catch (err) {
      console.error("Login failed:", err.response?.data || err.message);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-gray-50 w-full min-h-dvh flex flex-col justify-center items-center gap-4 p-4">
      <input className="w-full h-16 border-b outline-0 p-4 " type="text" value={email} onChange={(e) => { setEmail(e.target.value) }} placeholder="johndoe@gmail.com" />
      <input className="w-full h-16 border-b outline-0 p-4 " type="text" value={password} onChange={(e) => { setPassword(e.target.value) }} placeholder="******" />
      <button className="w-1/2 p-4 rounded-2xl shadow-2xl text-2xl active:scale-95">Login</button>
    </form>
  )
}

export default Login