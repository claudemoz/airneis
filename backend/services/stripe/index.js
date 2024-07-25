const { Order } = require("@models");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const crypto = require("crypto");
const { generateInvoice } = require("@services/invoice/generateInvoice");
// const getRawBody = require("raw-body");

exports.createCustomerAndPaymentMethod = async (req, res) => {
  const { email, paymentData } = req.body;

  try {
    // Vérifier si le client existe déjà
    let customer = await stripe.customers.list({
      email: email,
      limit: 1,
    });

    if (customer.data.length > 0) {
      customer = customer.data[0];
    } else {
      // Créer un nouveau client
      customer = await stripe.customers.create({
        email: email,
      });
    }

    /*const paymentMethod = await stripe.paymentMethods.attach(paymentToken, {
      customer: customer.id,
    });*/

    // Créer le moyen de paiement
    /*const paymentMethod = await stripe.paymentMethods.create({
      type: 'card',
      card: {
        number: paymentData.card_number,
        exp_month: paymentData.expiration_date.split('/')[0],
        exp_year: paymentData.expiration_date.split('/')[1],
        cvc: paymentData.cvc,
      },
      billing_details: {
        name: paymentData.entire_name,
      },
    });*/

    // Attacher le moyen de paiement au client
    await stripe.paymentMethods.attach(paymentData.paymentMethodId, {
      customer: customer.id,
    });

    res.status(200).json({ customer });
  } catch (error) {
    console.error("Error creating customer and payment method:", error);
    res.status(500).json({
      error: "An error occurred while creating customer and payment method",
    });
  }
};

exports.createCheckoutSession = async (req, res) => {
  const { orderItems } = req.body;
  console.log("orderItems ", orderItems);
  try {
    const session = await stripe.checkout.sessions.create({
      line_items: orderItems,
      mode: "payment",
      success_url: "http://localhost:4242/success",
      cancel_url: "http://localhost:4242/cancel",
    });
    // return res.redirect(303, session.url);
    return res.status(200).send({ sessionId: session.id });
  } catch (error) {
    console.log("error ", error);
    return res.status(500).send();
  }
};

exports.createPaymentIntent = async (req, res) => {
  const { order } = req.body;
  try {
    const newOrder = await Order.create({
      order_items: order.products,
      delivery: order.delivery,
      price: order.totalPrice,
      reference: crypto.randomBytes(8).toString("hex").toUpperCase(),
      customerId: req.user?._id,
    });

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(order.totalPrice * 100),
      currency: "eur",
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: { orderId: newOrder._id.toString() },
    });
    if(paymentIntent?.client_secret && newOrder._id){
      generateInvoice(newOrder, req.user)
    }
    return res.status(200).send({ clientSecret: paymentIntent.client_secret, order:newOrder });
  } catch (error) {
    console.log("error ", error);
    return res.status(500).send();
  }
};

exports.initOrder = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  const EVENT_SECRET_KEY =
    process.env.NODE_ENV === "production"
      ? "whsec_LTrozWJCYQDwiZinCsPBokEjZmR90ULh"
      : "whsec_611328705565fc61a56811071fb708182552846a693362732b60738d551cd428";
  try {
    if (process.env.NODE_ENV === "production") {
      const event = stripe.webhooks.constructEvent(
        req.rawBody,
        sig,
        EVENT_SECRET_KEY
      );
      //######## pour le dev ########;
      // stripe listen --forward-to localhost:9000/api/v1/order/webhook
      // stripe trigger payment_intent.succeeded

      const paymentIntent = event.data.object;
      const orderId = paymentIntent.metadata.orderId;
      // const order = { orderId, paymentIntent: paymentIntent.id };
      switch (event.type) {
        case "payment_intent.created":
          console.log("PaymentIntent was created!");
          await handlePaymentIntentCreated(orderId);
          break;
        case "payment_intent.succeeded":
          console.log("PaymentIntent was succeeded!");
          await handlePaymentIntentSucceeded(orderId);
          break;
        case "payment_intent.payment_failed":
          console.log("PaymentIntent was payment_failed!");
          await handlePaymentIntentFailed(orderId);
        case "payment_intent.canceled":
          console.log("PaymentIntent was canceled!");
          await handlePaymentIntentCanceled(orderId);
          break;
        default:
          console.log(`Unhandled event type ${event.type}`);
      }
      return res.status(200).send();
    }
  } catch (err) {
    console.error(`Webhook signature verification failed: ${err.message}`);
    return res.status(500).send();
  }
};

const handlePaymentIntentCreated = async (orderId) => {
  await updateOrderStatus({
    orderId: orderId,
    status: "unpaid",
  });
};
const handlePaymentIntentSucceeded = async (orderId) => {
  await updateOrderStatus({
    orderId: orderId,
    status: "paid",
  });
};

const handlePaymentIntentFailed = async (orderId) => {
  await updateOrderStatus({
    orderId: orderId,
    status: "failed",
  });
};

const handlePaymentIntentCanceled = async (orderId) => {
  await updateOrderStatus({
    orderId: orderId,
    status: "canceled",
  });
};

const updateOrderStatus = async ({ orderId, status }) => {
  try {
    const order = await Order.findOne({ _id: orderId });
    if (order) {
      order.paymentStatus = status;
      await order.save();
    } else {
      console.error(`Ordernot found`);
    }
  } catch (error) {
    console.error(`Error updating order status: ${error.message}`);
  }
};



