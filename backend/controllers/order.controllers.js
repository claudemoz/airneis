const { Order } = require("@models");

exports.createOrder = async (req, res) => {
  try {
    const order = await Order.create(req.body);
    return res.status(200).send(order);
  } catch (error) {
    console.error(error);
    return res.status(500).send();
  }
};

exports.getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId);
    if (!order) return res.status(404).send();
    return res.status(200).send(order);
  } catch (error) {
    console.error(error);
    return res.status(500).send();
  }
};
exports.getOrdersByUser = async (req, res) => {
  try {
    const orders = await Order.aggregate([
      {
        $match: { customerId: req.user._id}
      },
      {
        $sort: { "date": -1 }
      },
      {
        $addFields: {
          totalItems: { $sum: "$order_items.quantity" }
        }
      },
      {
        $group: {
          _id: { $year: "$date" },
          orders: { $push: "$$ROOT" },
          totalOrders: { $sum: 1 }
        }
      },
      {
        $sort: { "_id": -1 }
      }
    ]);

    if (!orders || orders.length === 0) return res.status(404).send();
    return res.status(200).send(orders);
  } catch (error) {
    console.error(error);
    return res.status(500).send();
  }
};


exports.updateOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.orderId, req.body, {
      new: true,
    });
    if (!order) return res.status(404).send();
    return res.status(200).send(order);
  } catch (error) {
    console.error(error);
    return res.status(500).send();
  }
};

exports.getOrders = async (req, res) => {
  try {
    const result = await Order.find().populate('customerId', 'firstname lastname').exec();
    return res.status(200).send(result);
  } catch (e) {
    return res.status(500).send();
  }
};

exports.deleteManyOrders = async (req, res) => {
  const { orderListDeleted } = req.body;
  console.log("orderListDeleted ", orderListDeleted);
  try {
    let idsList;
    if (Array.isArray(orderListDeleted) && orderListDeleted.length) {
      idsList = orderListDeleted.map((p) => p.id);
      console.log("idsList ", idsList);
      await Order.deleteMany({ _id: { $in: idsList } }).exec();
    }
    return res.status(200).send(idsList);
  } catch (error) {
    console.log(error);
    return res.status(500).send();
  }
};

exports.deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.orderId);
    if (!order) return res.status(404).send();
    return res.status(200).send(order);
  } catch (error) {
    console.error(error);
    return res.status(500).send();
  }
};