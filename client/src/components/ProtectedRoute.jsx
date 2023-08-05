import { useContext } from "react";
import { Navigate } from "react-router-dom";
import UserContext from "../context/UserContext";

export default function ProtectedRoute({ children, adminOnly = false }) {
  const { user } = useContext(UserContext);
  console.log("User in ProtectedRoute:", user);
  if (user === undefined) {
    // hydration not yet complete
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return children;
}
