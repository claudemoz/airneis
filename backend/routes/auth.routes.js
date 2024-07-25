const router = require("express").Router();
const authControllers = require("@controllers/auth.controllers");
const { verifyToken, verifyRoles } = require("@middlewares");

router.post("/register",          authControllers.register);
router.post("/verify-email",      authControllers.verifyEmail);
router.post("/re-verify-email",   authControllers.sendReverifyEmail);
// router.post("/generateForgetPasswordlink", authControllers.generateForgetPasswordlink);
router.post("/login",             authControllers.login);
router.post("/authenticate",      authControllers.loginAdmin);
router.post("/logout",            authControllers.logout);
router.get("/user",               verifyToken, authControllers.getCurrentUser);
router.post("/forgot-password",   authControllers.generateForgetPasswordlink);
router.post("/reset-password",    verifyToken, authControllers.checkToken, authControllers.resetpassword);
router.put("/update-user/:userId",verifyToken, authControllers.updateUser);
router.post("/update-password",   verifyToken, authControllers.updatePassword);




module.exports = router;
