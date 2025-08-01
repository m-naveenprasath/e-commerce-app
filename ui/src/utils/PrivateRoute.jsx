import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const PrivateRoute = ({ children }) => {
  const { user,loading } = useContext(AuthContext);

  if (loading) return <div>Loading...</div>; // ✅ Wait until loading is false

  return user ? children : <Navigate to="/login" />;
};


export default PrivateRoute;
