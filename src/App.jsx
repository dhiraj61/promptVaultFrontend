import { useEffect, useState } from "react"
import { Routes, Route } from "react-router-dom"
import SidebarMenu from "./components/SidebarMenu"
import AppRoutes from "./routes/AppRoutes"
import axios from "axios"
import Login from "./pages/Login"
import Register from "./pages/Register"

function App() {
  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(null)

  async function fetchData() {
    try {
      const res = await axios.get('http://localhost:3000/api/post/userPrompt', { withCredentials: true })
      setUserData(res.data.data)
    } catch (error) {
      console.log('User Not logged in', error)
      setUserData(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])
  if (loading) {
    return <p className="text-center mt-10">Checking session...</p>;
  }
  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/*"
          element={
            userData ? (
              <>
                <SidebarMenu />
                <AppRoutes />
              </>
            ) : (
              <Login />
            )
          }
        />
      </Routes>
    </>
  )
}

export default App
