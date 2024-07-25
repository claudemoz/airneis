import React from "react";
import { useParams } from "react-router-dom";
import ProductData from "../ProductData";
import styles from "./CardDetails.module.css";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

const CardDetails = () => {
  const { productId } = useParams();
  const product = ProductData.find((product) => product.id === productId);

  return (
    <div className={styles.cardDetails}>
      {/* <h1>Détails du Produit</h1> */}
      <div className={styles.productContainer}>
        {/* Carrousel */}
        {product && (
          <div className={styles.carousel}>
            <Carousel
              showArrows={false}
              autoPlay={true}
              interval={3600}
              infiniteLoop={true}
              showThumbs={false}
              showStatus={false}
            >
              {product.img1 && (
                <div>
                  <img src={product.img1} alt={`${product.name} 1`} />
                </div>
              )}
              {product.img2 && (
                <div>
                  <img src={product.img2} alt={`${product.name} 2`} />
                </div>
              )}
            </Carousel>
          </div>
        )}
        {/* Partie droite: Nom, Prix, Description */}
        {product && (
          <div className={styles.productInfo}>
            <div className={styles.productTitre}>
              <p>Prix: {product.prix}</p>
              <div className={styles.nameStock}>
                <h2>{product.name}</h2>
                <p>Stock: {product.stock}</p>
              </div>
            </div>
            <div className={styles.description}>
              <p>Description: {product.description}</p>
            </div>
            <button className={styles.btnPanier}>Ajouter au panier</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CardDetails;
