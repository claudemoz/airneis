/* eslint-disable react-refresh/only-export-components */
import { createBrowserRouter } from "react-router-dom";
import { lazy } from "react";
import App from "../App";
import Security from "@/components/Security/Security";
// eslint-disable-next-line react-refresh/only-export-components
const LoginPage = lazy(() => import("@/pages/LoginPage/LoginPage"));
const DashboardPage = lazy(() => import("@/pages/DashboardPage/DashboardPage"));
const ProductPage = lazy(() => import("@/pages/ProductPage/ProductPage"));
const CategoryPage = lazy(() => import("@/pages/CategoryPage/CategoryPage"));
const ContactPage = lazy(() => import("@/pages/ContactPage/ContactPage"));
const OrderPage = lazy(() => import ('@/pages/OrderPage/OrderPage'));
const CustomerPage = lazy(() => import("@/pages/CustomerPage/CustomerPage"));
const MaterialPage =lazy(() => import ("@/pages/MaterialPage/MaterialPage"));
const AdminUserPage = lazy(() => import("@/pages/AdminUserPage/AdminUserPage"));
const NotFoundPage = lazy(() => import("@/pages/NotFoundPage/NotFoundPage"));

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <NotFoundPage />,
    children: [
      {
        index: true,
        element: <Security><DashboardPage /></Security>,
      },
      {
        path: "/dashboard",
        element: <Security><DashboardPage /></Security>,
      },
      {
        path: "/login",
        element: <LoginPage />,
      },
      {
        path: "/category",
        element: <Security><CategoryPage /></Security>,
      },
      {
        path: "/product",
        element: <Security><ProductPage /></Security>,
      },
      {
        path: "/user-customer",
        element:  <Security><CustomerPage /></Security>,
      },
      {
        path: "/user-admin",
        element: <Security><AdminUserPage /></Security>,
      },
      {
        path: "/contact",
        element: <Security><ContactPage /></Security>,
      },
      {
        path: "/order",
        element: <Security><OrderPage /></Security>,
      },
      {
        path : "/material",
        element : <Security><MaterialPage /></Security>
      }
    ],
  },
]);
