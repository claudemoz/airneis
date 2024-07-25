import { LuLinkedin, LuFacebook, LuInstagram } from "react-icons/lu";
import styles from "./Footer.module.css";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer
      className={`${styles.footerContainer} d-flex justify-content-between align-items-center`}
    >
      <div className="d-flex justify-content-between gap-10">
        <Link className={styles.footerItem}>CGU</Link>
        <Link className={styles.footerItem}>Mentions légales</Link>
        <Link className={styles.footerItem}>Contact</Link>
      </div>
      <div className="d-flex justify-content-between gap-10">
        <Link className={styles.footerItem}>
          <LuLinkedin size={24} />
        </Link>
        <Link className={styles.footerItem}>
          <LuFacebook size={24} />
        </Link>
        <Link className={styles.footerItem}>
          <LuInstagram size={24} />
        </Link>
      </div>
    </footer>
  );
}
