import CustomerNotificationModel from "../models/CustomerNotificationsForHome.js";
import OwnerNotificationModel from "../models/OwnerNotificationsForHome.js";

export const fetchHomeOwnerNotifications = async (req, res) => {
  const { userId } = req.query;
  try {
    const notifications = await OwnerNotificationModel.find({ userId: userId });
    if (notifications.length > 0) {
      return res.status(200).json({ notifications: notifications });
    } else {
      return res
        .status(400)
        .json({ message: "You don't have any notification for your account." });
    }
  } catch (error) {
    console.error(
      "Failed to fetch notifications for your account due to : ",
      error
    );
    return res
      .status(500)
      .json({ message: "Failed to fetch notifications for your account!!" });
  }
};

export const fetchCustomerHomeNotifications = async (req, res) => {
  const { userId } = req.query;
  try {
    const notifications = await CustomerNotificationModel.find({
      userId: userId,
    });
    if (notifications.length > 0) {
      return res.status(200).json({ notifications: notifications });
    } else {
      return res
        .status(400)
        .json({ message: "You don't have any notification for your account." });
    }
  } catch (error) {
    console.error(
      "Failed to fetch notifications for your account due to : ",
      error
    );
    return res
      .status(500)
      .json({ message: "Failed to fetch notifications for your account!!" });
  }
};

export const deleteHomeOwnerNotifications = async (req, res) => {
  const { notificationId } = req.query;
  try {
    const notification = await OwnerNotificationModel.findByIdAndDelete(
      notificationId
    );
    if (notification) {
      return res
        .status(200)
        .json({ message: "The notification has deleted successfully!" });
    } else {
      return res.status(400).json({ message: "Something went wrong!!" });
    }
  } catch (error) {
    console.error("Failed to delete the notification due to : ", error);
    return res.status(500).json({
      message: "Failed to delete the notification, please try again!!",
    });
  }
};

export const deleteCustomerHomeNotifications = async (req, res) => {
  const { notificationId } = req.query;
  try {
    const notification = await CustomerNotificationModel.findByIdAndDelete(
      notificationId
    );
    if (notification) {
      return res
        .status(200)
        .json({ message: "The notification has deleted successfully!" });
    } else {
      return res.status(400).json({ message: "Something went wrong!!" });
    }
  } catch (error) {
    console.error("Failed to delete the notification due to : ", error);
    return res.status(500).json({
      message: "Failed to delete the notification, please try again!!",
    });
  }
};
