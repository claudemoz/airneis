const router = require("express").Router();

//============= Doc Api ==============
// const swaggerUi = require('swagger-ui-express');
// const swaggerDocument = require('@config/swagger.json');
// router.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

//============= Resources ==============
router.use("/auth", require("@routes/auth.routes"));
router.use("/user", require("@routes/user.routes"));
router.use("/category", require("@routes/category.routes"));
router.use("/product", require("@routes/product.routes"));
router.use("/material", require("@routes/material.routes"));
router.use("/order", require("@routes/order.routes"));
router.use("/contact", require("@routes/contact.routes"));
router.use("/payment_intent", require("@routes/payment_intent.routes"));

//============= Upload ==============
router.use("/upload", require("@routes/upload.routes"));
module.exports = router;
