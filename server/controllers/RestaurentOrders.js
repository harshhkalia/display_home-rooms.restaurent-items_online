import RestaurentCustNotification from "../models/RestaurentCust.js";
import resItemModel from "../models/RestaurentItems.js";
import orderModal from "../models/RestaurentOrders.js";
import restaurentModel from "../models/Restaurents.js";
import RestaurentOwnerNotification from "../models/RestaurentOwner.js";
import mongoose from "mongoose";

export const placeNewOrder = async (req, res) => {
  const {
    customerName,
    customerId,
    customerNumber,
    deliveryAddress,
    restaurentId,
    itemId,
    itemQuantity,
  } = req.body;

  try {
    if ((!customerName, !customerNumber, !deliveryAddress)) {
      return res.status(400).json({
        message: "Please fill all the information required to place the order.",
      });
    }

    const restaurent = await restaurentModel
      .findById(restaurentId)
      .select("restaurentname");
    const restaurentName = restaurent ? restaurent.restaurentname : null;

    const item = await resItemModel.findOne(
      {
        "items.subItems._id": itemId,
        restaurentId: restaurentId,
      },
      {
        "items.$": 1,
      }
    );

    if (!item) {
      return res.status(404).json({
        message: "Item with the given restaurent ID does not founded.",
      });
    }

    const subItem = item.items[0].subItems.find(
      (subItem) => subItem._id.toString() === itemId
    );
    if (!subItem) {
      return res
        .status(404)
        .json({ message: "The item for this restaurent does not found." });
    }

    if (subItem.quantity < itemQuantity) {
      return res.status(404).json({
        message: `Only ${subItem.quantity} pieces available, try entering lesser amount!`,
      });
    }

    await resItemModel.updateOne(
      {
        "items.subItems._id": itemId,
        restaurentId: restaurentId,
      },
      {
        $inc: { "items.$[outer].subItems.$[inner].quantity": -itemQuantity },
      },
      {
        arrayFilters: [
          { "outer._id": item.items[0]._id },
          { "inner._id": itemId },
        ],
      }
    );

    const itemName = subItem.name;
    const itemPrice = subItem.price;
    const itemDescription = subItem.description;
    const itemImages = subItem.subitemImages;

    const newOrder = new orderModal({
      customername: customerName,
      customerId: customerId,
      customernumber: customerNumber,
      deliveryaddress: deliveryAddress,
      restaurentId: restaurentId,
      restaurentname: restaurentName,
      itemId: itemId,
      itemname: itemName,
      itemprice: itemPrice,
      itemdescription: itemDescription,
      itemquantity: itemQuantity,
      itemimages: itemImages,
    });

    const saveOrder = await newOrder.save();
    if (saveOrder) {
      const newNotification = new RestaurentCustNotification({
        customerId: customerId,
        customerName: customerName,
        restaurentId: restaurentId,
        resturentName: restaurentName,
        type: "placed_order",
        message: `Your order for ${itemName} has been placed successfully!`,
      });

      await newNotification.save();

      return res.status(201).json({
        message: "The order has been placed successfully!",
        order: saveOrder,
      });
    } else {
      return res
        .status(400)
        .json({ message: "Something went wrong while saving the order." });
    }
  } catch (error) {
    console.error("Failed to save the order due to : ", error);
    return res
      .status(500)
      .json({ message: "Failed to save the order, please try again." });
  }
};

export const fetchAllResOrders = async (req, res) => {
  const { restaurentId } = req.query;

  if (!restaurentId || !mongoose.Types.ObjectId.isValid(restaurentId)) {
    return res.status(400).json({
      message: "Invalid restaurentId provided.",
    });
  }

  try {
    const foundAll = await orderModal.find({
      restaurentId: restaurentId,
      orderStatus: "pending",
    });
    if (foundAll.length > 0) {
      return res.status(200).json({
        message:
          "Fetching of all pending restaurent orders is successfull, here you go",
        orders: foundAll,
      });
    } else {
      return res
        .status(404)
        .json({ message: "No remaining orders found for your restaurent." });
    }
  } catch (error) {
    console.error(
      "Failed to fetch all remaining orders for restaurent due to: ",
      error
    );
    return res.status(500).json({
      message:
        "Failed to fetch all remaining orders for restaurent, please try again.",
    });
  }
};

