/* eslint-disable react/prop-types */
import { useNavigate } from "react-router-dom";
import styles from "./CardProduct.module.css";
import ReactStars from "react-rating-stars-component";
import { BsCartPlusFill, BsFillCartCheckFill  } from "react-icons/bs";
import { addToCart } from "@/redux/slices/cart";
import { useDispatch, useSelector } from "react-redux";

export default function CardProduct({ product, categoryId }) {
const navigate = useNavigate();
const dispatch = useDispatch();
const { cart } = useSelector((state) => state.cart);
const { products } = useSelector((state) => state.products);
// const state = { product };
//   if (categoryId) {
//     state.categoryId = categoryId;
//   }
  const ratingChanged = (newRating) => {
    console.log(newRating);
  }
  const handleCardClick = () => {
    if(categoryId){
      navigate(`/product-detail/${categoryId}/${product._id}`);
    }else{
      navigate(`/product-detail/${product._id}`);
    }
    
  };
  const handleCartClick = (product, event) => {
    event.stopPropagation();
    dispatch(addToCart(product))
  };
  return (
    <div className={styles.productCard} onClick={handleCardClick}>
      <div key={product.id} className={styles.productCard}>
        <div className={styles.productCardTop}>
          <img className={styles.img} src={product.images?.[0].url} alt={product.name} />
        </div>
        <div className={`d-flex flex-column justify-content-between ${styles.productCardBottom}`}>
          <p className={styles.productName}>{product.name.length > 50 ? `${product.name.substring(0, 100)}...` : product.name}</p>
          <ReactStars
              className="mt-10"
              count={5}
              size={24}
              isHalf
              edit={false}
              value={5}
              activeColor="#ffd700"
            />
          <div className="d-flex justify-content-between align-items-center mb-5">
            <p className="mt-5">{String(product.price)?.includes('.') ? String(product.price)?.replace('.', ',') : product.price} € </p>
            {
              cart.some(p => p._id === product._id) ? (
                <BsFillCartCheckFill   
                  size={24} 
                  onClick={(e)=>handleCartClick(product,e)} 
                  color={cart.some(p => p._id === product._id) ? "#f1c40f" : "" }
                />
              ) : (
                <BsCartPlusFill  
                  size={24} 
                  onClick={(e)=>handleCartClick(product,e)} 
                />
              )
            }
          </div>
        </div>
      </div>
    </div>
  );
}
