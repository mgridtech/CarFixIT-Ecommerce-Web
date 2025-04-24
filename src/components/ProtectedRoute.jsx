import { Navigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useState, useEffect } from "react";

const ProtectedRoute = ({ isLoggedIn, children }) => {
  const [shouldRedirect, setShouldRedirect] = useState(false);

  useEffect(() => {
    if (!isLoggedIn) {
      toast.error("You are not logged in. Please login first!", {
        position: "top-right",
        autoClose: 1500, 
      });

      const timer = setTimeout(() => {
        setShouldRedirect(true);
      }, 2000);

      return () => clearTimeout(timer); 
    }
  }, [isLoggedIn]);

  if (shouldRedirect) {
    return <Navigate to="/login" />;
  }

  if (!isLoggedIn) {
    return null;
  }

  return children;
};

export default ProtectedRoute;