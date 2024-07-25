import orders from '../dataOder.jsx';
import styles from "./MoreInformationsSection.module.css";

export default function MoreInformationsSection() {
  const orderId = "6235d64b3d259d35b8f6a001";//j'ai mis ce id pour afficher les informations d'un seul commande
  const order = orders.find(order => order._id === orderId);

  if (!order) {
    return <div>Order not found</div>;
  }

  return (
    <div>
      <div key={order._id}>
        <div className={styles.Totale}>
          <h2>Total:</h2>
          <h2>{order.price}$</h2>
        </div>
        <div className={styles.TVA} >
          <h3>TVA:</h3>
          <h3>800$</h3>
        </div>

        <hr />
        <div className={styles.DeliveryAddress}>
          <h3>Delivery Address:</h3>
          <p>{order.delivery_address}</p>
          <p>{order.phone}</p>
        </div>
        <hr />
        <div className={styles.BillingAddress}>
          <h3>Billing Address:</h3>
          <p>{order.billing_address}</p>
          <p>{order.phone}</p>
        </div>
        <hr />
        <div className={styles.PaymentMethod}>
          <h3>Payment Method:</h3>
          <p>{order.payment_method}</p>
          <h3>**** **** **** 4923</h3>
        </div>
        <hr />
      </div>
    </div>
  );
}
