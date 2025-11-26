import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const PrivateRoute = ({ children, requireManager = false, requireSuperAdmin = false }) => {
  const auth = useSelector(state => state.auth);
  const isAuthenticated = auth?.isAuthenticated;
  const user = auth?.user;
  const isSuperAdmin = user?.isSuperAdmin === true;
  const isAdmin = isSuperAdmin || 
                 user?.isAdmin || 
                 user?.position === '단장' || 
                 user?.position === '부단장' || 
                 (user?.position && user.position.includes('부장'));

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (requireSuperAdmin && !isSuperAdmin) {
    return <Navigate to="/" />;
  }

  if (requireManager && !isAdmin) {
    return <Navigate to="/" />;
  }

  return children;
};

export default PrivateRoute; 