export const acceptAnOrder = async (req, res) => {
  const { orderId } = req.params;

  try {
    const order = await orderModal
      .findByIdAndUpdate(
        orderId,
        {
          orderStatus: "accepted",
          delieverydate: Date.now(),
        },
        { new: true }
      )
      .populate({
        path: "restaurentId",
        model: "restaurents",
        populate: {
          path: "restaurentowner",
          model: "user_data",
        },
      });

    if (order) {
      const newCustNotification = new RestaurentCustNotification({
        customerId: order.customerId,
        customerName: order.customername,
        restaurentId: order.restaurentId,
        resturentName: order.restaurentname,
        type: "completed_order",
        message: `Your order for ${order.itemname} has been accepted by the restaurent. It will be delivered to you soon.`,
      });

      await newCustNotification.save();

      const restaurentOwnerId = order.restaurentId.restaurentowner;
      const itemName = order.itemname;
      const itemPrice = order.itemprice;
      const itemQuantity = order.itemquantity;
      const customerName = order.customername;

      const restOwnerNotification = new RestaurentOwnerNotification({
        restOwnerId: restaurentOwnerId,
        restaurentName: order.restaurentname,
        type: "accepted_order",
        message: `You accepted an order for ${itemName} and you earned ${
          itemPrice * itemQuantity
        } rupees from ${customerName}.`,
      });

      await restOwnerNotification.save();

      return res.status(200).json({
        message: "The order has been confirmed successfully!",
        confirmedOrder: order,
      });
    } else {
      return res
        .status(404)
        .json({ message: "The order does not found for confirm." });
    }
  } catch (error) {
    console.error("Failed to accept the order due to : ", error);
    return res
      .status(500)
      .json({ message: "Failed to accept the order, please try again!" });
  }
};

export const fetchAllConfirmedOrders = async (req, res) => {
  const { restaurentId } = req.query;

  if (!restaurentId || !mongoose.Types.ObjectId.isValid(restaurentId)) {
    return res.status(400).json({
      message: "Invalid restaurentId provided.",
    });
  }

  try {
    const foundAll = await orderModal.find({
      restaurentId: restaurentId,
      orderStatus: "accepted",
    });
    if (foundAll.length > 0) {
      return res.status(200).json({
        message:
          "Fetching of all confirmed orders for your restaurent, here you go",
        orders: foundAll,
      });
    } else {
      return res
        .status(404)
        .json({ message: "No confirmed orders found for your restaurent." });
    }
  } catch (error) {
    console.error(
      "Failed to fetch all confirmed orders for restaurent due to: ",
      error
    );
    return res.status(500).json({
      message:
        "Failed to fetch all confirmed orders for your restaurent, please try again.",
    });
  }
};

export const fetchAllCusOrders = async (req, res) => {
  const { userId } = req.query;

  if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({
      message: "Invalid customer provided.",
    });
  }

  try {
    const foundAll = await orderModal.find({
      customerId: userId,
      orderStatus: "pending",
    });
    if (foundAll.length > 0) {
      return res.status(200).json({
        message: "Fetching of all pending orders for your account, here you go",
        orders: foundAll,
      });
    } else {
      return res
        .status(404)
        .json({ message: "No remaining orders found for your account." });
    }
  } catch (error) {
    console.error(
      "Failed to fetch all remaining orders for your account due to: ",
      error
    );
    return res.status(500).json({
      message:
        "Failed to fetch all remaining orders for your account, please try again.",
    });
  }
};

