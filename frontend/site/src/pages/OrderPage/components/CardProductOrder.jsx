// import React, { useEffect, useState } from 'react';
// import { getProductbyId } from '../../../api.services/product.services.js';
// import orders from '../dataOder.jsx';
// import { FaTrashAlt } from 'react-icons/fa';
// import styles from '../components/CardProductOrder.module.css'


// function CardProductOrder({ order }) {
//   const [products, setProducts] = useState([]);
//   const [quantities, setQuantities] = useState({});

//   useEffect(() => {
//     const fetchProducts = async () => {
//       const productIds = order.order_items.map(item => item.productId);
//       const productsData = await Promise.all(productIds.map(id => getProductbyId(id)));
//       setProducts(productsData);

//       const initialQuantities = productsData.reduce((acc, product) => {
//         acc[product._id] = 1;
//         return acc;
//       }, {});
//       setQuantities(initialQuantities);
//     };

//     fetchProducts();
//   }, [order]);

//   const handleQuantityChange = (productId, event) => {
//     const newQuantities = { ...quantities, [productId]: event.target.value };
//     setQuantities(newQuantities);
//   };

 
//   return (
//     <div>
//       {products.map(product => (
//         <div key={product._id} className={styles.card}>
//           <img src={product.image} alt={product.name} className={styles.cardImg} />
//           <div className={styles.cardBody}>
//             <h5 className={styles.cardTitle}>{product.name}</h5>
//             <p className={styles.cardText}>{product.description}</p>
//           </div>
//           <div className={`input-group mb-3 ${styles.inputGroup}`}>
//             <div className={styles.cardPrice}>
//               <h5 className={styles.cardPrice}>{product.price} euros</h5>
//             </div>
//             <input
//               type="number"
//               className={styles.formcontrol}
//               value={quantities[product._id]}
//               onChange={event => handleQuantityChange(product._id, event)}
//             />
//             <div className={styles.inputgroupappend}>
//               <button className="btn btn-danger" type="button">
//                 <FaTrashAlt />
//               </button>
//             </div>
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// }

// export default CardProductOrder;
