const router = require("express").Router();
const userControllers = require("@controllers/user.controllers");
const formData = require("express-form-data");
const { verifyToken, verifyRoles } = require("@middlewares");

router.get("/get-customers",          verifyToken, verifyRoles(['admin', 'superAdmin']), userControllers.getCustomers);
router.get("/get-users-admin",        verifyToken, verifyRoles(['admin', 'superAdmin']), userControllers.getUsersAdmin);
router.get("/get-user/:userId",                                                          userControllers.getUser);
router.delete("/delete-user/:userId", verifyToken, verifyRoles(['admin', 'superAdmin']), userControllers.deleteUser);
router.post("/delete-many-users/",    verifyToken, verifyRoles(['admin', 'superAdmin']), userControllers.deleteManyUsers);
router.put("/update-user/:userId",    verifyToken, verifyRoles(['admin', 'superAdmin']),formData.parse(), userControllers.updateUser);
router.post("/add-user",              verifyToken, verifyRoles(['superAdmin']), formData.parse(), userControllers.createUser); 

module.exports = router;
