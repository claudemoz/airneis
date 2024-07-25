import React from "react";
import { useParams } from "react-router-dom";
import ProductData from "../ProductData";
import styles from "./BannerProductDetails.module.css";

const BannerProductDetails = () => {
  const { productId } = useParams();
  const product = ProductData.find((product) => product.id === productId);

  return (
    <div className={styles.BannerProductDetails}>
      {product && (
        <div className={styles.productImage}>
          <img src={product.img} alt={`${product.name}`} />
        </div>
      )}
    </div>
  );
};

export default BannerProductDetails;
