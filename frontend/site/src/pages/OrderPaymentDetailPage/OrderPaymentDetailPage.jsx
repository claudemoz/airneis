import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./OrderPaymentDetailPage.module.css";
import { useDispatch, useSelector } from "react-redux";
// import { toast } from "sonner";
// import { checkout } from "@/api.services";
import { v4 as uuidv4 } from 'uuid';

export default function OrderPaymentDetailPage() {
  const { cart } = useSelector((state) => state.cart);
  const navigate = useNavigate();
  const location = useLocation();
  const initData= {
    lastname: "",
    firstname: "",
    address1: "",
    address2: "",
    city: "",
    zipcode: "",
  };

  const [orderData, setOrderData] = useState(initData);
  const [addressList, setAddressList] = useState([]);
  const [isShowaddressList, setIsShowaddressList] = useState(false);
  const [isAdd1, setIsAdd1] = useState(false);
  const [isAdd2, setIsAdd2] = useState(false);
  const [errors, setErrors] = useState({});
  // const dispatch = useDispatch();
  let requestTimeout;
  

  const handleSelectedAddress = (address) => {
    setIsShowaddressList(false);
    setIsAdd1(false);
    setIsAdd2(false);
    setOrderData({
      ...orderData,
      address1: isAdd1 ? address.name : orderData.address1,
      address2: isAdd2 ? address.name : orderData.address2,
      city: isAdd1 ? address.city : orderData.city,
      from_path: location.pathname
    });
    // console.log("orderData ", orderData);
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    if(name === "address1") setIsAdd1(true);
    if(name === "address2") setIsAdd2(true);
    console.log("value ", value);
    setOrderData({
      ...orderData,
      [name]: value,
    });
    searchAddress(value)
  };

  const generateUUID = () => `p=${uuidv4()}${uuidv4()}${uuidv4()}${uuidv4()}${uuidv4()}${uuidv4()}${uuidv4()}${uuidv4()}${uuidv4()}`;

  const searchAddress = async (value) =>{
    clearTimeout( requestTimeout);
      requestTimeout = setTimeout(async ()=>{
        try {
          console.log({address:value});
          const response = await (await fetch(`https://api-adresse.data.gouv.fr/search/?q=${value}&limit=10`)).json();
          setAddressList(response.features.map(e => e.properties));
          setIsShowaddressList(response.features.length > 0);
        } catch (e) {
          setAddressList([]);
        }
      }, 1000);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if(validateForm()){
      navigate(`/checkout?${generateUUID()}`,{state:{orderData}});
    }
    // dispatch(login(userData));
    // console.log(orderData);
    // setOrderData(initData);
    // navigate("/");
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = {};

    if (!orderData.firstname.trim()) {
      newErrors.firstname = 'Ce champ est obligatoire';
      isValid = false;
    }

    if (!orderData.lastname.trim()){
      newErrors.lastname = 'Ce champ est obligatoire';
      isValid = false;
    }

    if (!orderData.address1.trim()) {
      newErrors.address1 = "Ce champ est obligatoire";
      isValid = false;
    }
    if (!orderData.city.trim()) {
      newErrors.city = "Ce champ est obligatoire";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const orderItems = cart?.map(product => ({
    price_data: {
      currency: 'eur',
      product_data: {
        name:product.name,
        images: [product.images?.[0].url]
      },
      unit_amount: Number(product.price) * 100,
    },
    quantity: product.quantity,
  }));
    
  return (
    <div className={styles.container}>
        <h1 className={styles.form_title}>Livraison</h1>
        <form className={styles.form_container} onSubmit={handleSubmit}>
          {/* <div className={styles.form_group}>
            <select
              className={styles.form_input}
              name="firstname"
              placeholder="Choisir une adresse existante"
              onChange={handleChange}
            >
              <option disabled>Choisir une adresse existante</option>
              <option value={orderData.savedAddress} key=''>Maison </option>
            </select>
          </div> */}
          <div className={styles.form_group}>
            <label htmlFor="prenom">
              Prenom<span className="text-danger">*</span>
            </label>
            <input
              value={orderData.firstname}
              className={styles.form_input}
              type="text"
              name="firstname"
              placeholder=""
              onChange={handleChange}
            />
            {errors.firstname && <span className='text-danger mx-5 text-error'>{errors.firstname}</span>}
          </div>
          <div className={styles.form_group}>
            <label htmlFor="nom">
              Nom<span className="text-danger">*</span>
            </label>
            <input
              value={orderData.lastname}
              className={styles.form_input}
              type="text"
              name="lastname"
              placeholder=""
              onChange={handleChange}
            />
            {errors.lastname && <span className='text-danger mx-5 text-error'>{errors.lastname}</span>}
          </div>
          <div className={`${styles.form_group} relative`}>
            <label htmlFor="address1">
            Address 1<span className="text-danger">*</span>
            </label>
            <input
              value={orderData.address1}
              className={styles.form_input}
              type="text"
              name="address1"
              placeholder=""
              onChange={handleChange}
            />
            {errors.address1 && <span className='text-danger mx-5 text-error'>{errors.address1}</span>}
          </div>
          {(addressList.length > 0 && isShowaddressList && isAdd1) &&  (
            <div className={styles.addList}>
              {addressList.map(address => (
                <p key={address.id} onClick={() => handleSelectedAddress(address)} className={styles.addItem}>{address.label}</p>
              ))}
            </div>
          )}
          <div className={styles.form_group}>
            <label htmlFor="address2">
            Address 2
            </label>
            <input
              value={orderData.address2}
              className={styles.form_input}
              type="text"
              name="address2"
              placeholder=""
              onChange={handleChange}
            />
          </div>
          {(addressList.length > 0 && isShowaddressList && isAdd2) &&  (
            <div className={styles.addList}>
              {addressList.map(address => (
                <p key={address.id} onClick={() => handleSelectedAddress(address)} className={styles.addItem}>{address.label}</p>
              ))}
            </div>
          )}
          <div className={styles.form_group}>
            <label htmlFor="city">
              Ville<span className="text-danger">*</span>
            </label>
            <input
              value={orderData.city}
              className={styles.form_input}
              type="text"
              name="city"
              placeholder=""
              onChange={handleChange}
            />
            {errors.city && <span className='text-danger mx-5 text-error'>{errors.city}</span>}
          </div>
          <button className={`${styles.button} cursor-pointer`} onClick={handleSubmit}>
            Passer au paiement
          </button>
          {/* <button className={`${styles.button} cursor-pointer`} onClick={() => checkout(orderItems)}>
            Passer au paiement
          </button> */}
        </form>
      </div>
  )
}