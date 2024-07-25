const router = require("express").Router();
const materialControllers = require("@controllers/material.controllers");
const { verifyToken, verifyRoles } = require("@middlewares");

router.get("/get-materials", materialControllers.getMaterials);
router.get("/get-material/:materialId", materialControllers.getMaterial);
router.post("/create-material",             verifyToken, verifyRoles(['admin', 'superAdmin']),materialControllers.createMaterial);
router.put("/update-material/:materialId",  verifyToken, verifyRoles(['admin', 'superAdmin']), materialControllers.updateMaterial);
router.delete(
  "/delete-material/:materialId",           verifyToken, verifyRoles(['admin', 'superAdmin']),
  materialControllers.deleteMaterial
);
router.post("/delete-many-materials/",      verifyToken, verifyRoles(['admin', 'superAdmin']), materialControllers.deleteManyMaterials);


module.exports = router;
