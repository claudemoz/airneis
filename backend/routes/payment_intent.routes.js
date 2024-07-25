const router = require("express").Router();
const paymentIntentController = require("@controllers/payment_intent.controllers");
const { createCustomerAndPaymentMethod } = require("@services/stripe");

router.get("/get-payment-user/:userId", paymentIntentController.getPaymentByUser);
router.post("/create-payment", paymentIntentController.createPayment);
router.put("/update-payment/:paymentId",paymentIntentController.updatePayment);
router.delete("/delete-payment/:paymentId", paymentIntentController.deletePayment);
router.post("/add-method-payment-to-user", createCustomerAndPaymentMethod)

module.exports = router;
