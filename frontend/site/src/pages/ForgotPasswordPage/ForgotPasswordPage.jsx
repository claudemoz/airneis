import styles from "./ForgotPasswordPage.module.css";
// import { useNavigate } from "react-router-dom";
import { generateForgetPasswordlink } from "@/redux/slices/auth";
import { useDispatch } from "react-redux";
import { useState } from "react";
import { toast } from "sonner";

export default function ForgotPasswordPage() {
  // const navigate = useNavigate();
  const [email, setEmail] = useState("");

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const dispatch = useDispatch();

  const handleResetPassword = async (e) => {
    e.preventDefault();
    dispatch(generateForgetPasswordlink({ email }));
    setEmail("");
    toast.success("Un email vous a été envoyé");
  };

  return (
    <>
      <div className={styles.login_container}>
        <h3 className={styles.form_title}>Réinitialiser le mot de passe</h3>
        <div className={styles.main_form}>
          <span
            style={{ fontSize: "10px" }}
            className="d-flex justify-content-center"
          >
            Saisissez votre adresse électronique.
          </span>
          <form
            className={`${styles.form_container} mt-20`}
            onSubmit={handleResetPassword}
          >
            <div className={styles.form_group}>
              <input
                className={styles.form_input}
                type="email"
                placeholder="Votre email..."
                value={email}
                onChange={handleEmailChange}
              />
            </div>
            <div className={styles.login_button}>
              <button className="cursor-pointer">Confirmer</button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
