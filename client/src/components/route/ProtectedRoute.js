import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import Auth from "../Auth/Auth";

const ProtectedRoute = ({ fallback: FallbackComponent = Auth }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      const user = JSON.parse(localStorage.getItem("user"));
      setUser(user);
      setLoading(false);
      // console.log("User data is ", user);
    };
    fetchUserData();
  }, []);

  if (loading) {
    return <div id="loadingHeading">Loading data...</div>;
  }

  if (user?.role === "owner" && user?.property === "Restaurent") {
    const restaurent = JSON.parse(localStorage.getItem("restaurent"));
    if (restaurent) {
      return <Navigate to="/restaurentownerdashboard" />;
    }
  } else if (user?.role === "customer") {
    return <Navigate to="/selectdetails" />;
  } else if (user?.role === "owner" && user?.property === "Hotel") {
    const hotel = JSON.parse(localStorage.getItem("homeInfo"));
    if (hotel) {
      return <Navigate to="/yourhomedashboard" />;
    }
  }

  return <FallbackComponent />;
};

export default ProtectedRoute;
