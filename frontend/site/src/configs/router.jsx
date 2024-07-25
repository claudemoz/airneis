/* eslint-disable react-refresh/only-export-components */
import { createBrowserRouter } from "react-router-dom";
import { lazy } from "react";
import App from "../App";
// import rootLoader from "@/loaders/rootLoader";
import Security from "@/components/Security/Security";
import PaymentSecurity from "@/components/Security/PaymentSecurity";
// eslint-disable-next-line react-refresh/only-export-components

const ProductPage = lazy(() => import("../pages/ProductsPage/ProductPage"));
const Product = lazy(() => import("../pages/Product/Products"));
const HomePage = lazy(() => import("@/pages/HomePage/HomePage"));
const ProductDetailsPage = lazy(() =>
  import("@/pages/ProductDetailsPage/ProductDetailsPage")
);
const LoginPage = lazy(() => import("@/pages/LoginPage/LoginPage"));
const RegisterPage = lazy(() => import("@/pages/RegisterPage/RegisterPage"));
const ActiveAccountPage = lazy(() =>
  import("@/pages/ActiveAccountPage/ActiveAccountPage")
);
const ContactPage = lazy(() => import("@/pages/ContactPage/ContactPage"));
const ForgotPasswordPage = lazy(() =>
  import("@/pages/ForgotPasswordPage/ForgotPasswordPage")
);
const ResetPasswordPage = lazy(() =>
  import("@/pages/ResetPassword/ResetPasswordPage")
);
const OrderPage = lazy(() => import("@/pages/OrderPage/OrderPage"));
const NotFoundPage = lazy(() => import("@/pages/NotFoundPage/NotFoundPage"));
// const OrderDetailsPage = lazy(() => import("@/pages/OrderDetailsPage/OrderDetailsPage"));
const CartPage = lazy(() => import("@/pages/CartPage/CartPage"));
const OrderPaymentDetailPage = lazy(() =>
  import("@/pages/OrderPaymentDetailPage/OrderPaymentDetailPage")
);
const CheckoutPage = lazy(() => import("@/pages/CheckoutPage/CheckoutPage"));
const PaymentSuccessfulPage = lazy(() =>
  import("@/pages/PaymentSuccessfulPage/PaymentSuccessfulPage")
);
const Layout = lazy(() => import("@/pages/SettingsPage/Layout/Layout"));
const SettingsPage = lazy(() => import("@/pages/SettingsPage/SettingsPage"));
const ProfilePage = lazy(() => import("@/pages/SettingsPage/ProfilePage"));
const HelpPage = lazy(() => import("@/pages/SettingsPage/HelpPage"));
const SearchProductPage = lazy(() =>
  import("@/pages/SearchProductPage/SearchProductPage")
);
// const ProductCard = lazy(() => import("@/pages/CartPage/test/ProductCard"));

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    // loader: rootLoader,
    errorElement: <NotFoundPage />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "/login",
        element: <LoginPage />,
      },
      {
        path: "/register",
        element: <RegisterPage />,
      },
      {
        path: "/active-account",
        element: <ActiveAccountPage />,
      },
      {
        path: "/forgot-password",
        element: <ForgotPasswordPage />,
      },
      {
        path: "/reset-password",
        element: <ResetPasswordPage />,
      },
      {
        path: "/category/:categoryId",
        element: <ProductPage />,
      },
      {
        path: "/orders",
        element: (
          <Security>
            <OrderPage />
          </Security>
        ),
      },
      {
        path: "/product",
        element: <Product />,
      },
      {
        path: "/search",
        element: <SearchProductPage />,
      },
      {
        path: "/product-detail/:categoryId/:productId",
        element: <ProductDetailsPage />,
      },
      {
        path: "/product-detail/:productId",
        element: <ProductDetailsPage />,
      },
      {
        path: "/productDetails/:productId",
        element: <ProductDetailsPage />,
      },
      {
        path: "/contact",
        element: <ContactPage />,
      },
      {
        path: "/cart",
        element: <CartPage />,
      },
      {
        path: "/order-payment-detail",
        element: (
          <PaymentSecurity>
            <OrderPaymentDetailPage />
          </PaymentSecurity>
        ),
      },
      {
        path: "/checkout",
        element: (
          <PaymentSecurity>
            <CheckoutPage />
          </PaymentSecurity>
        ),
      },
      {
        path: "/payment-successful",
        element: <PaymentSuccessfulPage />,
      },
      {
        path: "/orders",
        element: <OrderPage />,
      },
      // {
      //   path:"/orderDetails",
      //   element: <OrderDetailsPage />,
      // },
      {
        path: "/settings",
        element: <Layout />,
        children: [
          {
            index: true,
            element: <SettingsPage />,
          },
          {
            path: "profile",
            element: <ProfilePage />,
          },
          {
            path: "help",
            element: <HelpPage />,
          },
        ],
      },
    ],
  },
]);