export const changeCustomerAddress = async (req, res) => {
  const { orderId } = req.params;
  const { newAddress } = req.body;

  try {
    const orderFound = await orderModal.findByIdAndUpdate(
      orderId,
      { deliveryaddress: newAddress },
      { new: true }
    );

    if (!orderFound) {
      return res.status(404).json({
        message: "Failed to find order to update address of user",
      });
    }

    const newCustNotification = new RestaurentCustNotification({
      customerId: orderFound.customerId,
      customerName: orderFound.customername,
      restaurentId: orderFound.restaurentId,
      resturentName: orderFound.restaurentname,
      type: "updated_order_address",
      message: `Your delivery address for an order has been updated successfully!`,
    });

    await newCustNotification.save();

    return res.status(200).json({
      message: "Your address has been updated successfully",
      updatedOrder: orderFound,
    });
  } catch (error) {
    console.error("Failed to change your address due to : ", error);
    return res.status(500).json({
      message: "Failed to change your address, please try again!",
    });
  }
};

export const cancelCusOrder = async (req, res) => {
  const { orderId } = req.params;
  try {
    const order = await orderModal.findByIdAndUpdate(
      orderId,
      { orderStatus: "cancelled" },
      { new: true }
    );
    if (!order) {
      return res.status(404).json({
        message: "Failed to cancel the order because it's not founded.",
      });
    }

    const newCustNotification = new RestaurentCustNotification({
      customerId: order.customerId,
      customerName: order.customername,
      restaurentId: order.restaurentId,
      resturentName: order.restaurentname,
      type: "cancelled_order",
      message: `You cancelled order for an item recently.`,
    });

    await newCustNotification.save();

    return res
      .status(200)
      .json({ message: "The order has been successfully cancelled." });
  } catch (error) {
    console.error("Failed to cancel the order due to : ", error);
    return res
      .status(500)
      .json({ message: "Failed to cancel the order, please try again" });
  }
};

export const fetchAllComOrdersCus = async (req, res) => {
  const { cusId } = req.query;

  if (!cusId || !mongoose.Types.ObjectId.isValid(cusId)) {
    return res.status(400).json({
      message: "Invalid customer provided.",
    });
  }

  try {
    const foundAll = await orderModal.find({
      customerId: cusId,
      orderStatus: "accepted",
    });
    if (foundAll.length > 0) {
      return res.status(200).json({
        message: "The orders that are delievered to you are",
        completedOrders: foundAll,
      });
    } else {
      return res
        .status(404)
        .json({ message: "No order found that is delivered to you." });
    }
  } catch (error) {
    console.error(
      "Failed to find the order that are delivered completely to you due to : ",
      error
    );
    return res.status(500).json({
      message: "Failed to find the orders that are delivered completely.",
    });
  }
};

export const fetchTotalItemSale = async (req, res) => {
  const { itemId } = req.query;
  try {
    const count = await orderModal.countDocuments({
      itemId: itemId,
      orderStatus: "accepted",
    });
    return res.status(200).json({
      message: "The total sale of item is fetched successfully",
      totalSale: count,
    });
  } catch (error) {
    console.error("Failed to fetch total sale of item due to : ", error);
    return res.status(500).json({
      message: "Failed to fetch total sale of item, please try again!",
    });
  }
};

export const fetchRemainingItemOrders = async (req, res) => {
  const { itemId } = req.query;
  try {
    const remainingOrders = await orderModal.find({
      itemId: itemId,
      orderStatus: "pending",
    });
    if (remainingOrders.length > 0) {
      return res.status(200).json({
        message: "The remaining orders of item is fetched successfully",
        remainingOrders: remainingOrders,
      });
    } else {
      return res.status(404).json({
        message: "No remaining orders found for this item.",
      });
    }
  } catch (error) {
    console.error("Failed to fetch remaining orders of item due to : ", error);
    return res.status(500).json({
      message: "Failed to fetch remaining orders of item, please try again!",
    });
  }
};

export const fetchSpecificOrder = async (req, res) => {
  const { orderId } = req.query;
  try {
    const order = await orderModal.findById(orderId);
    if (order) {
      return res.status(200).json({
        message: "The specific order is fetched successfully",
        order: order,
      });
    } else {
      return res.status(404).json({
        message: "No order found for this order id.",
      });
    }
  } catch (error) {
    console.error("Failed to fetch specific order due to : ", error);
    return res.status(500).json({
      message: "Failed to fetch specific order, please try again!",
    });
  }
};
