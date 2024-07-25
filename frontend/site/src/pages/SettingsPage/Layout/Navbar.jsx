import { Link } from 'react-router-dom';
import styles from './Navbar.module.css';
import { FaShoppingCart, FaUser, FaCog, FaQuestionCircle } from 'react-icons/fa';

export default function Navbar(){
  return (
    <nav className={styles.leftNavbar}>
      <ul>
        <li>
          <Link to="/settings" className={styles.navLink}>
          <FaCog className={styles.navIcon} /> Paramètres</Link>
        </li>
        <li>
          <Link to="/settings/profile" className={styles.navLink}>
          <FaUser className={styles.navIcon} /> Profile</Link>
        </li>
        <li>
          <Link to="/settings/help" className={styles.navLink}>
          <FaQuestionCircle className={styles.navIcon} /> Help</Link>
        </li>
      </ul>
    </nav>
  );
}