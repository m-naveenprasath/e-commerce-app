import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const RoleBasedRoute = ({ children, allowedRole }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <div>Loading...</div>;

  const isAllowed = allowedRole === "admin" ? user?.is_admin : user?.is_customer;

  return isAllowed ? children : <Navigate to="/unauthorized" />;
};

export default RoleBasedRoute;
