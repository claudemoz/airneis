//import React from "react";
import ProductData from "../ProductData.jsx";
import { useNavigate } from "react-router-dom";
import styles from "./SimilarProduct.module.css"; // Assurez-vous d'importer le bon fichier CSS

const SimilarPage = () => {
  const navigate = useNavigate();

  const handleProductClick = (productId) => {
    navigate(`/productDetails/${productId}`);
  };
  const visibleProducts = ProductData.slice(0, 6);

  return (
    <div>
      <h2>Produits similaires</h2>
      <div className={styles.similarProductsContainer}>
        {visibleProducts.map((product) => (
          <div key={product.id} className={styles.productCard}>
            {" "}
            <img className={styles.img} src={product.img} alt={product.name} />
            <h3>{product.name}</h3>
            <p>Prix: {product.prix} € </p>
            <button
              className={styles.btn_view}
              onClick={() => handleProductClick(product.id)}
            >
              Voir Details
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SimilarPage;
