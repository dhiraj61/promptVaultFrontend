import React, { Suspense, useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
const SidebarMenu = React.lazy(() => import("./components/SidebarMenu"));
import AppRoutes from "./routes/AppRoutes";
import axios from "axios";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Loading from "./components/Loading";

function App() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const api = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  async function fetchData() {
    const token = localStorage.getItem("token");
    if (!token) {
      setUserData(null);
      setLoading(false);
      return;
    }

    try {
      const res = await axios.get(`${api}/api/post/userPrompt`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserData(res.data.user);
    } catch (error) {
      localStorage.removeItem("token");
      setUserData(null);
      navigate("/login");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return <Loading/>
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
              <Suspense fallback={<Loading />}>
                <SidebarMenu />
                <AppRoutes />
              </Suspense>
            ) : (
              <Login />
            )
          }
        />
      </Routes>
    </>
  );
}

export default App;
