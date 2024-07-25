const { User, EmailToken, PasswordResetToken } = require("@models");
var jwt = require("jsonwebtoken");
const { generateToken } = require("@utils/helpers");
const emailService = require("@services/emails");
const EXPIRATION_TOKEN = 259200000;
const crypto = require("crypto");

exports.register = async (req, res) => {
  const { firstname, lastname, email, password, passwordConfirm } = req.body;
  try {
    if (!firstname || !lastname || !email || !password || !passwordConfirm) {
      res.status(400).json({ msg: "missing data" });
      return;
    }
    if (password !== passwordConfirm) {
      res.status(400).json({ msg: "passwords do not match" });
      return;
    }

    const user = await User.findOne({ email }).exec();
    if (user) {
      res.status(400).json({ user: true, msg: "user already exist " });
    } else {
      const _user = await User.create(req.body);
      if (_user) {
        const token = generateToken(6);
        await EmailToken.create({ userId: _user._id, token });
        await emailService.sendVerificationEmail({
          name: `${_user.firstname} ${_user.lastname}`,
          to: _user.email,
          access_code: token,
        });
      }

      return res.status(201).send(_user);
    }
  } catch (e) {
    console.log(e);
    return res.status(500).send();
  }
};
exports.login = async (req, res) => {
  const { password, email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user)
      return res.status(403).send({ error: "Email/Password mismatch" });
    if (user?.Verified) {
      const matched = await user.comparePassword(password);
      if (!matched)
        return res.status(422).send({ error: "Email/Password mismatch" });
      const { password: pwd, __v, ...profile } = user.toObject();
      const token = createToken(user._id);
      res.cookie("accessToken", token, {
        httpOnly: true,
        maxAge: process.env.EXPIRATION_TOKEN || EXPIRATION_TOKEN,
      });
      return res.status(200).send({ profile, token });
    } else {
      return res
        .status(403)
        .send({
          error: {
            message: "User not verified",
            isVerified: false,
            data: user.email,
          },
        });
    }
  } catch (e) {
    console.log(e);
    return res.status(500).send();
  }
};
exports.loginAdmin = async (req, res) => {
  const { password, email } = req.body;
  try {
    const user = await User.findOne({ email });
    console.log("user ", user);
    if (!user)
      return res.status(403).send({ error: "Email/Password mismatch" });
      const matched = await user.comparePassword(password);
      if (!matched){
        return res.status(422).send({ error: "Email/Password mismatch" });
      }else{
        const hasRole = ['admin', 'superAdmin'].some(role => user.roles?.includes(role));
        if(hasRole){
          const { password: pwd, __v, ...profile } = user.toObject();
          const token = createToken(user._id);
          res.cookie("accessToken", token, {
            httpOnly: true,
            maxAge: process.env.EXPIRATION_TOKEN || EXPIRATION_TOKEN,
          });
          return res.status(200).send({ profile, token });
        }else{
          return res.status(403).json({ error: 'Access denied' });
        }
      }
  } catch (e) {
    console.log(e);
    return res.status(500).send();
  }
};
exports.logout = async (req, res) => {
  const { accessToken } = req.cookies;
  console.log("req.cookies ", accessToken);
  try {
    if (!accessToken && accessToken === undefined)
      return res.status(204).send();
    res.clearCookie("accessToken", {
      httpOnly: true,
      maxAge: process.env.EXPIRATION_TOKEN || EXPIRATION_TOKEN,
    });
    return res.status(200).send({ isLogout: true });
  } catch (e) {
    return res.status(500).send();
  }
};

