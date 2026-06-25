
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, requiredRole }) => {
  // Get user data from localStorage
  const token = localStorage.getItem('token');
  const userData = localStorage.getItem('user');
  
  // Check if user is logged in
  if (!token) {
    // If role is admin, redirect to admin login
    if (requiredRole === 'admin') {
      return <Navigate to="/admin-login" />;
    }
    // Otherwise redirect to regular login
    return <Navigate to="/login" />;
  }

  // If role is required, check it
  if (requiredRole) {
    try {
      const user = JSON.parse(userData);
      
      // If user doesn't have the required role
      if (user.role !== requiredRole) {
        // If trying to access admin but not admin
        if (requiredRole === 'admin') {
          return <Navigate to="/admin-login" />;
        }
        // Otherwise redirect to home
        return <Navigate to="/" />;
      }
    } catch (error) {
      console.error('Error parsing user data:', error);
      // Redirect based on required role
      if (requiredRole === 'admin') {
        return <Navigate to="/admin-login" />;
      }
      return <Navigate to="/login" />;
    }
  }

  return children;
};

export default ProtectedRoute;
