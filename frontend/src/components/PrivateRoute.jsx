import { Navigate } from 'react-router-dom';
import { isTokenExpired, logout } from '../utils/auth';

const PrivateRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  if (!token || isTokenExpired(token)) {
    logout(); // ✅ auto logout
    return <Navigate to="/login" />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default PrivateRoute;