exports.getCurrentUser = async (req, res) => {
  const currentUser = req.user;
  // console.log("currentUser ", currentUser);
  try {
    if (currentUser) {
      const user = await User.findOne({ _id: currentUser._id })
        .select("-password -__v")
        .exec();
      if (!user) {
        return res.status(404).send("user not found");
      }
      return res.status(200).send({ profile: user });
    }
    // if(token){
    //   let _newToken ;
    //   let _decodedToken;
    //   try {
    //     const {newToken, decodedToken} = checkExpirationTokenAndRefresh(token, res);
    //     _newToken = newToken;
    //     _decodedToken = decodedToken;
    //   } catch (error) {
    //     return res.status(401).send({ message: error.message });
    //   }

    //   if(_decodedToken){
    //     const user = await User.findOne({ _id: _decodedToken.userId })
    //       .select("-password -__v")
    //       .exec();
    //     if (!user) {
    //       return res.status(404).send("user not found");
    //     }
    //     console.log("user ", user);
    //     return res.status(200).send({ profile:user, token:_newToken });
    //   }

    // }else{
    //   return res.status(404).send();
    // }
  } catch (error) {
    console.log(error);
    return res.status(500).send(null);
  }
};


//cette fonction integrire la dans le front et voire si il y a des probleme.
//ou : tu peux regarder comment tester cette fonction sur le net (contient le token..Ex)
//les truc que tu as modifier : auth controler, router, model

//je pense que getCurrentUser recuper le personne: donc jitulise son id pour le mettre a jour et cest tout
exports.updateUser = async (req, res) => {
  console.log("Données reçues:", req.body);  
  try {
    const user = await User.findByIdAndUpdate(
      req.params.userId,
      {
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
      },
      { new: true }
    );

    if (user) {
      await emailService.sendProfileUpdateEmail({
        name: `${user.firstname} ${user.lastname}`,
        to: user.email,
      });
    }

    res.status(200).send({ profile: user });
  } catch (error) {
    console.log(error);
    res.status(500).send(null);
  }
};


  


const createToken = (userId) =>{
  const token = jwt.sign({ userId: userId}, process.env.JWT_SECRET_KEY, {expiresIn: process.env.EXPIRATION_TOKEN/1000});
  return token;
};

// const checkExpirationTokenAndRefresh = (userToken) => {
//   const  decodedToken = jwt.verify(userToken, process.env.JWT_SECRET_KEY, { ignoreExpiration: true });
//   const tokenExp = decodedToken.exp;
//   const nowInSec = Math.floor(Date.now() / 1000);
//   if (nowInSec <= tokenExp) {
//     return {newToken:userToken, decodedToken};;
//   } else if (nowInSec > tokenExp && ((nowInSec - tokenExp) < 60 * 60 * 24) ) {
//     const refreshToken = createToken(decodedToken.userId);
//     return {newToken:refreshToken, decodedToken};
//   } else {
//     throw new Error("sessionExpired");
//   }
// }

exports.verifyEmail = async (req, res) => {
  const { email, token } = req.body;
  console.log(email, token);
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(403).send({ error: "Invalid request" });

    const verificationTokenResult = await EmailToken.findOne({
      userId: user._id,
    });
    console.log(verificationTokenResult);

    if (!verificationTokenResult) {
      return res.status(404).send({ success: false, error: "Invalid token" });
    }

    const matched = await verificationTokenResult?.compareToken(token);

    if (!matched) {
      return res.status(403).send({ success: false, error: "Invalid token _" });
    }

    await User.findOneAndUpdate({ email }, { Verified: true });

    await EmailToken.findByIdAndDelete(verificationTokenResult._id);
    return res
      .status(200)
      .send({ success: true, message: "Your email is verified. " });
  } catch (error) {
    console.log(error);
    return res.status(500).send();
  }
};

exports.sendReverifyEmail = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(403).send({ error: "Invalid request" });

    await EmailToken.findOneAndDelete({ userId: user._id });

    const token = generateToken(6);
    await EmailToken.create({ userId: user._id, token });
    if (token) {
      await emailService.sendVerificationEmail({
        name: user.name,
        to: user.email,
        access_code: token,
      });
    }
    return res.status(200).send({ message: "Please check your  email. " });
  } catch (e) {
    console.log(e);
    return res.status(500).send();
  }
};

