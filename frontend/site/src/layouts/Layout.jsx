/* eslint-disable react-hooks/exhaustive-deps */
import PropTypes from "prop-types";
import Header from "./Header/Header";
import Footer from "./Footer/Footer";
import styles from "./Layout.module.css";
import { Toaster } from "sonner";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { setIsOpenMenu } from "@/redux/slices/configApp";

export default function Layout({ children }) {
  const location = useLocation();
  const { isOpenMenu } = useSelector((state) => state.configApp);
  const dispatch = useDispatch();

  useEffect(() => {
    if (isOpenMenu) {
      dispatch(setIsOpenMenu());
    }
  }, [location]);

  return (
    <div className={styles.mainLayout}>
      <Header />
      <main className="flex-auto">{children}</main>
      <Toaster expand={false} visibleToasts={1} richColors />
      <Footer />
    </div>
  );
}
Layout.propTypes = {
  children: PropTypes.node.isRequired,
};
