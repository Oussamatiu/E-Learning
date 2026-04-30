import { Navigate } from 'react-router-dom';

const getUser = () => {
  try {
    return JSON.parse(localStorage.getItem('user') || '{}');
  } catch {
    return {};
  }
};

const isAuthenticated = () => !!localStorage.getItem('token');

const getRole = () => {
  const user = getUser();
  if (user.role_id === 3 || user.role?.title === 'admin') return 'admin';
  if (user.role_id === 2 || user.role?.title === 'instructor') return 'instructor';
  return 'student';
};

export const ProtectedRoute = ({ children, allowedRoles, redirectTo = '/' }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(getRole())) {
    return <Navigate to={redirectTo} replace />;
  }

  return children;
};

export const GuestRoute = ({ children }) => {
  if (isAuthenticated()) {
    const role = getRole();
    if (role === 'admin') return <Navigate to="/admin/dashboard" replace />;
    if (role === 'instructor') return <Navigate to="/instructor/dashboard" replace />;
    return <Navigate to="/student/dashboard" replace />;
  }
  return children;
};
