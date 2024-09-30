import userModel from "../models/Auth.js";
import resItemModel from "../models/RestaurentItems.js";
import orderModal from "../models/RestaurentOrders.js";
import restaurentModel from "../models/Restaurents.js";
import RestaurentCustNotification from "../models/RestaurentCust.js";
import restItemATCModel from "../models/RestItemATC.js";

export const addToCart = async (req, res) => {
  const { itemId } = req.query;
  const { userId, restaurentId } = req.body;
  try {
    const item = await resItemModel.findOne(
      { "items.subItems._id": itemId },
      {
        "items.$": 1,
      }
    );
    if (!item) {
      return res.status(404).json({
        message: "Item not found",
      });
    }
    const subItem = item.items[0].subItems.find(
      (subItem) => subItem._id.toString() === itemId
    );
    if (!subItem) {
      return res.status(404).json({
        message: "Sub item not found",
      });
    }

    const itemname = subItem.name;
    const itemPrice = subItem.price;
    const itemQuantity = subItem.quantity;
    const itemImages = subItem.subitemImages;
    const itemDescription = subItem.description;

    const customer = await userModel.findById(userId);
    const customerName = customer.fullname;

    const restaurent = await restaurentModel.findById(restaurentId);
    const restaurentName = restaurent.restaurentname;

    const cartItem = new restItemATCModel({
      itemId: itemId,
      restaurentId: restaurentId,
      customerId: userId,
      customerName: customerName,
      restaurentName: restaurentName,
      itemName: itemname,
      itemPrice: itemPrice,
      itemQuantity: itemQuantity,
      itemImages: itemImages,
      itemDescription: itemDescription,
    });

    const savedItemToCart = await cartItem.save();

    const newCustNotification = new RestaurentCustNotification({
      customerId: userId,
      customerName: customerName,
      restaurentId: restaurentId,
      resturentName: restaurentName,
      type: "added_to_cart",
      message: `You added ${itemname} in your cart from ${restaurentName} restaurent.`,
    });

    await newCustNotification.save();

    return res.status(201).json({
      message: "Item added to cart successfully",
      cartItem: savedItemToCart,
    });
  } catch (error) {
    console.log("Error adding item to cart: ", error);
    return res.status(500).json({
      message: "Error adding item to cart",
    });
  }
};

export const getCartItems = async (req, res) => {
  const { userId } = req.query;
  try {
    const cartItems = await restItemATCModel.find({ customerId: userId });
    return res.status(200).json({
      message: "Cart items fetched successfully",
      cartItems: cartItems,
    });
  } catch (error) {
    console.log("Error getting cart items: ", error);
    return res.status(500).json({
      message: "Error getting cart items",
    });
  }
};

export const confirmCartOrder = async (req, res) => {
  const { cartId } = req.query;
  const {
    userId,
    restaurentId,
    itemQuantity,
    customerName,
    customerAddress,
    customerNumber,
  } = req.body;

  try {
    if ((!itemQuantity, !customerName, !customerAddress, !customerNumber)) {
      return res.status(400).json({
        message: "Fill all the required data to place the order",
      });
    }

    const cartItem = await restItemATCModel.findById(cartId);

    if (!cartItem) {
      return res.status(404).json({
        message: "Cart not found",
      });
    }

    const restaurentName = cartItem.restaurentName;
    const itemId = cartItem.itemId;
    const itemName = cartItem.itemName;
    const itemPrice = cartItem.itemPrice;
    const itemImages = cartItem.itemImages;
    const itemDescription = cartItem.itemDescription;

    const item = await resItemModel.findOne(
      { "items.subItems._id": itemId },
      {
        "items.$": 1,
      }
    );

    if (!item) {
      return res.status(404).json({
        message: "Item not found",
      });
    }

    const subItem = item.items[0].subItems.find(
      (subItem) => subItem._id.toString() === itemId.toString()
    );

    if (!subItem) {
      return res.status(404).json({ message: "SubItem not found!" });
    }

    if (subItem.quantity < itemQuantity) {
      return res.status(400).json({
        message: "Requested quantity is not available, please try again!",
      });
    }

    await resItemModel.updateOne(
      { "items.subItems._id": itemId },
      { $inc: { "items.$.subItems.$[elem].quantity": -itemQuantity } },
      { arrayFilters: [{ "elem._id": itemId }] }
    );

    const order = new orderModal({
      orderStatus: "pending",
      customername: customerName,
      customerId: userId,
      customernumber: customerNumber,
      deliveryaddress: customerAddress,
      restaurentId: restaurentId,
      restaurentname: restaurentName,
      itemId: itemId,
      itemname: itemName,
      itemprice: itemPrice,
      itemquantity: itemQuantity,
      itemdescription: itemDescription,
      itemimages: itemImages,
    });

    const savedOrder = await order.save();

    const newCustNotification = new RestaurentCustNotification({
      customerId: userId,
      customerName: customerName,
      restaurentId: restaurentId,
      resturentName: restaurentName,
      type: "cart_order_confirmed",
      message: `You placed an order for ${itemName} from your cart.`,
    });

    await newCustNotification.save();

    if (savedOrder) {
      await restItemATCModel.findByIdAndDelete(cartId);
      return res.status(200).json({
        message: "Order confirmed successfully, Opening Your Orders",
        order: savedOrder,
      });
    }
  } catch (error) {
    console.log("Error confirming order: ", error);
    return res.status(500).json({
      message: "Error confirming order",
    });
  }
};

export const removeItemFromCart = async (req, res) => {
  const { itemId } = req.query;
  try {
    const cartItem = await restItemATCModel.findOneAndDelete({
      itemId: itemId,
    });
    if (!cartItem) {
      return res.status(404).json({
        message: "Cart item not found",
      });
    }

    const newCustNotification = new RestaurentCustNotification({
      customerId: cartItem.customerId,
      customerName: cartItem.customerName,
      restaurentId: cartItem.restaurentId,
      resturentName: cartItem.restaurentName,
      type: "removed_from_cart",
      message: `You removed ${cartItem.itemName} from your cart.`,
    });

    await newCustNotification.save();

    return res.status(200).json({
      message: "Item removed from cart successfully",
    });
  } catch (error) {
    console.log("Error removing item from cart: ", error);
    return res.status(500).json({
      message: "Error removing item from cart",
    });
  }
};
