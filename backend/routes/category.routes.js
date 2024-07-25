const router = require("express").Router();
const path = require("path");
const formData = require("express-form-data");
// const options  =  { uploadDir : path.join(__dirname, '../public/images/categories') , autoClean : true } ;
const categoryControllers = require("@controllers/category.controllers");
const { verifyToken, verifyRoles } = require("@middlewares");

router.post("/add-category",verifyToken,      verifyRoles(['admin', 'superAdmin']), formData.parse(), categoryControllers.addCategory);
router.put(
  "/update-category/:categoryId",verifyToken, verifyRoles(['admin', 'superAdmin']),
  formData.parse(),
  categoryControllers.updateCategory
);
router.delete(
  "/delete-category/:categoryId", verifyToken, verifyRoles(['admin', 'superAdmin']),
  categoryControllers.deleteCategory
);
router.post(
  "/delete-many-categories/", verifyToken,     verifyRoles(['admin', 'superAdmin']),
  categoryControllers.deleteManyCategories
);
router.get("/get-category/:categoryId", categoryControllers.getCategory);
router.get("/get-categories", categoryControllers.getCategories);

module.exports = router;
