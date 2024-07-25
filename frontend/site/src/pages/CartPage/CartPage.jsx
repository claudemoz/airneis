import { useDispatch, useSelector } from "react-redux";
import styles from "./CartPage.module.css";
import parse from "html-react-parser";
import { MdOutlineClose } from "react-icons/md";
import { addToCart, removeToCart } from "@/redux/slices/cart";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from 'uuid';

export default function CartPage() {
  const { totalProductToCart, totalPriceToCart,cart } = useSelector((state) => state.cart);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const generateUUID = () => `p=${uuidv4()}${uuidv4()}${uuidv4()}${uuidv4()}${uuidv4()}${uuidv4()}${uuidv4()}${uuidv4()}${uuidv4()}`;
  return (
    <div className={styles.grid}>
      <div className={styles.left}>
        <div className={`${styles.card} ${styles.cardLeft}`}>
          <h2>Votre panier</h2>
          <div className="divider mt-20"></div>
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
                          {produit.name}
                        </p>
                        <p className={styles.cartProductDescription}>{produit.description.length > 100 ? parse(`${produit.description.substring(0, 500)}...`) : produit.description}</p>
                        <div className={styles.cartProductInfoQP}>
                          <div className="d-flex align-items-center">
                            <p  className={`${styles.cartProductquantity} mr-5`}>Qté:</p> 
                            <div className={styles.quantityContainer}>
                              <p className={styles.setQuantity} onClick={() => dispatch(removeToCart(produit._id))}>-</p>
                              <p className={styles.setQuantity} onClick={() => dispatch(addToCart(produit))}>+</p>
                            </div>
                          </div>
                          <div className={styles.cartProductPrice}>
                            {produit.price} € <span className={styles.cartProductquantity}>x{produit.quantity}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                </>
          ) : (<p className={styles.cartEmpty}>Votre panier est vide</p>)}
          </div>
        </div>
      </div>
      <div className={styles.rigth}>
        <div className={`${styles.card} ${styles.cardRigth}`}>
          <div className={styles.totalPrice}>
            <p>TOTAL <span className={styles.totalproductCount}>({totalProductToCart} article{cart.length > 1 ? 's' : ''})</span></p>
            <p className={styles.totalPriceToCart}>{totalPriceToCart} €</p>
          </div>
          <div className={styles.productTva}>
            <p className={styles.tva}>TVA</p>
            <p className={styles.tva}>200 €</p>
          </div>
          <button className={`btn ${styles.btnOrder}`} onClick={() => navigate(`/order-payment-detail?${generateUUID()}`)}>Passer la commander</button>
        </div>
      </div>
    </div>
  )
}

