import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { isLoggedIn, isSessionValid } from '../utils/sessionUtils';

const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  if (!isLoggedIn() || !isSessionValid()) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;