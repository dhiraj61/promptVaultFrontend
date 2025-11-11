import { React, useEffect, useState } from "react"
import { Routes, Route } from "react-router-dom"
const SidebarMenu = React.lazy(() => import("./components/SidebarMenu"))
import AppRoutes from "./routes/AppRoutes"
import axios from "axios"
import Login from "./pages/Login"
import Register from "./pages/Register"
import { Suspense } from "react"
import Loading from "./components/Loading"

function App() {
  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(null)
  const api = import.meta.env.VITE_API_URL


  async function fetchData() {
    try {
      const res = await axios.get(`${api}/api/post/userPrompt`, { withCredentials: true })
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
                <Suspense fallback={<Loading />}>
                  <SidebarMenu />
                  <AppRoutes />
                </Suspense>
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
