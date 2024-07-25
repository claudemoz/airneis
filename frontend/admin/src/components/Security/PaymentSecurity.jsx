/* eslint-disable react/prop-types */
import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom'

export default function PaymentSecurity({ children }) {
  const location = useLocation();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { cart } = useSelector((state) => state.cart);
  return (isAuthenticated && cart.length > 0) 
  ? children 
  : isAuthenticated  && cart.length === 0
  ? <Navigate to='/'/> 
  :<Navigate to='/login' state={{ from_path: location.pathname }}/>
}
