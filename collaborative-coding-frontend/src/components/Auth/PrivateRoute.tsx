import React from 'react';
import { Navigate } from 'react-router-dom';

interface PrivateRouteProps {
  component: React.ComponentType;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ component: Component }) => {
  const isAuthenticated = localStorage.getItem('token') !== null;

  if (isAuthenticated) {
    return <Component />;
  } else {
    return <Navigate to="/login" replace />;
  }
};

export default PrivateRoute;