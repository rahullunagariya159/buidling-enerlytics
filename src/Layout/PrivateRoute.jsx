import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../Context/AuthProvider";
import LoadingCover from "../Components/LoadingCover";

export default function PrivateRoute() {
  const { userId, isAuthenticated, setIsAuthenticated } = useAuth();
  const [isNotAuthorized, setIsNotAuthorized] = useState(false);

  useEffect(() => {
    if (userId) {
      setIsAuthenticated(true);
    } else if (!userId) {
      setTimeout(() => {
        setIsNotAuthorized(true);
      }, 1500);
    }
  }, [userId]);

  return !userId && !isAuthenticated && !isNotAuthorized ? (
    <LoadingCover show={!isAuthenticated} />
  ) : userId && isAuthenticated ? (
    <Outlet />
  ) : (
    isNotAuthorized && <Navigate to="/" />
  );
}
