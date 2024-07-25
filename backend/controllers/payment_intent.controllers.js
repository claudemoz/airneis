const { Payment_intent } = require("@models");
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.getPaymentByUser = async (req, res) => {
  const userId = req.params.userId;
  try {
    const payments = await Payment_intent.find({ userId: userId }).populate("userId","_id ").exec();
    if (!payments) return res.status(404).send("payment not found");
    return res.status(200).send(payments);
  } catch (e) {
    console.error(e);
    return res.status(500).send();
  }
};

exports.createPayment = async (req, res) => {
  const { paymentMethodId, userId, entire_name  } = req.body;

  try {
    if (!paymentMethodId || !userId || !entire_name) {
      return res.status(400).json({ msg: "missing data" });
    }

    const paymentMethod = await stripe.paymentMethods.retrieve(paymentMethodId);

    if (!paymentMethod) {
      return res.status(400).json({ msg: "Invalid payment method" });
    }

    const { brand, last4, exp_month, exp_year } = paymentMethod.card;

    const expiration_date_formatted = new Date(exp_year, exp_month - 1);

    const payment = new Payment_intent({
      entire_name,
      last4,
      brand,
      expiration_date: expiration_date_formatted,
      userId,
    });

    await payment.save();

    return res.status(201).send(payment);
  } catch (error) {
    console.error("Error saving payment:", error);
    return res.status(500).send();
  }
};

exports.updatePayment = async (req, res) => {
  const { paymentId } = req.params;
  try {
    const payment = await Payment_intent.findOneAndUpdate(
      { _id: paymentId },
      req.body,
      { new: true }
    ).exec();
    return res.status(200).send(payment);
  } catch (error) {
    console.error(error);
    return res.status(500).send();
  }
};


exports.deletePayment = async (req, res) => {
  try {
    const { paymentId } = req.params;

    const deletedPayment = await Payment_intent.findOneAndDelete({
      _id: paymentId,
    }).exec();

    if (!deletedPayment) {
      return res.status(404).send("payment not found");
    }

    return res.status(200).send(deletedPayment);
  } catch (error) {
    console.error(error);
    return res.status(500).send("");
  }
};