/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-unescaped-entities */
import styles from "./ProductPage.module.css";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import PuffLoader from "react-spinners/PuffLoader";
import BannerProduct from "./components/BannerProduct";
import { useParams } from "react-router-dom";
import CardProduct from "@/components/Shared/CardProduct";
import { fetchProductByCategory } from "@/redux/slices/products";


export default function ProductPage(){
  const dispatch = useDispatch();
  const { products, isLoading } = useSelector((state) => state.products);
  const { categoryId } = useParams();
  const category = products?.flatMap((item) => item.categories)?.find(c => c._id === categoryId );

  useEffect(() => {
    if(categoryId){
      dispatch(fetchProductByCategory(categoryId));
    }
  }, [categoryId,dispatch]);

  return (
    <div>
      {!isLoading && products?.length > 0 ? (
        <>
          <BannerProduct category={category} />
          <div className={styles.grid}>
            {products.map((product) => <CardProduct product={product} categoryId={categoryId} key={product._id}/>)}
          </div>
        </>
      ) : (
        <PuffLoader
          color="#000"
          loading={isLoading}
          cssOverride={{
            display: "flex",
            margin: "15% auto 0 auto",
            borderColor: "#000",
          }}
          size={80}
          aria-label="Loading Spinner"
          data-testid="loader"
        />
      )}
    </div>
  );
}
