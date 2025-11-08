import { useEffect, useState } from "react"
import SidebarMenu from "./components/SidebarMenu"
import AppRoutes from "./routes/AppRoutes"
import axios from "axios"
import Login from "./pages/Login"

function App() {
  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(null)

  useEffect(() => {
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
    fetchData()
  }, [])
  if (loading) {
    return <p className="text-center mt-10">Checking session...</p>;
  }
  return (
    <>
      {
        userData ? (
          <>
            <SidebarMenu />
            <AppRoutes />
          </>
        ) : (
          <Login />
        )
      }
    </>
  )
}

export default App
