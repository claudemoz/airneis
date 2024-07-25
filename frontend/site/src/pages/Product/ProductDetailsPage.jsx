//la page qui envloppe tout
import React from "react";
import BannerProductDetails from "./components/BannerProductDetails.jsx";
import CardDetails from "./components/CardDetails.jsx";
import SimilarProduct from "./components/SimilarProduct.jsx";

export const ProductDetailsPage = () => {
  return (
    <div>
      <BannerProductDetails />
      <CardDetails />
      <SimilarProduct />
    </div>
  );
};

export default ProductDetailsPage;
