/* eslint-disable react/prop-types */
import { useSelector } from 'react-redux';
// import { useState } from 'react';
import { Navigate } from 'react-router-dom'

export default function Security({ children }) {
  const { isAuthenticated } = useSelector((state) => state.auth);
  // const [isAuthenticated, setIsAuthenticated] = useState(false);
  return isAuthenticated ? children : <Navigate to='/login'/>
}
