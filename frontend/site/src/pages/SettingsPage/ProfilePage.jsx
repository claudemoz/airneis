import React, { useState, useEffect } from "react";
import { Toaster, toast } from "sonner";
import styles from "./ProfilePage.module.css";
import { FaUser, FaKey } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { fetchCurrentUser, updateUser, updatePassword } from "../../redux/slices/auth";

const ProfilePage = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const isLoading = useSelector((state) => state.auth.isLoading);
  const error = useSelector((state) => state.auth.error);
  const [userData, setUserData] = useState({
    firstname: user?.firstname || "",
    lastname: user?.lastname || "",
    email: user?.email || "",
  });

  const initData = {
    currentPassword: "",
    newPassword: "",
    newPasswordConfirm: "",
  }
  const [passwordData, setPasswordData] = useState(initData);

  useEffect(() => {
    dispatch(fetchCurrentUser());
  }, [dispatch]);

  const handleInputChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(updateUser(userData)).unwrap();
      toast.success("Votre information a été mise à jour avec succès.");
    } catch (error) {
      toast.error("Une erreur s'est produite lors de la mise à jour de votre information.");
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    // if (passwordData.newPassword !== passwordData.newPasswordConfirm) {
    //   toast.error(error ? error :"Les nouveaux mots de passe ne correspondent pas.");
      
    //   // dispatch(resetError())
    //   return;
    // }
    try {
      await dispatch(updatePassword(passwordData)).unwrap();
      setPasswordData(initData);
      toast.success("Votre mot de passe a été mis à jour avec succès.");
    } catch (error) {
      toast.error("Une erreur s'est produite lors de la mise à jour de votre mot de passe.");
    }
  };

  return (
    <div className={styles.cardContainer}>
      <Toaster />
      <div className={styles.card}>
        <div className={styles.cardTitle}>
          <FaUser />
          <h2>Données personnelles</h2>
        </div>
        <form onSubmit={handleFormSubmit}>
          <label htmlFor="firstname">Prénom</label>
          <input
            type="text"
            id="firstname"
            name="firstname"
            value={userData.firstname}
            onChange={handleInputChange}
          />

          <label htmlFor="lastname">Nom</label>
          <input
            type="text"
            id="lastname"
            name="lastname"
            value={userData.lastname}
            onChange={handleInputChange}
          />

          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={userData.email}
            onChange={handleInputChange}
          />

          <button type="submit" disabled={isLoading}>
            {isLoading ? "Mise à jour en cours..." : "Mettre à jour vos informations"}
          </button>
          {/* {error && <p style={{ color: "red" }}>{error}</p>} */}
        </form>
      </div>

      <div className={styles.card}>
        <div className={styles.cardTitle}>
          <FaKey />
          <h2>Mot de passe</h2>
        </div>
        <form onSubmit={handlePasswordSubmit}>
          <label htmlFor="currentPassword">Mot de passe actuel</label>
          <input
            type="password"
            id="currentPassword"
            name="currentPassword"
            value={passwordData.currentPassword}
            onChange={handlePasswordChange}
          />

          <label htmlFor="newPassword">Nouveau mot de passe</label>
          <input
            type="password"
            id="newPassword"
            name="newPassword"
            value={passwordData.newPassword}
            onChange={handlePasswordChange}
          />

          <label htmlFor="newPasswordConfirm">Confirmer le nouveau mot de passe</label>
          <input
            type="password"
            id="newPasswordConfirm"
            name="newPasswordConfirm"
            value={passwordData.newPasswordConfirm}
            onChange={handlePasswordChange}
          />

          <button type="submit" disabled={isLoading}>
            {isLoading ? "Mise à jour en cours..." : "Mettre à jour le mot de passe"}
          </button>
          {error && <p style={{ color: "red" }}>{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
