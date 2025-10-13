import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const PrivateRoute = ({ children, requireManager = false }) => {
  const auth = useSelector(state => state.auth);
  const isAuthenticated = auth?.isAuthenticated;
  const user = auth?.user;
  const isAdmin = user?.isAdmin || 
                 user?.position === '단장' || 
                 user?.position === '부단장' || 
                 (user?.position && user.position.includes('부장'));

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (requireManager && !isAdmin) {
    return <Navigate to="/" />;
  }

  return children;
};

export default PrivateRoute; 