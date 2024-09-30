import mongoose from "mongoose";
import QueriesModel from "../models/HomeQueries.js";
import CustomerNotificationModel from "../models/CustomerNotificationsForHome.js";
import OwnerNotificationModel from "../models/OwnerNotificationsForHome.js";

export const addMyQuery = async (req, res) => {
  const { selectedHomeId } = req.query;
  const { userId, userFullName, userNumber, userEmail, userQueryText } =
    req.body;

  if ((!userFullName, !userNumber, !userEmail, !userQueryText)) {
    return res
      .status(400)
      .json({ message: "Please fill all fields to send query successfully!" });
  }

  try {
    const newQuery = await QueriesModel({
      userId: userId,
      userFullName: userFullName,
      userNumber: userNumber,
      userEmail: userEmail,
      userQuery: userQueryText,
      selectedHomeId: selectedHomeId,
    });
    const saveQuery = await newQuery.save();

    const CustomerNotification = new CustomerNotificationModel({
      userId: userId,
      message: `Your query has been sended to the owner.`,
      type: "query_added",
    });

    if (saveQuery) {
      await CustomerNotification.save();
      return res.status(201).json({
        message:
          "The query has been sended to owner, you will get a response soon!!",
      });
    } else {
      return res
        .status(400)
        .json({ message: "Failed to save the query as something went wrong!" });
    }
  } catch (error) {
    console.error("Failed to send query to the owner due to : ", error);
    return res
      .status(500)
      .json({ message: "Failed to send query to owner, please try again!" });
  }
};

export const checkExistingQuery = async (req, res) => {
  const { userId, selectedHomeId } = req.query;
  try {
    const query = await QueriesModel.find({
      userId: userId,
      selectedHomeId: selectedHomeId,
      queryStatus: "pending",
    });
    if (query.length > 0) {
      return res.status(200).json({ existingQuery: true });
    } else {
      return res.status(400).json({ existingQuery: false });
    }
  } catch (error) {
    console.error("Failed to check for your existing query due to : ", error);
    return res
      .status(500)
      .json({ message: "Failed to check for your existing queries!!" });
  }
};

export const fetchspecificquery = async (req, res) => {
  const { userId, selectedHomeId } = req.query;

  if (!userId || !selectedHomeId) {
    return res
      .status(400)
      .json({ message: "userId or selectedHomeId is missing or invalid" });
  }

  try {
    const query = await QueriesModel.find({
      userId: mongoose.Types.ObjectId(userId),
      selectedHomeId: mongoose.Types.ObjectId(selectedHomeId),
      queryStatus: "pending",
    });

    if (query.length > 0) {
      return res.status(200).json({ query });
    } else {
      return res.status(400).json({ message: "No query found!" });
    }
  } catch (error) {
    console.error("Failed to fetch specific query for you due to: ", error);
    return res
      .status(500)
      .json({ message: "Failed to fetch a specific query for you!" });
  }
};

export const deleteSpecificQuery = async (req, res) => {
  const { selectedQueryId } = req.query;
  try {
    const query = await QueriesModel.findByIdAndDelete(selectedQueryId);

    const CustomerNotification = new CustomerNotificationModel({
      userId: query.userId,
      message: `Your query has been deleted successfully.`,
      type: "query_deleted",
    });

    if (query) {
      await CustomerNotification.save();
      return res.status(200).json({
        message:
          "The query has been deleted successfully, now you won't recieve any update regarding it.",
      });
    }
  } catch (error) {
    console.error("Failed to delete your query for this home due to : ", error);
    return res
      .status(500)
      .json({ message: "Failed to delete your query, please try again!!" });
  }
};

export const fetchQueriesForHomeUser = async (req, res) => {
  const { homeId } = req.query;
  try {
    const queries = await QueriesModel.find({ selectedHomeId: homeId });
    if (queries.length > 0) {
      return res.status(200).json({ queries: queries });
    } else {
      return res
        .status(400)
        .json({ message: "No queries found for your home!!" });
    }
  } catch (error) {
    console.error("Failed to find queries for your home due to : ", error);
    return res
      .status(500)
      .json({ message: "Failed to find queries for your home!!" });
  }
};

export const insertResponseToQuery = async (req, res) => {
  const { queryId } = req.query;
  const { ownerId, ownerName, ownerNumber, ownerEmail, ownerReply } = req.body;

  if (!ownerReply) {
    return res.status(400).json({ message: "Please type a message to send." });
  }
  if (!ownerId || !ownerName || !ownerNumber || !ownerEmail) {
    return res
      .status(400)
      .json({ message: "All owner details must be provided." });
  }

  try {
    const query = await QueriesModel.findById(queryId);

    if (!query) {
      return res.status(404).json({ message: "Query not found." });
    }

    query.selectedHomeOwnerId = ownerId;
    query.selectedHomeOwnerName = ownerName;
    query.selectedHomeOwnerNumber = ownerNumber;
    query.selectedHomeOwnerEmail = ownerEmail;
    query.homeOwnerReplyToQuery = ownerReply;
    query.queryStatus = "resolved";

    const saveChangesToQuery = await query.save();

    const CustomerNotification = new CustomerNotificationModel({
      userId: query.userId,
      message: `You recieved a reply on your query from ${ownerName}.`,
      type: "query_owner_respond",
    });

    const OwnerNotification = new OwnerNotificationModel({
      userId: query.selectedHomeOwnerId,
      message: `You replied to query of ${query.userFullName}.`,
      type: "query_answered",
    });

    if (saveChangesToQuery) {
      await CustomerNotification.save();
      await OwnerNotification.save();
      return res.status(200).json({
        message: `Response has been sent to ${query.userFullName} successfully!!`,
      });
    } else {
      return res.status(400).json({ message: "Something went wrong!!" });
    }
  } catch (error) {
    console.error("Failed to send response to user due to: ", error);
    return res
      .status(500)
      .json({ message: "Failed to send response to user, please try again!!" });
  }
};

export const fetchResolvedQueries = async (req, res) => {
  const { userId } = req.query;
  try {
    const query = await QueriesModel.find({
      userId: userId,
      queryStatus: "resolved",
    });
    if (query.length > 0) {
      return res.status(200).json({ resolvedQueries: query });
    } else {
      return res
        .status(400)
        .json({ message: "No query founded for your account !! " });
    }
  } catch (error) {
    console.error(
      "Failed to fetch resolved queries for your account due to : ",
      error
    );
    return res
      .status(500)
      .json({ message: "Failed to fetch resolved queries for your account!!" });
  }
};
