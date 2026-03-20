import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Loader } from "./Loader";

export const ProtectedRoute = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <Loader label="Checking session..." />;
  }

  return user ? <Outlet /> : <Navigate to="/login" replace />;
};
