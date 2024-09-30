import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import bodyParser from "body-parser";
import { fileURLToPath } from "url";
import {
  changeProfileInfo,
  checkLogin,
  createAccount,
} from "./controllers/Auth.js";
import upload from "./config/MulterConfig.js";
import {
  cancelformrestaurent,
  confirmenteredPassword,
  createrestaurentcentre,
  deleterestaurentdata,
  deleteRestaurentEntireData,
  fetchAllRestaurents,
  fetchRestaurentCount,
  proceedToRestaurentOwnerDashboard,
  updateRestaurentInformation,
} from "./controllers/Restaurents.js";
import {
  changeResItemInfo,
  createcategory,
  deletecategory,
  deleteselectedItem,
  fetchallitems,
  fetchcategories,
  fetchDetailsOfItem,
  fetchItemBySearch,
  fetchItemDetailsById,
  fetchItemSaleCount,
  fetchOtherItemsOfRest,
  fetchResItems,
  fetchRestaurentDetailsWithItems,
  fetchTotalItemSaleEarnings,
  fetchTotalItemsofRestaurentSale,
  insertanitem,
  searchResWithCategory,
  updateselectedItem,
} from "./controllers/RestaurentItem.js";
import resImgUploads from "./config/MulterCodeInsertItemRes.js";
import {
  acceptAnOrder,
  cancelCusOrder,
  changeCustomerAddress,
  fetchAllComOrdersCus,
  fetchAllConfirmedOrders,
  fetchAllCusOrders,
  fetchAllResOrders,
  fetchRemainingItemOrders,
  fetchSpecificOrder,
  fetchTotalItemSale,
  placeNewOrder,
} from "./controllers/RestaurentOrders.js";
import {
  addMyReview,
  checkMyReview,
  deleteMyReview,
  editMyReview,
  fetchAllItemReviews,
  fetchOrderData,
  fetchOUReviews,
  getMyReview,
  getReviewsNE2ItemAndUser,
  likeAReview,
} from "./controllers/RestaurentItemReview.js";
import {
  addToCart,
  confirmCartOrder,
  getCartItems,
  removeItemFromCart,
} from "./controllers/ResItemATC.js";
import {
  countCustomerTotalExpenses,
  countCustomerTotalNoOfRestaurents,
  deleteCustomer,
  deleteCustomerNotification,
  fetchCustomerDetails,
  fetchCustomerNotifications,
  fetchDetailsOfRestaurents,
  markNotificationsAsRead,
  updateCustomerDetails,
} from "./controllers/Customer.js";
import {
  deleteRestaurentNotification,
  getRestaurentNotifications,
} from "./controllers/RestaurentNotification.js";
import homeUploads from "./config/MulterHome.js";
import {
  createNewHome,
  fetchAllHomesInDB,
  fetchByBudget,
  fetchHomeData,
  fetchNoOfHomesOnWebsite,
  fetchOtherHomesNEselected,
  updateHomeData,
} from "./controllers/Homes.js";
import {
  checkforbookmarkedhome,
  placeHomeInBookmark,
  removeHomeFromBookmark,
  totalNoOfBookmarks,
} from "./controllers/HomeBookmarks.js";
import {
  addMyQuery,
  checkExistingQuery,
  deleteSpecificQuery,
  fetchQueriesForHomeUser,
  fetchResolvedQueries,
  fetchspecificquery,
  insertResponseToQuery,
} from "./controllers/HomeQueries.js";
import {
  addReplyToComment,
  deleteMyReply,
  deleteSelectedCommentFromMyHome,
  deleteUserComment,
  editUserComment,
  fetchCommentForReplies,
  fetchHomeComments,
  fetchMultipleRepliesToUser,
  fetchUserNameForComments,
  placeComment,
  replyToQuery,
} from "./controllers/HomeComments.js";
import {
  deleteCustomerHomeNotifications,
  deleteHomeOwnerNotifications,
  fetchCustomerHomeNotifications,
  fetchHomeOwnerNotifications,
} from "./controllers/HomeNotifications.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());
app.use((req, res, next) => {
  if (req.method === "POST" || req.method === "PUT" || req.method === "PATCH") {
    bodyParser.json()(req, res, next);
  } else {
    next();
  }
});
app.use(bodyParser.urlencoded({ extended: true }));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(
  "/restaurentUploads",
  express.static(path.join(path.resolve(), "restaurentUploads"))
);

app.use("/public", express.static(path.join(__dirname, "public")));

app.use(
  "/api/restaurentUploads",
  express.static(path.join(__dirname, "restaurentUploads"))
);

app.use(
  "/restaurentItemImg",
  express.static(path.join(__dirname, "restaurentItemImg"))
);

app.use("/homeimages", express.static(path.join(__dirname, "homeimages")));

// app.use(
//   "/restaurentItemImg",
//   express.static(path.join(path.resolve(), "restaurentItemImg"))
// );

const PORT = process.env.PORT;
const mongo_url = process.env.DB_URL;

if (!mongo_url) {
  console.error(
    "The database is not connected successfully, please recheck the url in env file and try again!!"
  );
  process.exit(1);
}

