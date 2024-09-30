import userModel from "../models/Auth.js";
import orderModal from "../models/RestaurentOrders.js";
import RestaurentCustNotification from "../models/RestaurentCust.js";

export const fetchCustomerDetails = async (req, res) => {
  const { customerId } = req.query;
  try {
    const customer = await userModel.findById(customerId);
    if (!customer) {
      return res.status(404).json({ message: "Customer not found!" });
    }
    return res.status(200).json(customer);
  } catch (error) {
    console.error("Failed to fetch customer details due to : ", error);
    return res
      .status(500)
      .json({ message: "Failed to fetch customer details!!" });
  }
};

export const updateCustomerDetails = async (req, res) => {
  const { customerId } = req.query;
  const { fullname, username, password } = req.body;
  try {
    if (!fullname || !username || !password) {
      return res.status(400).json({
        message: "Please enter all the fields to update your details.",
      });
    }

    const customer = await userModel.findById(customerId);
    if (!customer) {
      return res.status(404).json({ message: "Customer not found!" });
    }

    const existingCustomer = await userModel.findOne({
      username,
      _id: { $ne: customerId },
    });

    if (existingCustomer) {
      return res.status(400).json({
        message: "Username already exists, Please use a different one!",
      });
    }

    const isMatched = await customer.comparePassword(password);
    if (!isMatched) {
      return res.status(401).json({
        message:
          "Invalid password entered, please use a correct one to update your details!",
      });
    }

    customer.fullname = fullname;
    customer.username = username;
    const newCustomer = await customer.save();

    const newCustNotification = new RestaurentCustNotification({
      customerId: customerId,
      customerName: customer.fullname,
      restaurentId: customer.restaurentId,
      resturentName: customer.resturentName,
      type: "profile_updated",
      message: "Your profile details have been updated successfully!",
    });

    await newCustNotification.save();

    return res.status(200).json({
      message: "Your profile details have been updated successfully!",
      newCustomer,
    });
  } catch (error) {
    console.error("Failed to update customer details due to : ", error);
    return res
      .status(500)
      .json({ message: "Failed to update customer details!!" });
  }
};

export const deleteCustomer = async (req, res) => {
  const { customerId } = req.query;
  try {
    const customer = await userModel.findByIdAndDelete(customerId);
    if (!customer) {
      return res.status(404).json({ message: "Customer not found!" });
    }
    return res.status(200).json({
      message: "Your account has been deleted successfully!",
    });
  } catch (error) {
    console.error("Failed to delete customer account due to : ", error);
    return res
      .status(500)
      .json({ message: "Failed to delete customer account!!" });
  }
};

export const countCustomerTotalExpenses = async (req, res) => {
  const { customerId } = req.query;
  try {
    const orders = await orderModal.find({
      customerId: customerId,
      orderStatus: "accepted",
    });
    if (orders.length > 0) {
      const totalExpenses = orders.reduce(
        (total, order) => total + order.itemprice * order.itemquantity,
        0
      );
      return res.status(200).json({
        message: "The total expenses of customer is fetched successfully",
        totalExpenses: totalExpenses,
      });
    } else {
      return res.status(404).json({
        message: "No orders found for the customer with the given ID.",
      });
    }
  } catch (error) {
    console.error(
      "Failed to fetch total expenses of customer due to : ",
      error
    );
    return res.status(500).json({
      message: "Failed to fetch total expenses of customer, please try again!",
    });
  }
};

export const countCustomerTotalNoOfRestaurents = async (req, res) => {
  const { customerId } = req.query;
  try {
    const orders = await orderModal.find({
      customerId: customerId,
      orderStatus: "accepted",
    });
    if (orders.length > 0) {
      const uniqueRestaurents = new Set(
        orders.map((order) => order.restaurentId)
      );
      const totalNoOfRestaurents = uniqueRestaurents.size;
      return res.status(200).json({
        message:
          "The total number of restaurents visited by customer is fetched successfully",
        orderCount: totalNoOfRestaurents,
      });
    } else {
      return res.status(404).json({
        message: "No orders found for the customer with the given ID.",
      });
    }
  } catch (error) {
    console.error(
      "Failed to fetch total number of restaurents visited by customer due to : ",
      error
    );
    return res.status(500).json({
      message:
        "Failed to fetch total number of restaurents visited by customer, please try again!",
    });
  }
};

export const fetchDetailsOfRestaurents = async (req, res) => {
  const { customerId } = req.query;
  try {
    const orders = await orderModal.find({
      customerId: customerId,
      orderStatus: "accepted",
    });
    if (orders.length > 0) {
      return res.status(200).json({
        message:
          "The details of restaurents visited by customer is fetched successfully",
        restaurentDetails: orders,
      });
    } else {
      return res.status(404).json({
        message: "No orders found for the customer with the given ID.",
      });
    }
  } catch (error) {
    console.error(
      "Failed to fetch details of restaurents visited by customer due to : ",
      error
    );
    return res.status(500).json({
      message:
        "Failed to fetch details of restaurents visited by customer, please try again!",
    });
  }
};

export const fetchCustomerNotifications = async (req, res) => {
  const { customerId } = req.query;
  try {
    const notifications = await RestaurentCustNotification.find({
      customerId: customerId,
    });
    if (notifications.length > 0) {
      return res.status(200).json({
        message: "The notifications of customer is fetched successfully",
        notifications: notifications,
      });
    } else {
      return res.status(404).json({
        message: "No notifications found for the customer with the given ID.",
      });
    }
  } catch (error) {
    console.error("Failed to fetch notifications of customer due to : ", error);
    return res.status(500).json({
      message: "Failed to fetch notifications of customer, please try again!",
    });
  }
};

export const markNotificationsAsRead = async (req, res) => {
  const { notificationId } = req.params;
  try {
    const notification = await RestaurentCustNotification.findById(
      notificationId,
      { read: true },
      { new: true }
    );
    if (!notification) {
      return res.status(404).json({
        message: "Notification does not found related to provided ID.",
      });
    }

    return res.status(200).json({
      message: "The notification has been marked as read!",
      notification,
    });
  } catch (error) {
    console.error("Failed to mark notification as read due to : ", error);
    return res
      .status(500)
      .json({ message: "Failed to mark notification as read!" });
  }
};

export const deleteCustomerNotification = async (req, res) => {
  const { notificationId } = req.query;
  try {
    const notification = await RestaurentCustNotification.findByIdAndDelete(
      notificationId
    );
    if (!notification) {
      return res.status(404).json({
        message: "Notification does not found related to provided ID.",
      });
    }
    return res.status(200).json({
      message: "The notification has been deleted successfully!",
      notification,
    });
  } catch (error) {
    console.error("Failed to delete notification due to : ", error);
    return res.status(500).json({ message: "Failed to delete notification!" });
  }
};
