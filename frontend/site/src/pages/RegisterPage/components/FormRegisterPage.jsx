/* eslint-disable react/no-unescaped-entities */
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./FormRegisterPage.module.css";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { register } from "@/redux/slices/auth";

export default function FormRegisterPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const initData= {
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    passwordConfirm: "",
  };

  const [formData, setFormData] = useState(initData);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log("value ", value);
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  

  const validateForm = () => {
    let isValid = true;
    const newErrors = {};

    if (!formData.firstname.trim()) {
        newErrors.firstname = 'Ce champ est obligatoire';
        isValid = false;
    }

    if (!formData.lastname.trim()) {
        newErrors.lastname = 'Ce champ est obligatoire';
        isValid = false;
    }

    if (!formData.email.trim()) {
        newErrors.email = 'Ce champ est obligatoire';
        isValid = false;
    }

    if (!formData.password.trim()) {
        newErrors.password = 'Ce champ est obligatoire';
        isValid = false;
    } else if (formData.password.trim().length < 6) {
        newErrors.password = 'Minimum six caractères';
        isValid = false;
    } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(formData.password)) {
        newErrors.password = 'Le mot de passe doit contenir au moins un caractère spécial';
        isValid = false;
    } else if (!/[A-Z]/.test(formData.password)) {
        newErrors.password = 'Le mot de passe doit contenir au moins une lettre majuscule';
        isValid = false;
    } else if (!/\d/.test(formData.password)) {
        newErrors.password = 'Le mot de passe doit contenir au moins un chiffre';
        isValid = false;
    }

    if (formData.password.trim() !== formData.passwordConfirm) {
        newErrors.passwordConfirm = 'Les deux mots de passe ne correspondent pas';
        isValid = false;
    }

    setErrors(newErrors); // Assuming setErrors is a function to update state with newErrors
    return isValid;
};


  const handleSubmit = async (e) => {
    e.preventDefault();
    if(validateForm()){
      dispatch(register(formData)).then(({payload}) =>{
        console.log("payload ", payload);
          if(payload?.email){
            navigate('/active-account', {state:{email:payload.email, from: location.pathname}});
            setFormData(initData);
          }else if(payload?.user){
            setErrors({user:  "Un compte existe déjà pour cette adresse e-mail."})
          }
      });
    }
  };
  
  return (
    <>
      <div className={styles.register_container}>
        <h1 className={styles.form_title}>Inscription</h1>
        <form className={styles.form_container} onSubmit={handleSubmit}>
          <div className={styles.form_group}>
            <label htmlFor="name">
              Nom<span className="text-danger">*</span>
            </label>
            <input
              className={styles.form_input}
              type="text"
              placeholder="Votre nom..."
              name="lastname"
              value={formData.lastname}
              onChange={handleChange}
            />
             {errors.lastname && <span className='text-danger mx-5 text-error'>{errors.lastname}</span>}
          </div>
          <div className={styles.form_group}>
            <label htmlFor="name">
              Prenom<span className="text-danger">*</span>
            </label>
            <input
              className={styles.form_input}
              type="text"
              placeholder="Votre prenom..."
              name="firstname"
              value={formData.firstname}
              onChange={handleChange}
            />
             {errors.firstname && <span className='text-danger mx-5 text-error'>{errors.firstname}</span>}
          </div>

          <div className={styles.form_group}>
            <label htmlFor="email">
              Email<span className="text-danger">*</span>
            </label>
            <input
              name="email"
              value={formData.email}
              className={styles.form_input}
              onChange={handleChange}
              type="email"
              placeholder="Votre email ..."
            />
             {errors.email && <span className='text-danger mx-5 text-error'>{errors.email}</span>}
          </div>
          <div className={styles.form_group}>
            <label htmlFor="password">
              Mot de passe<span className="text-danger">*</span>
            </label>
            <input
              className={styles.form_input}
              type="password"
              value={formData.password}
              placeholder="Votre mot de passe..."
              name="password"
               onChange={handleChange}
            />
             {errors.password && <span className='text-danger mx-5 text-error'>{errors.password}</span>}
          </div>
          <div className={styles.form_group}>
            <label htmlFor="passwordConfirm">
              Confirmer le mot de passe
              <span className="text-danger">
                <span className="text-danger">*</span>
              </span>
            </label>
            <input
              value={formData.passwordConfirm}
              name="passwordConfirm"
              className={styles.form_input}
              onChange={handleChange}
              type="password"
              placeholder="Confirmer le mot de passe..."
            />
             {errors.passwordConfirm && <span className='text-danger mx-5 text-error'>{errors.passwordConfirm}</span>}
          </div>
          <div className="d-flex my-10 px-10">
            <span className={`${styles.formSpan} flex-1`}>
              Déjà un compte ?{" "}
            </span>
            <span
              className={`${styles.formSpan} text-primary cursor-pointer`}
              onClick={() => navigate("/login")}
            >
              Se connecter
            </span>
          </div>
          {errors.user && <span className='text-danger mx-5 text-error d-flex justify-content-center'>{errors.user}</span>}
          <div className={styles.register_button}>
            <button
              type="submit"
              className={`${styles.button} cursor-pointer`}
            >
              S'inscrire
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
