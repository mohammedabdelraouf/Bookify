import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('userRole');

    // Check if user is logged in
    if (!token) {
      alert('Please login to access this page');
      navigate('/login');
      return;
    }

    // Check if user has Admin role
    if (userRole !== 'Admin') {
      alert('Access denied. Admin privileges required.');
      navigate('/rooms');
      return;
    }
  }, [navigate]);

  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('userRole');

  // If user is authenticated and is admin, render the protected content
  if (token && userRole === 'Admin') {
    return children;
  }

  // Otherwise, return null while redirect is happening
  return null;
};

export default ProtectedRoute;
