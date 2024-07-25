/* eslint-disable react/prop-types */

import './ProductCard.css'; // Assurez-vous de créer un fichier CSS correspondant

const Card = ({ product }) => {
  return (
    <div className="product-card">
      <img src={product.image} alt={product.name} className="product-image" />
      <div className="product-info">
        <h5 className="product-name">{product.name}</h5>
        <p className="product-description">{product.description}</p>
        <div className="product-bottom">
          <span className="product-price">{`$${product.price.toFixed(2)}`}</span>
          {/* Bouton pour ajouter au panier, par exemple */}
          <button className="add-to-cart-btn">Ajouter au panier</button>
        </div>
      </div>
    </div>
  );
};

const ProductCard = () => {
  const product = {
    name: 'Chaise en bois',
    description: 'Une chaise en bois confortable et élégante',
    price: 49.99,
    image: 'https://res.cloudinary.com/daogrxxyw/image/upload/v1714937802/Ecommerce_B3/images/categories/dev/Aush-c246VR-V3TsQ0EBy8mK.jpg'
  };

  return (
    <div className="app">
      <Card product={product} />
    </div>
  );
};
export default ProductCard;