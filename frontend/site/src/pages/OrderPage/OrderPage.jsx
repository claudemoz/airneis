/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import styles from "./OrderPage.module.css";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrdersByUser } from "@/redux/slices/orders";
import dayjs from 'dayjs';

export default function OrderPage() {
  const { orders } = useSelector((state) => state.orders);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchOrdersByUser());
  }, []);

  const status_trad = [
    { value: 'pending', label: 'En attente' },
    { value: 'processing', label: 'En cours de traitement' },
    { value: 'shipped', label: 'Expédiée' },
    { value: 'delivered', label: 'Livrée' },
    { value: 'cancelled', label: 'Annulée' },
  ]
  return (
    <div className={styles.order_container}> 
      <div>
        <h1 className="d-flex justify-content-center">Mes commandes</h1>
        {
          orders?.map(item => (
            <div key={item._id}>
              <h3 className="mt-20">{item._id}</h3>
              <div className={styles.order_divider}></div> 
              {
                item?.orders.map(order => (
                  <div  key={order._id} className={`d-flex justify-content-between algin-items-center gap-40 mb-5 ${styles.card}  `}>
                    <div className="d-flex flex-column justify-content-center  gap-5">
                      <p className={styles.order_dateNum}>{dayjs(order.date).format('DD/MM/YYYY')} - N° {order.reference}</p> 
                      <p className={styles.order_items}>{order.totalItems} article{order.totalItems > 1 ? 's' : ''}</p>
                    </div>
                    <div className="d-flex flex-column justify-content-center  gap-5">
                      <p className={styles.order_status}>{status_trad.find(s => s.value === order.status)?.label}</p> 
                      <p className={styles.order_price}>{order.price} €</p>
                    </div>
                  </div>
                ))
              }
            </div>
          ))
        }
      </div>
    </div>
  );
}
