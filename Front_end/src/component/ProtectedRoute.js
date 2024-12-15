import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ isAllowed, redirectPath = "/", children }) => {
  console.log(redirectPath);
  if (!isAllowed) {

    return <Navigate to={redirectPath} />;
  }
  return <>{children}</>;
};

export default ProtectedRoute