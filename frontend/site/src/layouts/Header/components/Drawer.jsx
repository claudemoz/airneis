/* eslint-disable react/prop-types */
import { MdOutlineClose } from "react-icons/md";

import { CSSTransition } from "react-transition-group";
import styles from "./Drawer.module.css";
import { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setIsOpenMenu } from "@/redux/slices/configApp";
export default function Drawer({ children }) {
  const ref = useRef(null);
  const { isOpenMenu } = useSelector(state => state.configApp);
  const dispatch = useDispatch();
  return (
    <>
      {isOpenMenu && (
        <div className={styles.menuOverlay} onClick={() => dispatch(setIsOpenMenu())}></div>
      )}
      <CSSTransition
        in={isOpenMenu}
        nodeRef={ref}
        timeout={300}
        unmountOnExit
        classNames={styles}
        onEnter={() => document.body.classList.add(styles.noScroll)}
        onExited={() => document.body.classList.remove(styles.noScroll)}
      >
        <div ref={ref} className={`${styles.menuContainer}`}>
          <MdOutlineClose
            className={`${styles.btnCloseMenu}`}
            onClick={() => dispatch(setIsOpenMenu())}
            size={32}
          />
          {children}
        </div>
      </CSSTransition>
    </>
  );
}
