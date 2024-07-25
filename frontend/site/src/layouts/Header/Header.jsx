/* eslint-disable react-hooks/exhaustive-deps */
import {
  MdOutlineSearch,
  MdOutlineShoppingCart,
  MdDehaze,
  MdOutlineClose
} from "react-icons/md";
import { useEffect, useRef, useState } from "react";
import { CSSTransition } from "react-transition-group";
import { NavLink, useNavigate } from "react-router-dom";
import Drawer from "./components/Drawer";
import styles from "./Header.module.css";
// import LoginPage from "@/pages/LoginPage/LoginPage";
import { useDispatch, useSelector } from "react-redux";
import { setIsOpenMenu } from "@/redux/slices/configApp";
import { fetchCurrentUser, forceLogout, logout } from "@/redux/slices/auth";
import { addToCart, removeToCart } from "@/redux/slices/cart";
import { getProducts } from "@/api.services";
// import logo from "@/assets/images/logo.png";
import { v4 as uuidv4 } from 'uuid';

export default function Header() {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 575);
  const [openInputSearch, setOpenInputSearch] = useState(false);
  const [searchKey, setSearchKey] = useState("");
  const [displayCart, setDisplayCart] = useState(false);
  const [displayMenu, setDisplayMenu] = useState(false);
  const [searchProductList, setSearchProductList] = useState([]);
  const inputRef = useRef(null);
  const { isAuthenticated } = useSelector((state) => state.auth);
  // const { products } = useSelector((state) => state.products);
  const { totalProductToCart, totalPriceToCart,cart } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();
 
  const generateUUID = () => `p=${uuidv4()}${uuidv4()}${uuidv4()}${uuidv4()}${uuidv4()}${uuidv4()}${uuidv4()}${uuidv4()}${uuidv4()}`;
  // ###
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 575);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  // ###
  useEffect(() => {
    dispatch(fetchCurrentUser());
  }, []);
  useEffect(() => {
    if (!localStorage.getItem("token")) {
      dispatch(forceLogout());
    }
  }, [localStorage.getItem("token")]);
  const showCart = () =>{
    setDisplayCart(true)
    setDisplayMenu(false)
    dispatch(setIsOpenMenu())
  }
  const showMenu = () =>{
    setDisplayMenu(true)
    setDisplayCart(false)
    dispatch(setIsOpenMenu())
  }

  let requestTimeout;
  const searchProducts = async (e) =>{
    const searchKey = e.target.value.trim();
    setSearchKey(searchKey)
    clearTimeout( requestTimeout);
      requestTimeout = setTimeout(async ()=>{
        try {
          const response = await getProducts({searchKey});
          setSearchProductList(response);
        } catch (e) {
          setSearchProductList([]);
        }
      }, 1000);
  };
  const handleSearch = (val) => {
    const params = new URLSearchParams();
    params.append('k', val)
    setSearchKey('');
    navigate(`/search?${params}`);
  };

  return (
    <header
      className={`bg-white p-${isMobile ? "10" : "20"} ${styles.fixedHeader}`}
    >
      <nav>
        <div
          className={`d-flex gap-20 justify-content-${
            isMobile ? "between" : "around"
          } align-items-center`}
        >
          <h1 className={styles.logo} onClick={() => navigate('/')}>
            ÀIRNEIS
          </h1>
          {/* <img
            src={logo}
            alt=""
            width={isMobile ? 140 : 150}
            height={isMobile ? 30 : 40}
          /> */}
          {!isMobile && (
            <div
              className={`${styles.searchInputContainer} d-flex justify-content-center`}
            >
              <input
                type="text"
                placeholder="Rechercher..."
                className={`${styles.searchInput}`}
                // onInput={(e) => setSearchKey(e.target.value.trim())}
                onInput={(e) => searchProducts(e)}
                onFocus={(e) => setSearchKey(e.target.value.trim())}
              />
              {searchKey !== "" && searchProductList.length > 0 && (
                <>
                  <div
                    className={styles.searchOverlay}
                    onClick={() => setSearchKey("")}
                  ></div>
                  <div
                    className={`${styles.searchResult} d-flex flex-column justify-content-center gap-10`}
                  >{
                    searchProductList?.slice(0,10)?.map(p => (
                      <p className={styles.searchItemResult} key={p._id}>
                        <span className="p-5 d-flex" onClick={() => handleSearch(p.name)}>{p.name}</span>
                      </p>
                    ))
                  }
                  </div>
                </>
              )}
            </div>
          )}
          <div
            className={`d-flex justify-between align-items-center gap-${
              isMobile ? "10" : "20"
            }`}
          >
            {!!isMobile && !openInputSearch && (
              <MdOutlineSearch
                size={24}
                color="#000"
                className="cursor-pointer"
                onClick={() => setOpenInputSearch(!openInputSearch)}
              />
            )}

            <div className={styles.shoppingCartIconContainer} onClick={() => showCart()}>
              <MdOutlineShoppingCart
                size={24}
                className={` cursor-pointer`}
                color="#000"
              />
              {totalProductToCart !== 0 && <div className={`${styles.toProductToCart} cursor-pointer`}>{totalProductToCart}</div>}
            </div>
            <MdDehaze
              size={40}
              color="#000"
              className="cursor-pointer"
              onClick={() => showMenu()}
            />
          </div>
        </div>
        {isMobile && (
          <>
            <CSSTransition
              in={openInputSearch}
              inputRef={inputRef}
              timeout={300}
              unmountOnExit
            >
              <div ref={inputRef}></div>
            </CSSTransition>
            <CSSTransition
              in={openInputSearch}
              inputRef={inputRef}
              timeout={300}
              unmountOnExit
            >
              <div
              className={`${styles.searchInputContainer} d-flex justify-content-center`}
            >
              <input
                type="text"
                placeholder="Rechercher..."
                className={`${styles.searchInput}`}
                // onInput={(e) => setSearchKey(e.target.value.trim())}
                onInput={(e) => searchProducts(e)}
                onFocus={(e) => setSearchKey(e.target.value.trim())}
                onBlur={() => setOpenInputSearch(!openInputSearch)}
              />
              {searchKey !== "" && searchProductList.length > 0 && (
                <>
                  <div
                    className={styles.searchOverlay}
                    onClick={() => setSearchKey("")}
                  ></div>
                  <div
                    className={`${styles.searchResult} d-flex flex-column justify-content-center gap-10`}
                  >{
                    searchProductList?.slice(0,10)?.map(p => (
                      <p className={styles.searchItemResult} key={p._id}>
                        <span className="p-5 d-flex" onClick={() => handleSearch(p.name)}>{p.name}</span>
                      </p>
                    ))
                  }
                  </div>
                </>
              )}
            </div>
            </CSSTransition>
          </>
        )}
      </nav>
      <Drawer>
        {/* { displayCart && (
          <>
            <h4 className="p-10">Votre panier</h4>
            <div className="divider"></div></>
          )
        } */}
        {
          displayMenu ? (
            isAuthenticated ? (
              <ul className="d-flex flex-column gap-20 mt-30 p-30 ">
                <li>
                  <NavLink to="/settings" className={styles.menuItem}>Mes paramètres </NavLink>
                </li>
                <li>
                  <NavLink to="/orders" className={styles.menuItem}>Mes commandes </NavLink>
                </li>
                <li>
                  <NavLink to="" className={styles.menuItem}>
                    CGU
                  </NavLink>
                </li>
                <li>
                  <NavLink to="" className={styles.menuItem}>
                    Mentions légales
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/contact" className={styles.menuItem}>
                    Contact
                  </NavLink>
                </li>
                <li>
                  <NavLink to="" className={styles.menuItem}>
                    À propos
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    className={styles.menuItem}
                    onClick={() => dispatch(logout())}
                  >
                    Se déconnecter
                  </NavLink>
                </li>
              </ul>
            ) : (
              <ul className="d-flex flex-column gap-20 mt-30 p-30 ">
                <li>
                  <NavLink to="/login" className={styles.menuItem}>
                    Se connecter
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/register" className={styles.menuItem}>
                    S’inscrire
                  </NavLink>
                </li>
                <li>
                  <NavLink to="" className={styles.menuItem}>
                    CGU
                  </NavLink>
                </li>
                <li>
                  <NavLink to="" className={styles.menuItem}>
                    Mentions légales
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/contact" className={styles.menuItem}>
                    Contact
                  </NavLink>
                </li>
                <li>
                  <NavLink to="" className={styles.menuItem}>
                    À propos
                  </NavLink>
                </li>
              </ul>
            )
          ) : 
          displayCart && (
            <div className={styles.cartContainer}>
              {cart.length > 0 ? (
                <>
                  {cart.map(produit => (
                    <div key={produit._id} className={styles.cartProduct}>
                      <MdOutlineClose
                        className={`${styles.btnCloseMenu}`}
                        onClick={() => dispatch(removeToCart(produit._id))}
                        size={15}
                      />
                      <div className={styles.cartProductImage}>
                        <img src={produit.images?.[0].url} alt={produit.name} />
                      </div>
                      <div className={styles.cartProductInfo}>
                        <p className={styles.cartProductName}>
                          {produit.name.length > 60 ? `${produit.name.substring(0, 35)}...` : produit.name}
                        </p>
                        <div className={styles.cartProductInfoQP}>
                          <div className={styles.quantityContainer}>
                            <p className={styles.setQuantity} onClick={() => dispatch(removeToCart(produit._id))}>-</p>
                            <p className={styles.setQuantity} onClick={() => dispatch(addToCart(produit))}>+</p>
                          </div>
                          <div className={styles.cartProductPrice}>
                            {produit.price} € <span className={styles.cartProductquantity}>x{produit.quantity}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  <div className={styles.totalPrice}>
                    <p>TOTAL <span className={styles.totalproductCount}>({totalProductToCart} article{cart.length > 1 ? 's' : ''})</span></p>
                    <p className={styles.totalPriceToCart}>{totalPriceToCart} €</p>
                  </div>
                  <div className={styles.btnCartContainer}>
                    <button className={`btn ${styles.btnCart}`} onClick={() => navigate('/cart')}>Voir le panier</button>
                    <button className={`btn ${styles.btnOrder}`} onClick={() => navigate(`/order-payment-detail?${generateUUID()}`)} >Passer la commander</button>
                  </div>
                </>
          ) : (<p className={styles.cartEmpty}>Votre panier est vide</p>)}
          </div>

          )
        }
      </Drawer>
    </header>
  );
  //Sentry.withErrorBoundary(Example, { fallback: <p>an error has occurred</p> });
}