exports.generateForgetPasswordlink = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(403).send({ error: "Account not found" });

    await PasswordResetToken.findOneAndDelete({ userId: user._id });
    const token = crypto.randomBytes(36).toString("hex");
    let resetLink;
    if (token) {
      resetLink = `${
        process.env.NODE_ENV === "development"
          ? "http://localhost:3000"
          : "https://airneis.tsiang.fr"
      }/reset-password?token=${token}&id_user=${user._id}`;
      await PasswordResetToken.create({ userId: user._id, token });
      await emailService.sendEmailResetPassword({
        to: user.email,
        link: resetLink,
        name: user.name,
      });
    }
    return res
      .status(200)
      .send({ message: "Check your reset-password  email. " });
  } catch (e) {
    console.log(e);
    return res.status(500).send();
  }
};

exports.checkToken = async (req, res, next) => {
  const { token, id_user } = req.body;
  try {
    const resetToken = await PasswordResetToken.findOne({ userId: id_user });
    if (!resetToken)
      return res
        .status(403)
        .send({ error: "Unauthorized access, invalid token" });
    const matched = await resetToken.compareToken(token);

    if (!matched) return res.status(403).send({ error: "Invalid token" });
    next();
  } catch (e) {
    console.log(e);
    return res.status(500).send();
  }
};

exports.resetpassword = async (req, res) => {
  const { password, passwordConfirm, id_user } = req.body;
  try {
    if (!password || !passwordConfirm) {
      res.status(400).json({ msg: "missing data" });
      return;
    }
    if (password !== passwordConfirm) {
      res.status(400).json({ msg: "passwords do not match" });
      return;
    }
    const user = await User.findById(id_user);
    if (!user) return res.status(403).send({ error: "Unauthorized access" });
    const matched = await user.comparePassword(password);
    if (matched)
      return res
        .status(422)
        .send({ error: "The new password must be different" });
    user.password = password;
    await user.save();

    await PasswordResetToken.findOneAndDelete({ userId: id_user });
    const signUpLink = "";
    await emailService.sendPasswordResetSuccessEmail({
      to: user.email,
      link: signUpLink,
      name: user.name,
    });
    return res
      .status(200)
      .send({ success: true, message: "password reset successfully." });
  } catch (e) {
    console.log(e);
    return res.status(500).send();
  }
}


//mettre un autre fonction pour resetpassord (updater) sur le profile: à verifier cette tru
// Fonction pour mettre à jour le mot de passe
exports.updatePassword = async (req, res) => {
  const { currentPassword, newPassword, newPasswordConfirm} = req.body;
  const id_user=req.user._id;
  try {
    // Vérifier si les données requises sont présentes
    if (!currentPassword || !newPassword || !newPasswordConfirm) {
      return res.status(400).json({ msg: 'Missing data' });
    }

     // Récupérer l'utilisateur depuis la base de données
     const user = await User.findById(id_user);
     if (!user) {
       return res.status(403).send({ error: 'Unauthorized access' });
     }

    // Vérifier si le mot de passe actuel correspond à celui enregistré
    const isMatched = await user.comparePassword(currentPassword);
    if (!isMatched) {
      return res.status(401).json({ msg: 'Current password is incorrect' });
    }

    // Vérifier si le nouveau mot de passe et sa confirmation correspondent
    if (newPassword !== newPasswordConfirm) {
      return res.status(400).json({ msg: 'New passwords do not match' });
    }

    // Vérifier si le nouveau mot de passe est différent du mot de passe actuel
    const isNewPasswordMatched = await user.comparePassword(newPassword);
    if (isNewPasswordMatched) {
      return res.status(422).json({ error: 'The new password must be different' });
    }

    // Mettre à jour le mot de passe de l'utilisateur
    user.password = newPassword;
    await user.save();

    // Envoi d'un email de confirmation (facultatif)
    await emailService.sendProfileUpdateEmail({
      name: `${user.firstname} ${user.lastname}`,
      to: user.email,
    });

    // Réponse à l'utilisateur
    return res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).send(); // Erreur interne du serveur
  }
};

