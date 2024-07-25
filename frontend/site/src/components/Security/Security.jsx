/* eslint-disable react/prop-types */
import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom'

export default function Security({ children }) {
  const location = useLocation();
  const { isAuthenticated } = useSelector((state) => state.auth);
  return isAuthenticated ? children : <Navigate to='/login' state={{ from: location.pathname }}/>
}
