import { useEffect, useState } from "react";
import CustomerHomeNav from "../navbarsAndFooters/RestaurentCustomerHomeNav";
import ResItemsCusSB from "../resOwnPageEl/CustomerViewResItemsSB";
import "./CustomerPurchaseResItems.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileWaveform, faThumbsUp } from "@fortawesome/free-solid-svg-icons";
import { faGratipay } from "@fortawesome/free-brands-svg-icons";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const PurchaseResItems = () => {
  const [DataOfRest, setDataOfRest] = useState(null);
  const [placeOrderModal, setPlaceOrderModal] = useState(false);
  const [defCusName, setDefCusName] = useState("");
  const [defCusId, setDefCusId] = useState(null);
  const [restaurentId, setRestaurentId] = useState(null);
  const [itemCount, setItemCount] = useState(0);
  const [addressInfo, setAddressInfo] = useState("");
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [customerNumber, setCustomerNumber] = useState("");
  const [dataOfUser, setDataOfUser] = useState([]);
  const [successfullOrderModal, setSuccessfullOrderModal] = useState(false);
  const [viewCusAddressModal, setViewCusAddressModal] = useState(false);
  const [customerOrdersModal, setCustomerOrdersModal] = useState(false);
  const [initialOD, setInitialOD] = useState({});
  const [customerPendingOrders, setCustomerPendingOrders] = useState([]);
  const [isCustomerPendingOrders, setIsCustomerPendingOrders] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState([]);
  const [newAddress, setNewAddress] = useState("");
  const [newOrder, setNewOrder] = useState({});
  const [completedOrders, setCompletedOrders] = useState([]);
  const [orderReviewModal, setOrderReviewModal] = useState(false);
  const [selectedOrderData, setSelectedOrderData] = useState([]);
  const [customerReview, setCustomerReview] = useState("");
  const [isUserhaveReview, setIsUserHaveReview] = useState(false);
  const [OURdata, setOURdata] = useState([]);
  const [selectedorderId, setSelectedOrderId] = useState(null);
  const [isMyReviewOpen, setIsMyReviewOpen] = useState(false);
  const [MRD, setMRD] = useState([]);
  const [editMyReviewModal, setEditMyReviewModal] = useState(false);
  const [erIID, setErIID] = useState([]);
  const [reviewNewText, setReviewNewText] = useState("");
  const [imgRM, setImgRM] = useState(false);
  const [newReview, setNewReview] = useState([]);
  const [itemId, setItemId] = useState(null);
  const [isItemAddedToCart, setIsItemAddedToCart] = useState(false);
  const [itemAddedSuccessfully, setItemAddedSuccessfully] = useState(false);
  const [addedCartData, setAddedCartData] = useState([]);
  const [showCartModal, setShowCartModal] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [confirmOrderModal, setConfirmOrderModal] = useState(false);
  const [confirmOrderItemData, setConfirmOrderItemData] = useState([]);
  const [confirmOrderCustomerName, setConfirmOrderCustomerName] = useState("");
  const [confirmOrderCustomerNumber, setConfirmOrderCustomerNumber] =
    useState("");
  const [confirmOrderItemQuantity, setConfirmOrderItemQuantity] = useState(0);
  const [confirmOrderCustomerAddress, setConfirmOrderCustomerAddress] =
    useState("");
  const [itemSearch, setItemSearch] = useState("");
  const [displayImageContainer, setDisplayImageContainer] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");
  const [customerNotifications, setCustomerNotifications] = useState([]);
  const [notificationModal, setNotificationModal] = useState(false);

  const navigate = useNavigate();

  const onItemClick = (subItem) => {
    setDataOfRest(subItem);
  };

  const onMyOrderClick = () => {
    setCustomerOrdersModal(true);
    fetchCusPenOrders();
  };

  const onCartClick = () => {
    setShowCartModal(true);
  };

  const onNotificationClick = () => {
    setNotificationModal(true);
    handleFetchCustomerNotifications();
  };

  if (DataOfRest) {
    console.log(DataOfRest);
  }

  const closeItemDisplay = () => {
    setDataOfRest(null);
  };

  useEffect(() => {
    const fetchCusName = () => {
      try {
        const userData = JSON.parse(localStorage.getItem("user"));
        if (userData) {
          setDataOfUser(userData);
          setDefCusName(userData.fullname);
          // console.log("User name is ", userData.fullname);
          setDefCusId(userData._id);
          // console.log(userData._id);
        }
      } catch (error) {
        console.error("Failed to get name of user due to : ", error);
      }
    };
    fetchCusName();
  }, []);

  useEffect(() => {
    const fetchRestaurentId = () => {
      const restId = JSON.parse(localStorage.getItem("selectedRestaurentId"));
      if (restId) {
        setRestaurentId(restId);
        // console.log(restId);
      }
    };
    fetchRestaurentId();
  }, []);

  const clearOrderInfo = () => {
    setDefCusName("");
    setItemCount("");
    setPlaceOrderModal(false);
    setAddressInfo("");
  };

  const handlePlaceCustomerOrder = (DataOfRest) => {
    setPlaceOrderModal(true);
    setSelectedItemId(DataOfRest._id);
  };

  const handlePlaceNewOrder = async () => {
    if ((!addressInfo, !customerNumber, !defCusName)) {
      return window.alert(
        "Please fill all the information required to place the order."
      );
    }

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}placeorder`,
        {
          customerName: defCusName,
          customerId: defCusId,
          customerNumber: customerNumber,
          deliveryAddress: addressInfo,
          itemQuantity: itemCount,
          restaurentId: restaurentId,
          itemId: selectedItemId,
        }
      );
      if (response.status === 201) {
        setInitialOD(response.data.order);
        // console.log(response.data.order);
        setNewOrder(response.data.order);
        setDefCusName("");
        setDefCusId(null);
        setCustomerNumber("");
        setAddressInfo("");
        setRestaurentId(null);
        setItemCount(0);
        setSelectedItemId(null);
        setPlaceOrderModal(false);
        setSuccessfullOrderModal(true);
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        window.alert(error.response.data.message);
      } else {
        console.error("Failed to place the order due to:", error);
        window.alert("Failed to place the order, please try again!!");
      }
    }
  };

  const handleCloseSuccessModalByContinue = () => {
    setInitialOD({});
    setDataOfRest(null);
    setSuccessfullOrderModal(false);
  };

  const fetchCusPenOrders = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}fetchallcusorders?userId=${dataOfUser?._id}`
      );
      if (response.status === 200) {
        setCustomerPendingOrders(response.data.orders);
        console.log("Pending customer orders are ", response.data.orders);
      }
    } catch (error) {
      console.error(
        "Failed to fetch all pending orders for customer due to : ",
        error
      );
    }
  };

  useEffect(() => {
    if (dataOfUser) {
      fetchCusPenOrders();
    }
  }, [dataOfUser]);

  const handleDisplayCustomerAddress = (order) => {
    setViewCusAddressModal(true);
    setCustomerOrdersModal(false);
    setSelectedOrder(order);
  };

  const handleChangeCustomerAddress = async () => {
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}changemyaddress/${selectedOrder._id}`,
        {
          newAddress: newAddress,
        }
      );
      if (response.status === 200) {
        window.alert(response.data.message);
        setViewCusAddressModal(false);
        setCustomerOrdersModal(true);
        setSelectedOrder([]);
        setNewAddress("");
        setCustomerPendingOrders((prevOrders) =>
          prevOrders.map((order) =>
            order._id === selectedOrder._id
              ? { ...order, deliveryaddress: newAddress }
              : order
          )
        );
      }
    } catch (error) {
      console.error("Failed to change customer address due to : ", error);
      window.alert("Failed to change your current address, please try again");
    }
  };

  const handleCloseAddressChange = () => {
    setCustomerOrdersModal(true);
    setViewCusAddressModal(false);
  };

  const handleCancelCusOrder = async (order) => {
    const confirmation = window.confirm(
      "Do you want to cancel this order ? After this you can't fetch any detail related to this order."
    );

    if (confirmation) {
      try {
        if (!order || !order._id) {
          window.alert("Order ID is missing. Please try again.");
          return;
        }

        const response = await axios.put(
          `${process.env.REACT_APP_API_URL}cancelmyorder/${order._id}`
        );
        if (response.status === 200) {
          window.alert(response.data.message);
          setCustomerPendingOrders((prevOrders) =>
            prevOrders.filter((o) => o._id !== order._id)
          );
        }
      } catch (error) {
        if (
          error.response &&
          error.response.data &&
          error.response.data.message
        ) {
          window.alert(error.response.data.message);
        } else {
          console.error("Failed to cancel the order due to:", error);
          window.alert("Failed to cancel the order, please try again!!");
        }
      }
    }
  };

  const handleSeeMyOrders = () => {
    setCustomerOrdersModal(true);
    setSuccessfullOrderModal(false);
    setCustomerPendingOrders((prevOrder) => [...prevOrder, newOrder]);
  };

  useEffect(() => {
    const fetchCusCompOrders = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}fetchallcomorders?cusId=${dataOfUser._id}`
        );
        if (response.status === 200) {
          setCompletedOrders(response.data.completedOrders);
          console.log(
            "Completed orders of user are ",
            response.data.completedOrders
          );
        }
      } catch (error) {
        console.error("Failed to get the orders of user due to : ", error);
      }
    };
    if (dataOfUser) {
      fetchCusCompOrders();
    }
  }, [dataOfUser._id]);

  const handleFetchOrderData = async (order) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}fetchorderdata?orderId=${order._id}`
      );
      if (response.status === 200) {
        setSelectedOrderData(response.data.orderData);
        setOrderReviewModal(true);
        setCustomerOrdersModal(false);
        setSelectedOrderId(order.itemId);
        // console.log("Selected Order Data is ", response.data.orderData);
      }
    } catch (error) {
      console.error("Failed to get order details due to: ", error);
    }
  };

  const handleCloseSOM = () => {
    setOrderReviewModal(false);
    setCustomerOrdersModal(true);
    setSelectedOrderData([]);
    setSelectedOrderId(null);
    setOURdata([]);
    setMRD([]);
    setIsMyReviewOpen(false);
    // console.log("selectedorderId after setting to null:", selectedorderId);
  };

  const handleSaveMyReview = async (selectedOrderData) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}postnewreview?orderId=${selectedOrderData._id}`,
        {
          customerId: dataOfUser._id,
          customerOpinion: customerReview,
          restaurentName: selectedOrderData.restaurentname,
        }
      );
      if (response.status === 200) {
        window.alert(response.data.message);
        setCustomerReview("");
        setIsUserHaveReview(false);
        setIsMyReviewOpen(true);
        handleFetchMyReview();
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        window.alert(error.response.data.message);
      } else {
        console.error("Failed to add your review due to:", error);
        window.alert("Failed to add your review, please try again!!");
      }
    }
  };

  useEffect(() => {
    if (isMyReviewOpen) {
      handleFetchMyReview();
    }
  }, [isMyReviewOpen]);

  const handleCheckForUserReview = async () => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}checkmyreview?orderId=${selectedOrderData?._id}`,
        {
          customerId: dataOfUser._id,
        }
      );
      if (response.status === 200) {
        setIsUserHaveReview(true);
      } else {
        setIsUserHaveReview(false);
      }
    } catch (error) {
      console.error("Failed to run check for review of user due to : ", error);
    }
  };

  useEffect(() => {
    handleCheckForUserReview();
  }, [selectedOrderData]);

  const fetchOUR = async () => {
    if (!selectedorderId) return;
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}fetchOUR?userId=${dataOfUser?._id}`,
        {
          itemId: selectedorderId,
        }
      );
      if (response.status === 200) {
        const allReviewData = response.data.allReviews;
        setOURdata(allReviewData);
        console.log("Other users reviews are ", allReviewData);
      }
    } catch (error) {
      console.error("Failed to get other users reviews due to : ", error);
    }
  };

  useEffect(() => {
    if (dataOfUser._id && selectedorderId) {
      fetchOUR();
    }
  }, [dataOfUser._id, selectedorderId]);

  const handleLikeReview = async (reviewId) => {
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}likeAR?reviewId=${reviewId}`,
        {
          userId: dataOfUser?._id,
        }
      );
      if (response.status === 200) {
        setOURdata((prevData) =>
          prevData.map((r) =>
            r._id === reviewId ? { ...r, likes: response.data.review.likes } : r
          )
        );
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        window.alert(error.response.data.message);
      } else {
        console.error("Failed to add like to this review due to:", error);
        window.alert("Failed to add like to this review, please try again!!");
      }
    }
  };

  const handleShowMyReview = () => {
    setIsMyReviewOpen(true);
    setIsUserHaveReview(false);
  };

  const handleHideMyReview = () => {
    setIsMyReviewOpen(false);
    setIsUserHaveReview(true);
  };

  const handleFetchMyReview = async () => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}fetchMR?itemId=${selectedOrderData?.itemId}`,
        {
          userId: dataOfUser?._id,
        }
      );
      if (response.status === 200) {
        setMRD(response.data.urReview);
        console.log(
          "Your review fetched successfully!",
          response.data.urReview
        );
      }
    } catch (error) {
      console.error("Failed to fetch your review due to : ", error);
    }
  };

  useEffect(() => {
    if (selectedOrderData) {
      handleFetchMyReview();
    }
  }, [selectedOrderData]);

  const handleEditReviewModal = (review) => {
    setEditMyReviewModal(true);
    setOrderReviewModal(false);
    setErIID(review);
  };

  const handleUpdateReview = async () => {
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}editmyreview?itemId=${erIID.orderItemId}`,
        {
          userId: dataOfUser._id,
          newTxt: reviewNewText,
        }
      );
      if (response.status === 200) {
        window.alert(response.data.message);
        setEditMyReviewModal(false);
        setOrderReviewModal(true);
        setErIID([]);
        setReviewNewText("");
        setMRD((prevData) =>
          prevData.map((r) =>
            r._id === erIID._id ? { ...r, reviewText: reviewNewText } : r
          )
        );
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        window.alert(error.response.data.message);
      } else {
        console.error("Failed to edit your review due to:", error);
        window.alert("Failed to edit your review, please try again!");
      }
    }
  };

  const handleCloseEditReviewModal = () => {
    setEditMyReviewModal(false);
    setOrderReviewModal(true);
    setErIID([]);
    setReviewNewText("");
  };

  const handleDeleteMyReview = async (itemId) => {
    if (!itemId) {
      console.error("Item ID is undefined");
      return window.alert("Failed to delete your review, item ID is missing.");
    }

    const confirmation = window.confirm(
      "Do you want to delete your review about this item?"
    );

    if (confirmation) {
      try {
        const response = await axios.delete(
          `${process.env.REACT_APP_API_URL}deletemyreview`,
          {
            data: { itemId, userId: dataOfUser._id },
          }
        );
        if (response.status === 200) {
          window.alert(response.data.message);
          setIsMyReviewOpen(false);
          setIsUserHaveReview(true);
          setMRD([]);
          setOrderReviewModal(true);
        }
      } catch (error) {
        if (
          error.response &&
          error.response.data &&
          error.response.data.message
        ) {
          window.alert(error.response.data.message);
        } else {
          console.error("Failed to delete your review due to : ", error);
          window.alert("Failed to delete your review, please try again.");
        }
      }
    }
  };

  const handleOpenImgRM = (itemId) => {
    setImgRM(true);
    setSelectedOrderId(itemId);
    fetchOUR();
  };

  console.log("OUR data is ", OURdata);

  const handleFetchRandomReview = async () => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}fetchNE2ItemAndUser?itemId=${selectedorderId}`,
        {
          userId: dataOfUser?._id,
        }
      );
      if (response.status === 200) {
        setNewReview(response.data.newReview);
        console.log("Random review is ", response.data.newReview);
      }
    } catch (error) {
      console.error("Failed to fetch random review due to : ", error);
    }
  };

  useEffect(() => {
    if (selectedorderId) {
      handleFetchRandomReview();
    }
  }, [selectedorderId]);

  const handleCloseIMGRM = () => {
    setImgRM(false);
    setSelectedOrderId(null);
    setOURdata([]);
    setNewReview([]);
  };

  const handleExploreSelectedItem = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}fetchitemdetails?itemId=${newReview.orderItemId}`
      );
      if (response.status === 200) {
        setDataOfRest(response.data.itemData);
        setImgRM(false);
      }
    } catch (error) {
      console.error("Failed to explore selected item due to : ", error);
    }
  };

  const handlePlaceMyOrder = () => {
    setPlaceOrderModal(true);
    setImgRM(false);
  };

  const handleFetchTotalItemSale = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}fetchtotalitemsale?itemId=${itemId}`
      );
      if (response.status === 200) {
        window.alert(
          `${response.data.totalSale} items of this type has been sold till yet.`
        );
      }
    } catch (error) {
      console.error("Failed to fetch total sale of item due to : ", error);
    }
  };

  useEffect(() => {
    handleFetchTotalItemSale();
  }, [itemId]);

  const handleATCmodal = () => {
    setIsItemAddedToCart(true);
  };

  const handleBuyNowItem = () => {
    setIsItemAddedToCart(false);
    setPlaceOrderModal(true);
  };

  const handleAddToCart = async () => {
    const confirmation = window.confirm(
      "Do you want to add this item to your cart ?"
    );
    if (confirmation) {
      try {
        const response = await axios.post(
          `${process.env.REACT_APP_API_URL}addtocart?itemId=${DataOfRest._id}`,
          {
            userId: dataOfUser._id,
            restaurentId: restaurentId,
          }
        );
        if (response.status === 201) {
          // window.alert(response.data.message);
          setItemAddedSuccessfully(true);
          setIsItemAddedToCart(false);
          setAddedCartData(response.data.cartItem);
          handleFetchCartItems();
        }
      } catch (error) {
        console.error("Failed to add item to cart due to : ", error);
        window.alert("Failed to add item to cart, please try again!!");
      }
    }
  };

  const handleCloseATCModal = () => {
    setIsItemAddedToCart(false);
    setItemAddedSuccessfully(false);
    setAddedCartData([]);
    setDataOfRest(null);
  };

  const handleFetchCartItems = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}fetchcartitems?userId=${dataOfUser._id}`
      );
      if (response.status === 200) {
        setCartItems(response.data.cartItems);
      }
    } catch (error) {
      console.error("Failed to fetch cart items due to : ", error);
    }
  };

  useEffect(() => {
    handleFetchCartItems();
  }, [dataOfUser]);

  const handleCloseCartModal = () => {
    setShowCartModal(false);
  };

  const handleConfirmOrderModal = (item) => {
    setConfirmOrderModal(true);
    setConfirmOrderItemData(item);
    setShowCartModal(false);
  };

  if (confirmOrderItemData) {
    console.log("Confirm order item data is ", confirmOrderItemData);
  }

  useEffect(() => {
    if (confirmOrderItemData) {
      setConfirmOrderCustomerName(confirmOrderItemData.customerName);
    }
  }, [confirmOrderItemData]);

  const handleCloseConfirmOrderModal = () => {
    setConfirmOrderModal(false);
    setConfirmOrderItemData([]);
    setShowCartModal(true);
    setConfirmOrderCustomerAddress("");
    setConfirmOrderCustomerNumber("");
    setConfirmOrderCustomerName("");
    setConfirmOrderItemQuantity(0);
  };

  const handleConfirmCartOrder = async () => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}confirmcartorder?cartId=${confirmOrderItemData._id}`,
        {
          userId: dataOfUser._id,
          restaurentId: confirmOrderItemData.restaurentId,
          itemQuantity: confirmOrderItemQuantity,
          customerName: confirmOrderCustomerName,
          customerAddress: confirmOrderCustomerAddress,
          customerNumber: confirmOrderCustomerNumber,
        }
      );
      if (response.status === 200) {
        window.alert(response.data.message);
        setConfirmOrderModal(false);
        setConfirmOrderItemData([]);
        setConfirmOrderCustomerAddress("");
        setConfirmOrderCustomerNumber("");
        setConfirmOrderCustomerName("");
        setConfirmOrderItemQuantity(0);
        handleFetchCartItems();
        fetchCusPenOrders();
        setCustomerOrdersModal(true);
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        window.alert(error.response.data.message);
      } else {
        console.error("Failed to confirm cart order due to : ", error);
        window.alert("Failed to confirm cart order, please try again!!");
      }
    }
  };

  const handlePressGTC = () => {
    setItemAddedSuccessfully(false);
    setShowCartModal(true);
  };

  const handleRemoveItemFromCart = async (itemId) => {
    try {
      const response = await axios.delete(
        `${process.env.REACT_APP_API_URL}removeitemfromcart?itemId=${itemId}`
      );
      if (response.status === 200) {
        window.alert(response.data.message);
        handleFetchCartItems();
      }
    } catch (error) {
      console.error("Failed to remove item from cart due to : ", error);
      window.alert("Failed to remove item from cart, please try again!!");
    }
  };

  const handleSearchItem = async () => {
    if (itemSearch === "") {
      window.alert("Please enter the item name to search");
      return;
    }
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}fetchitembysearch?itemName=${itemSearch}`,
        {
          restaurentId: restaurentId,
        }
      );
      if (response.status === 200) {
        setDataOfRest(response.data.item);
        setItemSearch("");
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        window.alert(error.response.data.message);
      } else {
        console.error("Failed to search item due to : ", error);
        window.alert("Failed to search item, please try again!!");
      }
    }
  };

  const handleDisplaySelectedImage = (image) => {
    setDisplayImageContainer(true);
    setSelectedImage(image);
  };

  const handleCloseDisplayImageContainer = () => {
    setDisplayImageContainer(false);
    setSelectedImage("");
  };

  const handleFetchCustomerNotifications = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}fetchcustomernotifications?customerId=${dataOfUser?._id}`
      );
      if (response.status === 200) {
        setCustomerNotifications(response.data.notifications);
      }
    } catch (error) {
      console.error("Failed to fetch customer notifications due to : ", error);
    }
  };

  useEffect(() => {
    handleFetchCustomerNotifications();
  }, [dataOfUser]);

  if (customerNotifications?.length > 0) {
    console.log("Customer Notifications are : ", customerNotifications);
  }

  const handleCloseNotificationModal = () => {
    setNotificationModal(false);
    setCustomerNotifications([]);
  };

  // below code is not working so i commented it

  // const handleMarkNotificationAsRead = async (notificationId) => {
  //   try {
  //     const response = await axios.put(
  //       `${process.env.REACT_APP_API_URL}updatenotificationstatus/${notificationId}`
  //     );
  //     if (response.status === 200) {
  //       // Update the local state to mark the notification as read
  //       setCustomerNotifications((prevNotifications) =>
  //         prevNotifications.map((notification) =>
  //           notification._id === notificationId
  //             ? { ...notification, read: true }
  //             : notification
  //         )
  //       );
  //     }
  //   } catch (error) {
  //     console.error("Failed to mark notification as read due to:", error);
  //   }
  // };

  // useEffect(() => {
  //   customerNotifications.forEach((notification) => {
  //     if (!notification.read) {
  //       handleMarkNotificationAsRead(notification._id);
  //     }
  //   });
  // }, [customerNotifications]);

  const handleShowPlacedOrder = () => {
    setNotificationModal(false);
    setCustomerOrdersModal(true);
    setIsCustomerPendingOrders(true);
  };

  const handleShowAcceptedOrder = () => {
    setNotificationModal(false);
    setCustomerOrdersModal(true);
    setIsCustomerPendingOrders(false);
  };

  const handleShowItemInCart = () => {
    setNotificationModal(false);
    setShowCartModal(true);
  };

  const handleShowNewProfile = () => {
    setNotificationModal(false);
    navigate("/viewcustomersettings");
  };

  const handleDeleteCustomerNotification = async (notificationId) => {
    const confirmation = window.confirm(
      "Do you want to delete this notification ?"
    );
    if (confirmation) {
      try {
        const response = await axios.delete(
          `${process.env.REACT_APP_API_URL}deletecustomernotification?notificationId=${notificationId}`
        );
        if (response.status === 200) {
          window.alert(response.data.message);
          setCustomerNotifications((prevNotifications) =>
            prevNotifications.filter(
              (notification) => notification._id !== notificationId
            )
          );
        }
      } catch (error) {
        console.error(
          "Failed to delete customer notification due to : ",
          error
        );
        window.alert(
          "Failed to delete customer notification, please try again!!"
        );
      }
    }
  };

  return (
    <>
      <CustomerHomeNav
        onMyOrderClick={onMyOrderClick}
        onCartClick={onCartClick}
        onNotificationClick={onNotificationClick}
      />
      <ResItemsCusSB onItemClick={onItemClick} />
      {!DataOfRest && (
        <>
          <div id="noItemSelected">
            <h4 id="noItemSelectedBL">Select the item you want to purchase</h4>
          </div>
        </>
      )}
      {DataOfRest && (
        <>
          <div id="itemSelectedCustomerTB">
            <div id="displaySelectedItemImages">
              {DataOfRest.subitemImages &&
              DataOfRest.subitemImages.length > 0 ? (
                DataOfRest.subitemImages.map((image, index) => (
                  <>
                    <img
                      key={index}
                      id="fetchedSelectedItemImage"
                      src={`http://localhost:8081/restaurentItemImg/${image}`}
                      alt={`SubItem Image ${index + 1}`}
                    />
                    <button
                      id="zoomImage"
                      onClick={() => handleDisplaySelectedImage(image)}
                    >
                      View Image
                    </button>
                  </>
                ))
              ) : (
                <p> No image has been added for this item.</p>
              )}
              <h4 id="displaySelectedItemImagesHeading">
                Images Of Item You Selected Recently
              </h4>
              <div id="BGselectedItemButtons">
                <h4 id="BGselectedItemL">
                  Do You Want To Make Any Purchase of {DataOfRest.name} ? Go
                  Further
                </h4>
                <button
                  id="placeOrderBtn"
                  onClick={() => handlePlaceCustomerOrder(DataOfRest)}
                >
                  Place Order
                </button>
                <button id="addItemToCart" onClick={() => handleATCmodal()}>
                  Add To Cart
                </button>
                <button
                  id="totalItemSale"
                  onClick={() => setItemId(DataOfRest._id)}
                >
                  Total Sale Of Item
                </button>
              </div>
              <div id="infoContainerSelectedItem">
                <p id="selectedItemNameL">Name : {DataOfRest.name}</p>
                <p id="selectedItemPriceL">Price : {DataOfRest.price} ruppes</p>
                <p id="selectedItemQuantityL">
                  Quantity : {DataOfRest.quantity} left only
                </p>
                <div id="selectedItemDescContainer">
                  <p id="selectedItemDescL">" {DataOfRest.description} "</p>
                </div>
                <p id="cusSelectedItemDI">
                  About Item <FontAwesomeIcon icon={faFileWaveform} />
                </p>
              </div>
              <div id="commentsNavContainerCus">
                <img
                  id="commentsBGImage"
                  src="http://localhost:8081/public/images/commentsBG.jpg"
                  alt="Comment Section Image"
                  onClick={() => handleOpenImgRM(DataOfRest._id)}
                />
              </div>
              <p id="commentsCusP">Press Above Image To Open Comments</p>
              <div id="SLCusPage"></div>
              <button id="closePurPageCus" onClick={closeItemDisplay}>
                Go Back
              </button>
            </div>
          </div>
        </>
      )}
      <div
        id="navElements"
        style={{
          position: "relative",
          bottom: !DataOfRest ? "" : "290px",
        }}
      >
        <input
          type="text"
          id="searchRestItem"
          placeholder="Search using item name"
          value={itemSearch}
          onChange={(e) => setItemSearch(e.target.value)}
        />
        <button id="searchEnteredItem" onClick={handleSearchItem}>
          Search
        </button>
      </div>
      {placeOrderModal && DataOfRest && (
        <>
          <div id="modalBackground">
            <div id="PMBG">
              {DataOfRest.subitemImages &&
              DataOfRest.subitemImages.length > 0 ? (
                <>
                  <img
                    id="POitemImage"
                    src={`http://localhost:8081/restaurentItemImg/${DataOfRest.subitemImages[0]}`}
                    alt="SubItem Image"
                  />
                </>
              ) : (
                <p>No image has been added for this item.</p>
              )}
              <input
                type="text"
                id="customernameInput"
                placeholder="Enter your name"
                value={defCusName}
                onChange={(e) => setDefCusName(e.target.value)}
              />
              <input
                type="number"
                id="itemQuantityInput"
                placeholder="Enter item quantity"
                value={itemCount}
                onChange={(e) => setItemCount(e.target.value)}
              />
              <textarea
                id="customerAddressInput"
                placeholder="Enter delivery address"
                value={addressInfo}
                onChange={(e) => setAddressInfo(e.target.value)}
              ></textarea>
              <button id="confirmOrder" onClick={handlePlaceNewOrder}>
                Confirm
              </button>
              <button id="cancelOrder" onClick={clearOrderInfo}>
                Cancel
              </button>
            </div>
            <div id="custNumContainer">
              <h4 id="custNumHead">Enter your contact number</h4>
              <input
                type="number"
                id="customerNumberInput"
                value={customerNumber}
                onChange={(e) => setCustomerNumber(e.target.value)}
              />
              <p id="custNumContainerL">Press Confirm To Continue</p>
            </div>
          </div>
        </>
      )}
      {successfullOrderModal && (
        <>
          <div id="modalBackground">
            <div id="successModalBackground">
              <div id="SMUC">
                <img
                  id="successOrderPlacedImage"
                  src="http://localhost:8081/public/images/successorderPlaced.png"
                  alt="Order Successfull"
                />
                <div id="successOrderDetailsContainer">
                  <p id="orderStatus">Order Status : Successfull </p>
                  <p id="orderId">Order ID : {initialOD._id}</p>
                  <p id="orderitemName">Item Ordered: {initialOD.itemname}</p>
                </div>
              </div>
              <div id="SMLC">
                <p id="SMLCHeading">
                  Dear {initialOD.customername}, your order has been placed
                  succesfully. Thanks for shopping with us. You can check the
                  date of delivery for this item in your orders.
                </p>
              </div>
              <button id="seeMyOrders" onClick={handleSeeMyOrders}>
                See Orders
              </button>
              <button
                id="continueResItems"
                onClick={handleCloseSuccessModalByContinue}
              >
                Continue
              </button>
            </div>
          </div>
        </>
      )}
      {customerOrdersModal && (
        <>
          <div id="modalBackground">
            <div id="COMB">
              <div
                id="CPOMB"
                style={{
                  display: isCustomerPendingOrders ? "block" : "none",
                }}
              >
                {customerPendingOrders.length > 0 ? (
                  customerPendingOrders.map((order) => (
                    <div key={order._id}>
                      <div id="penOrderBackground">
                        {order.itemimages && order.itemimages.length > 0 ? (
                          <img
                            id="POcusImg"
                            src={`http://localhost:8081/restaurentItemImg/${order.itemimages[0]}`}
                            alt="Item Image"
                          />
                        ) : (
                          <p>No Image Found!</p>
                        )}
                        <div id="pendOrderDataContainer">
                          <p id="POorderIdCus">Order ID : {order._id}</p>
                          <p id="POcusnameCus">
                            Your Name : {order.customername}
                          </p>
                          <p id="POitemnameCus">Item Name : {order.itemname}</p>
                          <p id="POitemquantityCus">
                            Item Quantity : {order.itemquantity} items
                          </p>
                          <p id="POitempriceCus">
                            Item Price : {order.itemprice} ruppes/item
                          </p>
                          <p id="POordertotalcost">
                            Total Cost : {order.itemquantity * order.itemprice}{" "}
                            ruppes only
                          </p>
                          <button
                            id="POcusDA"
                            onClick={() => handleDisplayCustomerAddress(order)}
                          >
                            View/Update Address
                          </button>
                          <button
                            id="POcusCancelBtn"
                            onClick={() => handleCancelCusOrder(order)}
                          >
                            Cancel Order
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p id="noCusPendOrderHead">
                    You didn't placed any order yet.
                  </p>
                )}
              </div>
              <div
                id="CCOMB"
                style={{
                  display: isCustomerPendingOrders ? "none" : "block",
                }}
              >
                {completedOrders.length > 0 ? (
                  completedOrders.map((order) => (
                    <div key={order._id}>
                      <div id="compCusOrderbackground">
                        {order.itemimages && order.itemimages.length > 0 ? (
                          <img
                            id="COcusImage"
                            src={`http://localhost:8081/restaurentItemImg/${order.itemimages[0]}`}
                            alt="Item Image"
                          />
                        ) : (
                          <p>No image found</p>
                        )}
                        <div id="COcustContainer">
                          <p id="POorderIdCus">Order ID : {order._id}</p>
                          <p id="POcusnameCus">
                            Your Name : {order.customername}
                          </p>
                          <p id="POitemnameCus">Item Name : {order.itemname}</p>
                          <p id="POitemquantityCus">
                            Item Quantity : {order.itemquantity} items
                          </p>
                          <p id="POitempriceCus">
                            Item Price : {order.itemprice} ruppes/item
                          </p>
                          <p id="POordertotalcost">
                            Total Cost : {order.itemquantity * order.itemprice}{" "}
                            ruppes only
                          </p>
                          <button
                            id="navToReviews"
                            onClick={() => handleFetchOrderData(order)}
                          >
                            Show Reviews
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p id="noCompOrderCus">You did not received any order yet.</p>
                )}
              </div>
              <button
                id="showCompletedOrdersCustomer"
                style={{
                  display: isCustomerPendingOrders ? "block" : "none",
                }}
                onClick={() => setIsCustomerPendingOrders(false)}
                disabled={completedOrders.length === 0}
              >
                Completed Orders
              </button>
              <button
                id="showPendingOrdersCustomer"
                style={{
                  display: isCustomerPendingOrders ? "none" : "block",
                }}
                onClick={() => setIsCustomerPendingOrders(true)}
              >
                Pending Orders
              </button>
              <button
                id="clsCOmodal"
                onClick={() => setCustomerOrdersModal(false)}
              >
                Close Orders
              </button>
            </div>
          </div>
        </>
      )}
      {viewCusAddressModal && selectedOrder && (
        <>
          <div id="modalBackground">
            <div id="customerAddressBackground">
              <p id="cusCAhead">Your Current Address</p>
              <div id="currentAddressContainer">
                <p id="currentAddress">{selectedOrder.deliveryaddress}</p>
                <p id="DDofCusOrder">
                  Expected to deliver on{" "}
                  {new Date(selectedOrder.delieverydate).toLocaleDateString()}
                </p>
              </div>
              <div id="CusDACL"></div>
              <textarea
                id="newAddressInput"
                placeholder="Enter New Address"
                value={newAddress}
                onChange={(e) => setNewAddress(e.target.value)}
              ></textarea>
              <button
                id="updateAddressBtn"
                disabled={!newAddress}
                onClick={handleChangeCustomerAddress}
              >
                Update Address
              </button>
              <button
                id="closeCusAddressModal"
                onClick={handleCloseAddressChange}
              >
                Close
              </button>
            </div>
          </div>
        </>
      )}
      {selectedOrderData && orderReviewModal && (
        <>
          <div id="modalBackground">
            <div
              id="selectedOrderModal"
              style={{
                height: isMyReviewOpen ? "397px" : "",
              }}
            >
              <div id="orderDataContainer"></div>
              {selectedOrderData.itemimages &&
              selectedOrderData.itemimages.length > 0 ? (
                <img
                  id="SOfetchedImage"
                  src={`http://localhost:8081/restaurentItemImg/${selectedOrderData.itemimages[0]}`}
                  alt="Item Image"
                />
              ) : (
                <p id="noSelectedOrderImg">No image found</p>
              )}
              <div id="orderDetailsContainer">
                <p id="selectedOrderItemName">
                  Item Name : {selectedOrderData.itemname}
                </p>
                <p id="selectedOrderResName">
                  From : {selectedOrderData.restaurentname}
                </p>
                <p id="selectedOrderHead">
                  You had purchased this item recently, post some reviews about
                  it so other users can get an idea and it help them to make
                  best purchases, Thank You
                </p>
                <div id="SOCL"></div>
                <textarea
                  id="SOcusRI"
                  placeholder="Enter product review"
                  value={customerReview}
                  onChange={(e) => setCustomerReview(e.target.value)}
                ></textarea>
                <button
                  id="addReviewBtn"
                  onClick={() => handleSaveMyReview(selectedOrderData)}
                  style={{
                    display: isUserhaveReview ? "block" : "none",
                  }}
                >
                  Add Review
                </button>
                <button
                  id="showOURcontainer"
                  style={{
                    display: isUserhaveReview ? "none" : "block",
                  }}
                  onClick={handleHideMyReview}
                >
                  Go Back
                </button>
                <button
                  id="showMRcontainer"
                  onClick={() => handleShowMyReview()}
                >
                  My Review
                </button>
                <button id="clsCORcontainerBtn" onClick={handleCloseSOM}>
                  Close
                </button>
              </div>
              <div id="SLSOR"></div>
              <div
                id="otherUsersContainer"
                style={{
                  display: !isMyReviewOpen ? "block" : "none",
                }}
              >
                <p id="otherUsersHead">Other Persons About This Product</p>
                <div id="OURC">
                  {OURdata.length > 0 ? (
                    OURdata.map((review) => (
                      <div key={review._id}>
                        <div id="reviewDataBackground">
                          <div id="PFPDefUser">
                            <img
                              id="defuserimg"
                              src="http://localhost:8081/public/images/defaultUser.png"
                              alt="User PFP"
                            />
                          </div>
                          <p id="reviewUserFullName">{review.customerName}</p>
                          <div id="reviewTextContainer">
                            <p id="reviewTextData">" {review.reviewText} "</p>
                          </div>
                          <span
                            id="likeBtn"
                            onClick={() => handleLikeReview(review._id)}
                          >
                            <FontAwesomeIcon icon={faGratipay} />
                          </span>
                          <p id="likesCounterL">
                            {review.likes === 0 ? "0" : review.likes} person
                            {review.likes !== 1 ? "s" : ""} likes this review
                            <span id="thumbsUpIcon">
                              <FontAwesomeIcon icon={faThumbsUp} />
                            </span>{" "}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p id="noOURfound">
                      No review found for this item by other users.
                    </p>
                  )}
                </div>
              </div>
              <div
                id="MORcontainer"
                style={{
                  display: isMyReviewOpen ? "block" : "none",
                }}
              >
                <p id="MORcontHeading">Your review about this product.</p>
                <div id="MORC">
                  {MRD.length > 0 ? (
                    MRD.map((myReview) => (
                      <div key={myReview._id}>
                        <div id="MRBC">
                          <div id="PFPDefUser">
                            <img
                              id="defuserimg"
                              src="http://localhost:8081/public/images/myPFPreview.png"
                              alt="User PFP"
                            />
                          </div>
                          <p id="reviewUserFullName">{myReview.customerName}</p>
                          <div id="reviewTxtContainer">
                            <p id="reviewTD">" {myReview.reviewText} "</p>
                          </div>
                          <button
                            id="editReviewBtn"
                            onClick={() => handleEditReviewModal(myReview)}
                          >
                            Edit
                          </button>
                          <button
                            id="deleteReviewBtn"
                            onClick={() =>
                              handleDeleteMyReview(myReview.orderItemId)
                            }
                          >
                            Del
                          </button>
                          <p id="likescountFMR">
                            Your review got liked by{" "}
                            {myReview.likes === 0 ? "0" : myReview.likes} person
                            {myReview.likes !== 1 ? "s" : ""}
                            <span id="thumbsUpIcon">
                              <FontAwesomeIcon icon={faThumbsUp} />
                            </span>{" "}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p id="noMRDfound">
                      You haven't posted any review about this item yet.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
      {editMyReviewModal && (
        <>
          <div id="modalBackground">
            <div id="editMyReviewModal">
              <p id="oldRHeading">Your Old Review </p>
              <div id="oldReviewContainer">
                <p id="oldReviewText">" {erIID.reviewText} "</p>
              </div>
              <div id="SLECR"></div>
              <textarea
                id="editReviewTextContainer"
                placeholder="Enter new review"
                value={reviewNewText}
                onChange={(e) => setReviewNewText(e.target.value)}
              ></textarea>
              <button id="updateReviewBtn" onClick={handleUpdateReview}>
                Update Review
              </button>
              <button id="cancelReviewBtn" onClick={handleCloseEditReviewModal}>
                Cancel Review
              </button>
            </div>
          </div>
        </>
      )}
      {imgRM && (
        <>
          <div id="modalBackground">
            <div id="imgRMBackground">
              <p id="imgRMHead">Note</p>
              <div id="imgRMnoteContainer">
                <p id="imgRMnote">
                  If you want to add any review then you have to purchase first{" "}
                  <button id="imgNoteButton" onClick={handlePlaceMyOrder}>
                    Continue
                  </button>
                </p>
              </div>
              <div id="imgCSL"></div>
              <p id="imgContainerSecondHead">
                Other Person Reviews Regarding This Item
              </p>
              <div id="imgRMOPRC">
                {OURdata.length > 0 ? (
                  OURdata.map((review) => (
                    <div key={review._id}>
                      <div id="imgRDB">
                        <div id="PFPDefUser">
                          <img
                            id="defuserimg"
                            src="http://localhost:8081/public/images/defaultUser.png"
                            alt="User PFP"
                          />
                        </div>
                        <p id="imgRDBusername">{review.customerName}</p>
                        <div id="imgRDBreviewContainer">
                          <p id="imgRDBreview">" {review.reviewText} "</p>
                        </div>
                        <p id="imgRDBlikes">
                          {review.likes === 0 ? "0" : review.likes} person
                          {review.likes !== 1 ? "s" : ""} likes this review
                          <span id="thumbsUpIcon">
                            <FontAwesomeIcon icon={faThumbsUp} />
                          </span>{" "}
                        </p>
                        <span
                          id="likeBtnOUR"
                          onClick={() => handleLikeReview(review._id)}
                        >
                          <FontAwesomeIcon icon={faGratipay} />
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p id="noReviewsFoundIMGRM">
                    No reviews found for this item by other users.
                  </p>
                )}
              </div>
              <p id="imgRMEOP">
                Explore More Items (It May Include Other Restaurent Items)
              </p>
              <div id="imgRMnewReviewContainer">
                {newReview.length > 0 ? (
                  newReview.map((review) => (
                    <div key={review._id} id="newReviewBackground">
                      <div id="PFPDefUser">
                        <img
                          id="defuserimg"
                          src="http://localhost:8081/public/images/defaultUser.png"
                          alt="User PFP"
                        />
                      </div>
                      <p id="newReviewCustomerName">{review.customerName}</p>
                      <div id="newReviewTextContainer">
                        <p id="newReviewText">" {review.reviewText} "</p>
                      </div>
                      <button
                        id="exploreItemButton"
                        onClick={handleExploreSelectedItem}
                      >
                        Explore Item
                      </button>
                    </div>
                  ))
                ) : (
                  <p id="noNewReviewFoundIMGRM">No new item found for you</p>
                )}
              </div>
              <button id="closeIMGRM" onClick={handleCloseIMGRM}>
                Close
              </button>
            </div>
          </div>
        </>
      )}
      {isItemAddedToCart && (
        <>
          <div id="modalBackground">
            <div id="itemAddedToCartBackground">
              {DataOfRest.subitemImages &&
              DataOfRest.subitemImages.length > 0 ? (
                <>
                  <img
                    id="ATCitemImage"
                    src={`http://localhost:8081/restaurentItemImg/${DataOfRest.subitemImages[0]}`}
                    alt="SubItem Image"
                  />
                </>
              ) : (
                <p id="noItemImageFoundATC">No image found</p>
              )}
              <div id="ATCitemDetailsContainer">
                <p id="ATCContainerHead">What You Want To Do ?</p>
                <button id="ATCitemAddToCart" onClick={handleAddToCart}>
                  Add To Cart
                </button>
                <button id="ATCitemBuyNow" onClick={handleBuyNowItem}>
                  Buy Now
                </button>
                <div id="ATCCL"></div>
                <button
                  id="ATCitemClose"
                  onClick={() => setIsItemAddedToCart(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </>
      )}
      {itemAddedSuccessfully && (
        <>
          <div id="modalBackground">
            <div id="itemAddedSuccessfullyBackground">
              <div id="itemAddedSuccessfullyContainer">
                <p id="itemAddedSuccessfullyText">
                  Dear {addedCartData.customerName}, your item has been added to
                  cart successfully. Now you can proceed to check it out in cart
                  or else you can continue shopping.
                </p>
              </div>
              <button id="goToCartBtn" onClick={handlePressGTC}>
                Go To Cart
              </button>
              <button id="continueShoppingBtn" onClick={handleCloseATCModal}>
                Continue Shopping
              </button>
            </div>
          </div>
        </>
      )}
      {showCartModal && (
        <>
          <div id="modalBackground">
            <div id="cartModalBackground">
              <p id="cartModalHead">Items In Your Cart</p>
              <div id="cartModalItemsContainer">
                {cartItems.length > 0 ? (
                  cartItems.map((item) => (
                    <div key={item._id}>
                      <div id="cartItemBackground">
                        <img
                          id="cartItemImage"
                          src={`http://localhost:8081/restaurentItemImg/${item.itemImages[0]}`}
                          alt="Item Image"
                        />
                        <div id="cartItemDetailsContainer">
                          <p id="cartItemName">Item Name : {item.itemName}</p>
                          <p id="cartItemPrice">
                            Item Price : {item.itemPrice} ruppes
                          </p>
                          <p id="abtItemHead">About Item</p>
                          <div id="abtItemContainer">
                            <p id="abtItemText">" {item.itemDescription} "</p>
                          </div>
                          <button
                            id="placeOrderButton"
                            onClick={() => handleConfirmOrderModal(item)}
                          >
                            Place Order
                          </button>
                          <p id="cartInsideHead">Scroll to place order</p>
                        </div>
                        <button
                          id="removeItemFromCart"
                          onClick={() => handleRemoveItemFromCart(item.itemId)}
                        >
                          Remove Item
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p id="noItemsInCart">Sorry, It seems your cart is empty</p>
                )}
              </div>
              <button id="closeCartModal" onClick={handleCloseCartModal}>
                Close
              </button>
            </div>
          </div>
        </>
      )}
      {confirmOrderModal && (
        <>
          <div id="modalBackground">
            <div id="confirmOrderModalBackground">
              {confirmOrderItemData.itemImages &&
              confirmOrderItemData.itemImages.length > 0 ? (
                <>
                  <img
                    id="confirmOrderItemImage"
                    src={`http://localhost:8081/restaurentItemImg/${confirmOrderItemData.itemImages[0]}`}
                    alt="Item Image"
                  />
                </>
              ) : (
                <p id="noItemImageFoundCO">No image found</p>
              )}
              <input
                type="text"
                placeholder="Enter your name"
                value={confirmOrderCustomerName}
                onChange={(e) => setConfirmOrderCustomerName(e.target.value)}
                id="confirmOrderCustomerName"
              />
              <input
                type="number"
                placeholder="Enter your number"
                value={confirmOrderCustomerNumber}
                onChange={(e) => setConfirmOrderCustomerNumber(e.target.value)}
                id="confirmOrderCustomerNumber"
              />
              <input
                type="number"
                placeholder="Enter quantity"
                value={confirmOrderItemQuantity}
                onChange={(e) => setConfirmOrderItemQuantity(e.target.value)}
                id="confirmOrderItemQuantity"
              />
              <textarea
                placeholder="Enter your address"
                value={confirmOrderCustomerAddress}
                onChange={(e) => setConfirmOrderCustomerAddress(e.target.value)}
                id="confirmOrderCustomerAddress"
              ></textarea>
              <button id="confirmOrderBtn" onClick={handleConfirmCartOrder}>
                Confirm Order
              </button>
              <button
                id="closeConfirmOrderModal"
                onClick={handleCloseConfirmOrderModal}
              >
                Close
              </button>
            </div>
          </div>
        </>
      )}
      {displayImageContainer && (
        <>
          <div id="modalBackground">
            <div id="displayImageContainerBackground">
              <img
                id="displayImageContainerImage"
                src={`http://localhost:8081/restaurentItemImg/${selectedImage}`}
                alt="Item Image"
              />
              <button
                id="closeDisplayImageContainer"
                onClick={handleCloseDisplayImageContainer}
              >
                Close
              </button>
            </div>
          </div>
        </>
      )}
      {notificationModal && (
        <>
          <div id="modalBackground">
            <div id="notificationModalBackground">
              <p id="notificationModalHead">Notification Box</p>
              <div id="notificationContainer">
                {customerNotifications.length > 0 ? (
                  customerNotifications.map((notification) => (
                    <div key={notification._id} id="cusNotificationBG">
                      <p id="cusNotificationText">{notification.message}</p>
                      <button
                        id="deleteNotificationBtn"
                        onClick={() =>
                          handleDeleteCustomerNotification(notification._id)
                        }
                      >
                        Delete Notification
                      </button>
                      {notification.type === "placed_order" && (
                        <button
                          id="cusNotificationViewOrder"
                          onClick={handleShowPlacedOrder}
                        >
                          View Order
                        </button>
                      )}
                      {notification.type === "completed_order" && (
                        <>
                          <button
                            id="cusCompletedOrderBtn"
                            onClick={handleShowAcceptedOrder}
                          >
                            View Order
                          </button>
                          <p id="cusNotificationHeadSO">Recent Notification</p>
                        </>
                      )}
                      {notification.type === "updated_order_address" && (
                        <>
                          <p id="cusUpdatedOrderAddress">
                            Order will be deliver to you soon.
                          </p>
                          <p id="cusNotificationHeadST">Recent Notification</p>
                        </>
                      )}
                      {notification.type === "added_to_cart" && (
                        <button
                          id="viewCusCartBtn"
                          onClick={handleShowItemInCart}
                        >
                          View Cart
                        </button>
                      )}
                      {notification.type === "cart_order_confirmed" && (
                        <button
                          id="cusCartOrderConfirmedBtn"
                          onClick={handleShowPlacedOrder}
                        >
                          View Order
                        </button>
                      )}
                      {notification.type === "profile_updated" && (
                        <button
                          id="cusProfileUpdatedBtn"
                          onClick={handleShowNewProfile}
                        >
                          View Profile
                        </button>
                      )}
                      {notification.type !== "completed_order" &&
                        notification.type !== "updated_order_address" && (
                          <p id="cusNotificationHead">Recent Notification</p>
                        )}
                    </div>
                  ))
                ) : (
                  <p id="noCusNotification">
                    No activity occured for your account!
                  </p>
                )}
              </div>
              <button
                id="closeNotificationModal"
                onClick={handleCloseNotificationModal}
              >
                Close Notifications
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default PurchaseResItems;