mongoose
  .connect(mongo_url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("The database has been connected successfully!!");
    app.listen(PORT, () => {
      console.log(`Server is running on ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Something went wrong while connecting to database", error);
  });

// create account API
app.post("/api/createaccount", createAccount);

// login user API
app.post("/api/checkuser", checkLogin);

// create restaurent centre API
app.post(
  "/api/saverestaurentinfo",
  upload.single("restaurentpfp"),
  createrestaurentcentre
);

// re-enter restaurent details API
app.delete("/api/deleterestaurentdetails/:restaurentId", deleterestaurentdata);

// cancel formation of restaurent data centre API
app.delete("/api/eraserestaurentdata/:userId", cancelformrestaurent);

// proceed restaurent owner to dashboard API
app.post(
  "/api/restaurentownerdashboard/:restaurentId",
  proceedToRestaurentOwnerDashboard
);

// create new category for restaurent items API
app.post("/api/newitemcategory/:restaurentId", createcategory);

// get categories for restaurent API
app.get("/api/fetchrescategories/:restaurentId", fetchcategories);

// remove item categories API
app.delete("/api/removeitemcategory/:itemId", deletecategory);

// insert items to the category API
app.put(
  "/api/insertitemtocategory/:insertionCategoryId",
  resImgUploads.array("itemImages"),
  insertanitem
);

//fetch items from the itemlist API
app.get("/api/fetchallitems/:restaurentId", fetchallitems);

// update subitem of item array API
app.put(
  "/api/changeResItemDetails/:itemId",
  resImgUploads.array("changedImages"),
  updateselectedItem
);

// delete a specific item from category API
app.delete("/api/deleteselecteditem/:itemId", deleteselectedItem);

// check for correct password API
app.post("/api/checkuserpassword/:id", confirmenteredPassword);

// update restaurent information from profile API
app.put(
  "/api/updateResInfo/:restaurentId",
  upload.single("restaurentnewImage"),
  updateRestaurentInformation
);

// fetch the total number of restaurents available
app.get("/api/fetchResCount", fetchRestaurentCount);

// fetch all restaurents on ROUSTUF
app.get("/api/fetchallrestaurents", fetchAllRestaurents);

// fetch all items of a single restaurent API
app.post("/api/fetchresitems", fetchResItems);

// search restaurents using category name API
app.get("/api/fetchresbycategory", searchResWithCategory);

// fetch details of restaurent item with Item ID API
app.post("/api/fetchIDbyID", fetchItemDetailsById);

// fetch restaurent items with it's details API
app.post("/api/findresdetails", fetchRestaurentDetailsWithItems);

// place order API
app.post("/api/placeorder", placeNewOrder);

// edit restaurent item details API
app.put("/api/changeresitemdetails", changeResItemInfo);

// fetch all pending orders of the restaurent API
app.get("/api/fetchallpendingorders", fetchAllResOrders);

// confirm the order API
app.put("/api/confirmorder/:orderId", acceptAnOrder);

// fetch all confirmed orders for restaurent API
app.get("/api/fetchConfResOrders", fetchAllConfirmedOrders);

// fetch all orders of customer API
app.get("/api/fetchallcusorders", fetchAllCusOrders);

// change address of customer API
app.put("/api/changemyaddress/:orderId", changeCustomerAddress);

// cancel order by customer API
app.put("/api/cancelmyorder/:orderId", cancelCusOrder);

// fetch all the completed orders for customer API
app.get("/api/fetchallcomorders", fetchAllComOrdersCus);

// fetch data of an order API
app.get("/api/fetchorderdata", fetchOrderData);

// post a review of customer API
app.post("/api/postnewreview", addMyReview);

// find for existing review of a person API
app.post("/api/checkmyreview", checkMyReview);

// fetch all other users reviews API
app.post("/api/fetchOUR", fetchOUReviews);

// like a review using userId API
app.put("/api/likeAR", likeAReview);

// fetch my review for an item API
app.post("/api/fetchMR", getMyReview);

// edit my review API
app.put("/api/editmyreview", editMyReview);

// delete my review API
app.delete("/api/deletemyreview", deleteMyReview);

// fetch reviews of items that are not yours and not this item API
app.post("/api/fetchNE2ItemAndUser", getReviewsNE2ItemAndUser);

// fetch details of item API
app.get("/api/fetchitemdetails", fetchDetailsOfItem);

// fetch total sale of item API
app.get("/api/fetchtotalitemsale", fetchTotalItemSale);

// add item to cart API
app.post("/api/addtocart", addToCart);

// fetch cart items API
app.get("/api/fetchcartitems", getCartItems);

// confirm order API
app.post("/api/confirmcartorder", confirmCartOrder);

// remove item from cart API
app.delete("/api/removeitemfromcart", removeItemFromCart);

// fetch item by search API
app.post("/api/fetchitembysearch", fetchItemBySearch);

// fetch customer details API
app.get("/api/fetchcustomerdetails", fetchCustomerDetails);

// update customer details API
app.put("/api/updatecustomerdetails", updateCustomerDetails);

// delete customer API
app.delete("/api/deletecustomer", deleteCustomer);

// fetch total expenses of customer API
app.get("/api/fetchtotalexpenses", countCustomerTotalExpenses);

// fetch total number of restaurents visited by customer API
app.get("/api/fetchtotalrestaurents", countCustomerTotalNoOfRestaurents);

// fetch details of restaurents visited by customer API
app.get("/api/fetchrestaurentdetails", fetchDetailsOfRestaurents);

// fetch item sale count API
app.get("/api/fetchitemsalecountforowner", fetchItemSaleCount);

// fetch total item sale earnings API
app.get("/api/fetchtotalitemsaleearnings", fetchTotalItemSaleEarnings);

// fetch remaining item orders API
app.get("/api/fetchremainingitemorders", fetchRemainingItemOrders);

// fetch all reviews of an item API
app.get("/api/fetchallitemreviews", fetchAllItemReviews);

// fetch specific order API
app.get("/api/fetchspecificorder", fetchSpecificOrder);

// fetch other items of restaurent API
app.post("/api/fetchotherrestitems", fetchOtherItemsOfRest);

// fetch customer notifications API
app.get("/api/fetchcustomernotifications", fetchCustomerNotifications);

// mark notification as read API
app.put(
  "/api/updatenotificationstatus/:notificationId",
  markNotificationsAsRead
);

// delete customer notification API
app.delete("/api/deletecustomernotification", deleteCustomerNotification);

// fetch total item sale of restaurent API
app.get("/api/fetchtotalitemsaleofrest", fetchTotalItemsofRestaurentSale);

// fetch restaurent notifications API
app.get("/api/fetchrestaurentnotifications", getRestaurentNotifications);

// delete restaurent notification API
app.delete("/api/deleterestnotification", deleteRestaurentNotification);

// delete restaurent entire data API
app.delete("/api/deleterestdata/:restaurentId", deleteRestaurentEntireData);

// save home data of user API
app.post(
  "/api/savehomedetails",
  homeUploads.array("imagesofHome"),
  createNewHome
);

// fetch details of my home API
app.get("/api/fetchdetailsofmyhome", fetchHomeData);

// update my home details API
app.put("/api/updatemyhome", homeUploads.array("newImages"), updateHomeData);

// fetch all homes API
app.get("/api/fetchhomesfromDB", fetchAllHomesInDB);

// fetch homes based on budget API
app.get("/api/fetchhomesbybudget", fetchByBudget);

// fetch homes but exclude nav one API
app.get("/api/fetchexclhomes", fetchOtherHomesNEselected);

// add home into bookmarks API
app.post("/api/placemybookmark", placeHomeInBookmark);

// remove home from bookmarks API
app.delete("/api/removebookmark", removeHomeFromBookmark);

// check for my bookmarks API
app.get("/api/checkingbookmarks", checkforbookmarkedhome);

// send a query to home owner API
app.post("/api/sendmyquery", addMyQuery);

// check for existing query API
app.get("/api/checkingqueries", checkExistingQuery);

// fetch existing query API
app.get("/api/fetchspecificquery", fetchspecificquery);

// delete existing query API
app.delete("/api/deletemyquery", deleteSpecificQuery);

// add a new comment API
app.post("/api/placecomment", placeComment);

// get comments of home API
app.get("/api/fetchhomecomments", fetchHomeComments);

// delete my comment API
app.delete("/api/deletecomment", deleteUserComment);

// update my comment API
app.put("/api/updatecomment", editUserComment);

// add a reply to comment API
app.put("/api/addreplytocomment", addReplyToComment);

// fetch comments with replies API
app.get("/api/fetchrepliesofcomments", fetchCommentForReplies);

// fetch usernames for comments API
app.get("/api/fetchusernameforcomments", fetchUserNameForComments);

// delete my reply from a comment API
app.delete("/api/deletemyreply", deleteMyReply);

// send reply of my comment API
app.put("/api/sendcommentreply", replyToQuery);

// fetch replies to the comments API
app.get("/api/fetchreplies", fetchMultipleRepliesToUser);

// fetch total number of bookmarks API
app.get("/api/fetchbookmarks", totalNoOfBookmarks);

// update user profile API
app.put("/api/updateuserinfo", changeProfileInfo);

// fetch queries for your home API
app.get("/api/fetchqueriesforhome", fetchQueriesForHomeUser);

// send response to user query API
app.put("/api/sendresponsetoquery", insertResponseToQuery);

// fetch resolved queries for user API
app.get("/api/fetchresolvedqueries", fetchResolvedQueries);

// delete selected comment from home API
app.delete("/api/removeselectedcomment", deleteSelectedCommentFromMyHome);

// fetch notifications of home owner API
app.get("/api/fetchOHN", fetchHomeOwnerNotifications);

// fetch notifications of owner home API
app.get("/api/fetchCHN", fetchCustomerHomeNotifications);

// delete notifications of home user API
app.delete("/api/deleteHON", deleteHomeOwnerNotifications);

// delete notifications of customer home API
app.delete("/api/deleteCHN", deleteCustomerHomeNotifications);

// fetch total no of homes on site API
app.get("/api/fetchTotalHomesOnSite", fetchNoOfHomesOnWebsite);
