/* eslint-disable react/prop-types */
import styles from "./BannerProduct.module.css";
import parse from 'html-react-parser';
const BannerProduct = ({ category }) => {
  const parsedDescription = typeof category?.description === 'string' ? parse(category?.description) : 'Description not available';
  return (
    <div className={styles.banner}>
      <div className={styles.bannerDescription}>
        <h1>{category?.name}</h1>
        <div className={styles.bannerDescriptionContent}>{parsedDescription}</div>
      </div>
      <div className={styles.bannerImage}  style={{ 
        backgroundImage: `url(${category?.image?.url})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        imageRendering: 'auto',
      }}></div>
    </div>
  );
};

export default BannerProduct;
