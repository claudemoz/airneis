/* eslint-disable react/prop-types */
import { useNavigate } from 'react-router-dom';
import styles from "./CardCategory.module.css";

export default function CardCategory({ category }) {
  const navigate = useNavigate();
  return (
    <div className={styles.categorieCard} onClick={() => navigate(`/category/${category._id}`)}>
      <div className={styles.imgContainer}>
        <img src={category.image?.url} alt={category.name} />
      </div>
      <div className={styles.categorieName}>
        <h6>{category.name}</h6>
      </div>
    </div>
  );
}