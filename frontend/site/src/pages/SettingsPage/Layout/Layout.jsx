import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import styles from "./Layout.module.css";

export default function Layout() {
  return (
    <div className={styles.pageContainer}>
      <div className={styles.leftContainer}>
        <Navbar />
      </div>
      <div className={styles.rightContainer}>
        <Outlet />
      </div>
    </div>
  );
}