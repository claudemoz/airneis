/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import styles from "./ProductDetailsPage.module.css";
import { useParams } from "react-router-dom";
import ReactImageMagnify from 'react-image-magnify';
import parse from 'html-react-parser';
import { useDispatch, useSelector } from "react-redux";
import CardProduct from "@/components/Shared/CardProduct";
import { addToCart } from "@/redux/slices/cart";
// import { fetchProductByCategory } from "@/redux/slices/products";

export default function ProductDetailsPage() {
  const dispatch = useDispatch();
  const { products } = useSelector((state) => state.products);
  const {categoryId, productId} = useParams()
  const product = products?.find(p => p._id === productId);
  const [img, setImg] = useState(null);
  const [images, setImages] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const similarProducts = products.filter(p => p._id !== productId)

  // useEffect(() => {
  //   if(categoryId){
  //     dispatch(fetchProductByCategory(categoryId));
  //   }
  // }, [categoryId]);

  useEffect(() => {
    setImages(product?.images) 
    setImg(product?.images[0].url)
  }, [productId]);

  const hoverHandler = (image, i) => {
    setImg(image.url);
    setActiveIndex(i)
};

  return (
    <div className={styles.container}>
      <div className={styles.descriptionContainer}>
        <div className={styles.detailLeftImg}> 
          <div className={`${styles.detailLeftImgHover}`}>
            {
              images?.map((image, i) => (
                <div
                    className={`${styles.imgHover} ${i === activeIndex ? styles.active : ''}`}
                    key={i}
                    onMouseOver={() => hoverHandler(image, i)}
                >
                    <img src={image.url} alt="" />
                </div>
              ))
            }
          </div>
          <div className={styles.detailLeftImgMain}>
            <ReactImageMagnify
              {...{
                  smallImage: {
                      alt: '',
                      isFluidWidth: true,
                      src: img,
                  },
                  largeImage: {
                      src: img,
                      width: 629,
                      height: 629,
                  },
                  enlargedImageContainerDimensions: {
                    width: '80%',
                    height: '80%',
                  },
              }}
            />
          </div>
        </div>
        <div className={styles.detailRigth}>
          <div className={styles.detailRigthTopContent}> 
            <p className={styles.detailRigthPrice}>prix: {product?.price} €</p>
            <p className={styles.detailRigthName}>product name: {product?.name}</p>
          </div>
          <p className={styles.detailRigthStock} style={{color: product?.stock > 0 ? '#27ae60' : '#f39c12'}}>{product?.stock > 0 ? 'En stock' : 'Stock épuisé'} </p>
          <p className={styles.detailRigthDesc}> {product ? parse(product?.description) : null}</p>
          <div className="d-flex justify-content-center">
            <button className={styles.detailRigthButton} onClick={() => dispatch(addToCart(product))} >Ajouter au panier</button>
          </div>
        </div>
      </div>
      <div className={styles.grid}>
            {similarProducts.map((product) => <CardProduct product={product} categoryId={categoryId} key={product._id}/>)}
          </div>
    </div>
  )
}
