const router = require("express").Router();
const path = require("path");
const formData = require("express-form-data");
// const options = { uploadDir: path.join(__dirname, "../public/images/products"), autoClean: true};
const productControllers = require("@controllers/product.controllers");
const { verifyToken, verifyRoles } = require("@middlewares");

router.post("/add-product",                 verifyToken, verifyRoles(['admin', 'superAdmin']),formData.parse(),productControllers.addProduct);
router.put("/update-product/:productId",    verifyToken, verifyRoles(['admin', 'superAdmin']),formData.parse(),productControllers.updateProduct);
router.delete("/delete-product/:productId", verifyToken, verifyRoles(['admin', 'superAdmin']), productControllers.deleteProduct);
router.post("/delete-many-products/",       verifyToken, verifyRoles(['admin', 'superAdmin']), productControllers.deleteManyProducts);
router.get("/get-product/:productId", productControllers.getProduct);
router.get("/get-products", productControllers.getProducts);
router.get("/get-product-by-category/:categoryId",productControllers.getProductsByCategory);
module.exports = router;
