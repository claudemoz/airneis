import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import styles from "./ResetPasswordPage.module.css";
import { resetPassword } from "@/redux/slices/auth";
import { useDispatch } from "react-redux";

export default function ResetPasswordPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const userId = searchParams.get("id_user");
  const token = searchParams.get("token");

  const initData = {
    id_user: userId,
    token: token,
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

    if (!formData.password.trim()) {
      newErrors.password = "Ce champ est obligatoire";
      isValid = false;
    } else if (formData.password.trim().length < 6) {
      newErrors.password = "Minimum six caractères";
      isValid = false;
    } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(formData.password)) {
      newErrors.password =
        "Le mot de passe doit contenir au moins un caractère spécial";
      isValid = false;
    } else if (!/[A-Z]/.test(formData.password)) {
      newErrors.password =
        "Le mot de passe doit contenir au moins une lettre majuscule";
      isValid = false;
    } else if (!/\d/.test(formData.password)) {
      newErrors.password = "Le mot de passe doit contenir au moins un chiffre";
      isValid = false;
    }

    if (formData.password.trim() !== formData.passwordConfirm) {
      newErrors.passwordConfirm = "Les deux mots de passe ne correspondent pas";
      isValid = false;
    }

    setErrors(newErrors); // Assuming setErrors is a function to update state with newErrors
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      dispatch(resetPassword(formData)).then(({ payload }) => {
        console.log("payload ", payload);
        if (payload?.success) {
          navigate("/login");
          setFormData(initData);
        }
      });
    }
  };

  return (
    <>
      <div className={styles.login_container}>
        <div className={styles.main_form}>
          <h3 className={styles.form_title}>Réinitialiser le mot de passe</h3>
          <form
            className={`${styles.form_container} mt-20`}
            onSubmit={handleSubmit}
          >
            <div className={styles.form_group}>
              <label className={styles.label_group}>Nouveau mot de passe</label>
              <input
                className={styles.form_input}
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Entrez votre nouveau mot de passe..."
              />
              {errors.password && (
                <span className="text-danger mx-5 text-error">
                  {errors.password}
                </span>
              )}
            </div>
            <div className={styles.form_group}>
              <label className={styles.label_group}>
                Confirmer le mot de passe
              </label>
              <input
                className={styles.form_input}
                type="password"
                name="passwordConfirm"
                value={formData.passwordConfirm}
                onChange={handleChange}
                placeholder="Confirmez votre nouveau mot de passe..."
              />
              {errors.passwordConfirm && (
                <span className="text-danger mx-5 text-error">
                  {errors.passwordConfirm}
                </span>
              )}
            </div>
            <div className={styles.login_button}>
              <button type="submit">Confirmer</button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
