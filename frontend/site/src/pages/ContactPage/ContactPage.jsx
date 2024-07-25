import { useState } from "react";
import styles from "./ContactPage.module.css";
import { useDispatch, useSelector } from "react-redux";
import { sendContact } from "@/redux/slices/contact";

const ContactPage = () => {
  const [email, setEmail] = useState("");
  const [objet, setObjet] = useState("");
  const [message, setMessage] = useState("");
  const dispatch = useDispatch();
  const { isLoading, success, error } = useSelector((state) => state.contact);

  const handleSubmit = () => {
    dispatch(sendContact({ email, objet, message }));
  };

  return (
    <div className={styles.contact_container}>
      <h3>Entrez votre mail</h3>
      <input
        type="email"
        placeholder="Entrer votre mail"
        className={styles.email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <h3>Entrez l objet de votre message</h3>
      <input
        type="text"
        placeholder="Objet"
        className={styles.objet}
        onChange={(e) => setObjet(e.target.value)}
      />

      <h3>Entrez votre message</h3>
      <textarea
        placeholder="Entrer votre message ici"
        className={styles.message}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <div>
        <button
          onClick={handleSubmit}
          className={styles.contact_btn}
          disabled={isLoading}
        >
          {isLoading ? "Envoi..." : "Envoyer"}
        </button>
      </div>

      {success && (
        <div className={styles.popup}>
          <p>Votre message a été envoyé avec succès !</p>
        </div>
      )}

      {error && (
        <div className={styles.error}>
          <p>Erreur lors de l envoi du message: {error}</p>
        </div>
      )}
    </div>
  );
};

export default ContactPage;
