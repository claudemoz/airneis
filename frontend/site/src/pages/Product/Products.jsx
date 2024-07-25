//la page des produits: j'ai terminé
import React from "react";
import { useNavigate } from "react-router-dom";
import ProductData from "./ProductData";
import styles from "./products.module.css";

const Products = () => {
  const navigate = useNavigate();

  const handleProductClick = (productId) => {
    navigate(`/productDetails/${productId}`);
  };

  return (
    <div>
      <h1>Liste des Produits</h1>
      <div className={styles["product-list"]}>
        {ProductData.map((product) => (
          <div
            key={product.id}
            className={styles["product-item"]}
            onClick={() => handleProductClick(product.id)}
          >
            <img src={product.img} alt={product.name} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Products;
