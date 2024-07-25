const router = require("express").Router();
const orderControllers = require("@controllers/order.controllers");
const {
  createCheckoutSession,
  createPaymentIntent,
  initOrder,
} = require("@services/stripe");
const { verifyToken, verifyRoles } = require("@middlewares");

router.post("/create-order", orderControllers.createOrder);
router.post("/create-checkout-session", createCheckoutSession);
router.post("/create-payment-intent",                  verifyToken, createPaymentIntent);
router.post("/webhook", initOrder);
// router.get("/create-facture-base-64", orderControllers.generateInvoice)
router.get("/get-order/:orderId", orderControllers.getOrder);
router.get("/get-user-orders",                        verifyToken, orderControllers.getOrdersByUser);
// router.get("/get-user-orders", verifyToken);
router.get("/get-orders", orderControllers.getOrders);
router.put("/update-order/:orderId",                  verifyToken, verifyRoles(['admin', 'superAdmin']), orderControllers.updateOrder);
router.delete("/delete-order/:orderId",               verifyToken, verifyRoles(['admin', 'superAdmin']), orderControllers.deleteOrder);
router.post("/delete-many-orders/",                   verifyToken, verifyRoles(['admin', 'superAdmin']), orderControllers.deleteManyOrders);
// router.get("/get-invoice", orderControllers.getInvoice);
// router.get("/get-invoice", orderControllers.generateInvoice);

module.exports = router;
