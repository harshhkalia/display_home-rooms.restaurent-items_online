import react, { useEffect, useState } from "react";
import ResOwnNav from "../navbarsAndFooters/RestaurentOwnerNav";
import "./HomeRestaurentOwner.css";
import ResOwnSettingsSB from "../resOwnPageEl/ResOwnSettingsSB";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const RestaurentOwnerHomePage = () => {
  const [noSettingsSelected, setNoSettingsSelected] = useState(true);
  const [showAddItems, setShowAddItems] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [restaurentData, setRestaurentData] = useState(null);
  const [user, setUser] = useState(null);
  const [fetchedCategories, setFetchedCategories] = useState([]);
  const [data, setData] = useState({
    category: "",
    itemName: "",
    itemPrice: "",
    itemQuantity: "",
    itemDescription: "",
    confirmResAccountPassword: "",
    newResName: "",
    newResLocation: "",
  });
  const [categorySaveMsg, setCategorySaveMsg] = useState(false);
  const [categoryDeleteMsg, setCategoryDeleteMsg] = useState(false);
  const [deleteDocumentId, setDeleteDocumentId] = useState(null);
  const [newItemModal, setAddNewItemModal] = useState(false);
  const [editItemModal, setEditItemModal] = useState(false);
  const [editItemContainer, setEditItemContainer] = useState(false);
  const [deleteItemModal, setDeleteItemModal] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const [fetchedItems, setFetchedItems] = useState([]);
  const [insertionCategoryId, setInsertionCategoryId] = useState(null);
  const [newResImage, setNewResImage] = useState([]);
  const [selectedItemImgContainer, setSelectedItemImgContainer] =
    useState(false);
  const [selectedSubItem, setSelectedSubItem] = useState(null);
  const [changedImage, setChangedImage] = useState([]);
  const [isConfirmButtonDisabled, setIsConfirmButtonDisabled] = useState(true);
  const [noPassMatch, setNoPassMatch] = useState(false);
  const [yeaPassMatch, setYeaPassMatch] = useState(false);
  const [noPasswordInput, setNoPasswordInput] = useState(true);
  const [showContainerNote, setShowContainerNote] = useState(false);
  const [newNameRes, setNewNameRes] = useState("");
  const [newResLocation, setNewResLocation] = useState("");
  const [manageResItemOrders, setManageResItemOrders] = useState(false);
  const [showPendingOrders, setShowPendingOrders] = useState(true);
  const [pendingOrderData, setPendingOrderData] = useState([]);
  const [POMDmodal, setPOMDmodal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderConfirmationLine, setOrderConfirmationLine] = useState(false);
  const [confirmResOrders, setConfirmResOrders] = useState([]);
  const [isOrderAvailable, setIsOrderAvailable] = useState(false);
  const [showSelectedItemReviews, setShowSelectedItemReviews] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [selectedItemReviews, setSelectedItemReviews] = useState([]);
  const [selectedItemName, setSelectedItemName] = useState("");
  const [showResNotifications, setShowResNotifications] = useState(false);
  const [restNotifications, setRestNotifications] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchResInfo = () => {
      const restaurent = JSON.parse(localStorage.getItem("restaurent"));
      if (restaurent) {
        setRestaurentData(restaurent);
        // console.log(restaurent);
      }
    };
    fetchResInfo();
  }, []);

  useEffect(() => {
    const fetchcategories = async () => {
      if (restaurentData && restaurentData._id) {
        try {
          const response = await axios.get(
            `${process.env.REACT_APP_API_URL}fetchrescategories/${restaurentData._id}`
          );
          const categories = Array.isArray(response.data.categories)
            ? response.data.categories
            : [response.data.categories];

          setFetchedCategories(categories);
          setDeleteDocumentId(response.data.documentId);
        } catch (error) {
          console.error(
            "Failed to fetch categories related to this restaurent due to : ",
            error
          );
        }
      }
    };
    fetchcategories();
  }, [restaurentData]);

  useEffect(() => {
    const fetchUserData = () => {
      const userInfo = JSON.parse(localStorage.getItem("user"));
      if (userInfo) {
        setUser(userInfo);
      }
    };
    fetchUserData();
  }, []);

  const handleShowAddItemElements = () => {
    setNoSettingsSelected(false);
    setShowEditProfile(false);
    setShowAddItems(true);
    setManageResItemOrders(false);
    setShowResNotifications(false);
  };

  const handleShowEditProfileElements = () => {
    setNoSettingsSelected(false);
    setShowEditProfile(true);
    setShowAddItems(false);
    setManageResItemOrders(false);
    setShowResNotifications(false);
  };

  const handleShowResItemOrders = () => {
    setNoSettingsSelected(false);
    setShowEditProfile(false);
    setShowAddItems(false);
    setManageResItemOrders(true);
    setShowResNotifications(false);
  };

  const handleShowRestNotifications = () => {
    setNoSettingsSelected(false);
    setShowEditProfile(false);
    setShowAddItems(false);
    setManageResItemOrders(false);
    setShowResNotifications(true);
  };

  const handleSelectorChange = (event) => {
    const selectedCategory = event.target.value;
    setData((prevData) => ({ ...prevData, category: selectedCategory }));
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleFileInput = (event) => {
    const files = Array.from(event.target.files);
    if (files.length > 5) {
      window.alert("You can only upload 5 images of an item.");
      return;
    }
    setSelectedImages(files);
  };

  const handleInsertOneCategory = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}newitemcategory/${restaurentData?._id}`,
        {
          category: data.category,
        }
      );
      if (response.status === 201) {
        setCategorySaveMsg(true);
        setTimeout(() => {
          setCategorySaveMsg(false);
        }, 3000);
        setData({ category: "" });
        setFetchedCategories((prevData) => [
          ...prevData,
          response.data.resCategory.items[0],
        ]);
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        window.alert(error.response.data.message);
      } else {
        console.error("Failed to insert new item category to : ", error);
        window.alert("Failed to insert new item category, please try again!!");
      }
    }
  };

  const handleDeleteCategory = async (itemId) => {
    const confirmation = window.confirm(
      "Do you really want to remove this category, all your items will be removed ?"
    );
    if (confirmation) {
      try {
        const response = await axios.delete(
          `${process.env.REACT_APP_API_URL}removeitemcategory/${itemId}`,
          {
            documentId: deleteDocumentId,
          }
        );
        if (response.status === 200) {
          setFetchedCategories(fetchedCategories.length === 0);
          setCategoryDeleteMsg(true);
          setTimeout(() => {
            setCategoryDeleteMsg(false);
          }, 3000);
          setDeleteDocumentId(null);
        }
      } catch (error) {
        if (
          error.response &&
          error.response.data &&
          error.response.data.message
        ) {
          window.alert(error.response.data.message);
        } else {
          console.error(
            "Failed to delete the category of item due to : ",
            error
          );
          window.alert(
            "Failed to delete the category of item, please try again!!"
          );
        }
      }
    }
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString();
  };

  const showInsertionElements = (categoryId) => {
    setAddNewItemModal(true);
    setInsertionCategoryId(categoryId);
  };

  const closeInsertionElements = () => {
    setAddNewItemModal(false);
    setInsertionCategoryId(null);
  };

  const handleInsertNewItemToCategory = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("itemName", data.itemName);
    formData.append("itemPrice", data.itemPrice);
    formData.append("itemQuantity", data.itemQuantity);
    formData.append("itemDescription", data.itemDescription);
    formData.append("restaurentId", restaurentData?._id);

    selectedImages.forEach((file) => {
      formData.append("itemImages", file);
    });

    if (insertionCategoryId) {
      try {
        const response = await axios.put(
          `${process.env.REACT_APP_API_URL}insertitemtocategory/${insertionCategoryId}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        if (response.status === 201) {
          window.alert(response.data.message);
          setAddNewItemModal(false);
          setInsertionCategoryId(null);
          setData({
            itemName: "",
            itemPrice: "",
            itemQuantity: "",
            itemDescription: "",
          });
          setSelectedImages([]);

          const updatedItemResponse = await axios.get(
            `${process.env.REACT_APP_API_URL}fetchallitems/${restaurentData?._id}`
          );
          if (updatedItemResponse.status === 200) {
            setFetchedItems(updatedItemResponse.data.items);
          }
        }
      } catch (error) {
        if (
          error.response &&
          error.response.data &&
          error.response.data.message
        ) {
          window.alert(error.response.data.message);
        } else {
          console.error(
            "Failed to insert new item to category due to : ",
            error
          );
          window.alert(
            "Failed to insert new item to category, please try again!!"
          );
        }
      }
    }
  };

  const handleSetEditModalTrue = () => {
    setEditItemModal(true);
  };

  const handleCloseEditModal = () => {
    setEditItemModal(false);
  };

  useEffect(() => {
    const fetchAllResItems = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}fetchallitems/${restaurentData?._id}`
        );
        if (response.status === 200) {
          setFetchedItems(response.data.items);
          console.log("Items Fetched successfully!", [response.data.items]);
        }
      } catch (error) {
        console.error(
          "Failed to fetch all items related to your restaurent due to : ",
          error
        );
      }
    };
    if (restaurentData?._id) {
      fetchAllResItems();
    }
  }, [restaurentData?._id]);

  const handleSetEditItemContainerTrue = (subItem) => {
    const warning = window.confirm(
      "We will proceed you to editing modal but we will advice you not to edit anything as this feature is not working correctly and if you edit something then it will adversely affect your product and sales. Press confirm if you want to proceed further! "
    );
    if (warning) {
      setSelectedSubItem(subItem);
      setEditItemContainer(true);
      setEditItemModal(false);
    } else {
      window.alert(
        "Good choice, If you want to edit this item then you can delete this item and add it again with new details!"
      );
    }
  };

  const handleSetEditItemContainerFalse = () => {
    setEditItemContainer(false);
    setEditItemModal(true);
    setSelectedItemImgContainer(false);
  };

  const handleResItemImageChange = (e, index) => {
    const file = e.target.files[0];
    if (file) {
      const updatedImages = [...selectedSubItem.subitemImages];
      updatedImages[index] = URL.createObjectURL(file);
      setChangedImage((prevChangedImage) => {
        const updatedChangedImage = [...prevChangedImage];
        updatedChangedImage[index] = file;
        return updatedChangedImage;
      });
    }
  };

  const handleUpdateResItem = async (itemid) => {
    const formData = new FormData();
    formData.append("selectedItemName", selectedSubItem.name);
    formData.append("selectedItemPrice", selectedSubItem.price);
    formData.append("selectedItemQuantity", selectedSubItem.quantity);
    formData.append("selectedItemDescription", selectedSubItem.description);
    changedImage.forEach((image) => formData.append("changedImages", image));

    try {
      const updatedResponse = await axios.put(
        `${process.env.REACT_APP_API_URL}changeResItemDetails/${itemid}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      console.log("Full Response Data:", updatedResponse.data);

      const fetchItemsFromResponse = await axios.get(
        `${process.env.REACT_APP_API_URL}fetchallitems/${restaurentData?._id}`
      );
      if (fetchItemsFromResponse.status === 200) {
        const newItems = fetchItemsFromResponse.data.items;
        setFetchedItems(newItems);
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        window.alert(error.response.data.message);
      } else {
        console.error(
          "Failed to update the item with inserted details due to:",
          error
        );
        window.alert(
          "Failed to update the item with inserted details, please try again!!"
        );
      }
    }
  };

  const handleShowItemDelModal = () => {
    setDeleteItemModal(true);
  };

  const handleHideItemDelModal = () => {
    setDeleteItemModal(false);
  };

  const handleDeleteResItemFun = async (itemId) => {
    try {
      const functionResponse = await axios.delete(
        `${process.env.REACT_APP_API_URL}deleteselecteditem/${itemId}`
      );
      if (functionResponse.status === 200) {
        window.alert(functionResponse.data.message);
        setFetchedItems((prevItems) =>
          prevItems.map((item) => ({
            ...item,
            subItems: item.subItems.filter((subItem) => subItem._id !== itemId),
          }))
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
        console.error("Failed to delete the selected item due to:", error);
        window.alert("Failed to delete the selected item, please try again!");
      }
    }
  };

  const handleCalculateTotalSubitems = () => {
    return fetchedItems.reduce((total, item) => {
      return total + (item.subItems ? item.subItems.length : 0);
    }, 0);
  };

  const handleCheckCorrectPassword = async (e) => {
    const enteredPassword = e.target.value;
    setData({ confirmResAccountPassword: enteredPassword });

    if (enteredPassword.length > 0) {
      try {
        const response = await axios.post(
          `${process.env.REACT_APP_API_URL}checkuserpassword/${user?._id}`,
          {
            enteredPassword: enteredPassword,
          }
        );
        if (response.status === 200 && response.data.isValid) {
          setIsConfirmButtonDisabled(false);
          setNoPassMatch(false);
          setYeaPassMatch(true);
          setNoPasswordInput(false);
          setShowContainerNote(true);
        } else {
          setIsConfirmButtonDisabled(true);
          setNoPassMatch(true);
          setYeaPassMatch(false);
          setShowContainerNote(true);
          setNoPasswordInput(false);
        }
      } catch (error) {
        console.error("Failed to check for correct password due to : ", error);
        setNoPassMatch(true);
        setIsConfirmButtonDisabled(true);
        setYeaPassMatch(false);
        setNoPasswordInput(false);
        setShowContainerNote(true);
      }
    } else {
      setIsConfirmButtonDisabled(true);
      setYeaPassMatch(false);
      setNoPassMatch(false);
      setShowContainerNote(false);
      setNoPasswordInput(true);
    }
  };

  const handleSetNewResImage = (e) => {
    const image = e.target.files[0];
    if (image) {
      setNewResImage(image);
    }
  };

  const handleChangeRestaurentData = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("restaurentNewName", newNameRes);
    formData.append("restaurentNewLocation", newResLocation);
    formData.append("restaurentOwnerId", user?._id);
    formData.append("restaurentnewImage", newResImage);

    try {
      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}updateResInfo/${restaurentData?._id}`,
        formData
      );
      if (response.status === 200) {
        window.alert(response.data.message);
        setShowContainerNote(false);
        setNoPasswordInput(true);
        setYeaPassMatch(false);

        const newResDetails = response.data.updatedInfo;
        localStorage.setItem("restaurent", JSON.stringify(newResDetails));

        setRestaurentData((prevData) => ({
          ...prevData,
          ...newResDetails,
        }));

        setData({
          newResLocation: "",
          confirmResAccountPassword: "",
        });
        setNewNameRes("");
        setNewResLocation("");
        setNewResImage([]);
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        window.alert(error.response.data.message);
      } else {
        console.error("Failed to change restaurent details due to:", error);
        window.alert(
          "Failed to change restaurent details with entered data, please try again!"
        );
      }
    }
  };

  useEffect(() => {
    const fetchAllPendingOrders = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}fetchallpendingorders?restaurentId=${restaurentData?._id}`
        );

        if (response.status === 200) {
          console.log(
            "Pending orders for restaurent items are ",
            response.data.orders
          );
          setPendingOrderData(response.data.orders);
        } else {
          console.warn("Unexpected response status:", response.status);
        }
      } catch (error) {
        console.error(
          "Failed to fetch all the remaining orders due to: ",
          error
        );
      }
    };

    if (restaurentData) {
      fetchAllPendingOrders();
    }
  }, [restaurentData?._id]);

  useEffect(() => {
    const fetchconfirmResOrders = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}fetchConfResOrders?restaurentId=${restaurentData?._id}`
        );
        if (response.status === 200) {
          console.log("Confirmed restaurent orders are ", response.data.orders);
          setConfirmResOrders(response.data.orders);
          setIsOrderAvailable(true);
        }
      } catch (error) {
        console.error(
          "Failed to fetch confirmed orders for restaurent due to : ",
          error
        );
      }
    };
    if (restaurentData && restaurentData._id) {
      fetchconfirmResOrders();
    }
  }, [restaurentData?._id]);

  const handleMDModalOpen = (order) => {
    setPOMDmodal(true);
    setSelectedOrder(order);
  };

  const handleCloseMDModal = () => {
    setPOMDmodal(false);
    setSelectedOrder(null);
  };

  const handleAcceptTheOrder = async (order) => {
    const confirmation = window.confirm(
      `You have earned ${
        order.itemprice * order.itemquantity
      } rupees from this order, Great job`
    );
    if (confirmation) {
      try {
        const response = await axios.put(
          `${process.env.REACT_APP_API_URL}confirmorder/${order._id}`
        );
        if (response.status === 200) {
          setOrderConfirmationLine(true);
          setTimeout(() => {
            setPendingOrderData((prevOrder) =>
              prevOrder.filter((o) => o._id !== order._id)
            );
            setConfirmResOrders((prevConfirmOrder) => [
              ...prevConfirmOrder,
              { ...order, orderStatus: "accepted", deliverydate: new Date() },
            ]);
            setOrderConfirmationLine(false);
          }, 2000);
        }
      } catch (error) {
        console.error("Failed to accept the selected order due to : ", error);
        window.alert("Failed to accept the selected order, please try again!");
      }
    } else {
      window.alert("Failed to confirm the item, try again");
    }
  };

  const handleShowDelieveryDetails = (confirmedOrder) => {
    window.alert(
      `This order has been delievered to " ${
        confirmedOrder.deliveryaddress
      } " on ${new Date(
        confirmedOrder.delieverydate
      ).toLocaleDateString()} successfully!`
    );
  };

  const handleShowSelectedItemReviews = (confirmedOrder) => {
    setShowSelectedItemReviews(true);
    setSelectedItemId(confirmedOrder.itemId);
    setSelectedItemName(confirmedOrder.itemname);
  };

  const handleCloseSelectedItemReviews = () => {
    setShowSelectedItemReviews(false);
    setSelectedItemId(null);
    setSelectedItemName("");
    setSelectedItemReviews([]);
  };

  const handleFetchItemReviews = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}fetchallitemreviews?itemId=${selectedItemId}`
      );
      if (response.status === 200) {
        console.log("The reviews of this item are ", response.data.allReviews);
        setSelectedItemReviews(response.data.allReviews);
      }
    } catch (error) {
      console.error("Failed to fetch reviews of this item due to : ", error);
    }
  };

  useEffect(() => {
    if (selectedItemId) {
      handleFetchItemReviews();
    }
  }, [selectedItemId]);

  const handleFetchRestNotifications = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}fetchrestaurentnotifications?restaurentOwnerId=${restaurentData.restaurentowner}&restName=${restaurentData.restaurentname}`
      );
      if (response.status === 200) {
        console.log(
          "The notifications of restaurent are ",
          response.data.notifications
        );
        setRestNotifications(response.data.notifications);
      }
    } catch (error) {
      console.error(
        "Failed to fetch restaurent notifications due to : ",
        error
      );
    }
  };

  useEffect(() => {
    if (restaurentData) {
      handleFetchRestNotifications();
    }
  }, [restaurentData]);

  const handleDeleteRestNotification = async (notificationId) => {
    try {
      const response = await axios.delete(
        `${process.env.REACT_APP_API_URL}deleterestnotification?notificationId=${notificationId}`
      );
      if (response.status === 200) {
        window.alert(response.data.message);
        setRestNotifications((prevNotifications) =>
          prevNotifications.filter(
            (notification) => notification._id !== notificationId
          )
        );
      }
    } catch (error) {
      console.error(
        "Failed to delete the selected notification due to : ",
        error
      );
      window.alert(
        "Failed to delete the selected notification, please try again!"
      );
    }
  };

  const handleDeleteRestCompletely = async () => {
    const confirmation = window.confirm(
      "Are you sure you want to delete your restaurent entirely? This action cannot be undone and will remove all your data associated with it!"
    );
    if (confirmation) {
      try {
        const response = await axios.delete(
          `${process.env.REACT_APP_API_URL}deleterestdata/${restaurentData?._id}`
        );
        if (response.status === 200) {
          window.alert(response.data.message);
          localStorage.removeItem("restaurent");
          navigate("/");
        }
      } catch (error) {
        console.error(
          "Failed to delete restaurent entire data due to : ",
          error
        );
        window.alert(
          "Failed to delete restaurent entire data, please try again!"
        );
      }
    }
  };

  return (
    <>
      <ResOwnNav />
      <div id="willShowSettings">
        <ResOwnSettingsSB
          onAddItemsPress={handleShowAddItemElements}
          onAddSettingsPress={handleShowEditProfileElements}
          onAddAllOrdersPress={handleShowResItemOrders}
          onAddNotificationsPress={handleShowRestNotifications}
          onDeleteRestCompletely={handleDeleteRestCompletely}
        />
        {noSettingsSelected && (
          <>
            <div id="textContainerNoSettings">
              <h4 id="noSettingsContainerText">
                Select the settings you want to view !!{" "}
              </h4>
            </div>
          </>
        )}
        {showAddItems && (
          <>
            <div id="addItemCategoryContainer">
              <form id="addResItemForm" onSubmit={handleInsertOneCategory}>
                <select
                  id="categorySelector"
                  value={data.category}
                  onChange={handleSelectorChange}
                  disabled={fetchedCategories.length > 0}
                  required
                >
                  <option value="" disabled selected>
                    Select the type of item that you want to sell on ROUSTUF
                  </option>
                  <option value="Soft Drinks">Soft Drinks</option>
                  <option value="Coffee">Coffee</option>
                  <option value="Tea">Tea</option>
                  <option value="Juices">Juices</option>
                  <option value="Water">Water</option>
                  <option value="Beer">Beer</option>
                  <option value="Wine">Wine</option>
                  <option value="Whisky">Whisky</option>
                  <option value="Milk Shakes">Milk Shakes</option>
                  <option value="Fruit Shakes">Fruit Shakes</option>
                  <option value="Fries">Fries</option>
                  <option value="Popcorn">Popcorn</option>
                  <option value="Chips">Chips</option>
                  <option value="Soups">Soups</option>
                  <option value="Salads">Salads</option>
                  <option value="Sandwiches">Sandwiches</option>
                  <option value="Pizzas">Pizzas</option>
                  <option value="Burgers">Burgers</option>
                  <option value="Pasta">Pasta</option>
                  <option value="Seafood">Seafood</option>
                  <option value="Vegetarian Dishes">Vegetarian Dishes</option>
                  <option value="Rice">Rice</option>
                  <option value="Potatoes">Potatoes</option>
                  <option value="Vegetables">Vegetables</option>
                  <option value="Beans">Beans</option>
                  <option value="Pretzels">Pretzels</option>
                  <option value="Finger Foods">Finger Foods</option>
                  <option value="Dips And Spreads">Dips And Spreads</option>
                  <option value="Breadsticks">Breadsticks</option>
                  <option value="Steaks">Steaks</option>
                  <option value="Vegan Dishes">Vegan Dishes</option>
                  <option value="Grilled Items">Grilled Items</option>
                  <option value="Coleslaw">Coleslaw</option>
                  <option value="Cakes">Cakes</option>
                  <option value="Ice Cream">Ice Cream</option>
                  <option value="Pies">Pies</option>
                  <option value="Pastries">Pastries</option>
                  <option value="Cookies">Cookies</option>
                  <option value="Puddings">Puddings</option>
                  <option value="Pancakes">Pancakes</option>
                  <option value="Waffles">Waffles</option>
                  <option value="Omelets">Omelets</option>
                  <option value="Breakfast Sandwiches">
                    Breakfast Sandwiches
                  </option>
                  <option value="Cereal">Cereal</option>
                  <option value="Muffins">Muffins</option>
                  <option value="Chicken Nuggets">Chicken Nuggets</option>
                  <option value="Mini Pizzas">Mini Pizzas</option>
                  <option value="Grilled Cheese Sandwiches">
                    Grilled Cheese Sandwiches
                  </option>
                  <option value="Kids' Beverages">Kids' Beverages</option>
                  <option value="Kids' Desserts">Kids' Desserts</option>
                  <option value="Low-Calorie Meals">Low-Calorie Meals</option>
                  <option value="Gluten-Free Options">
                    Gluten-Free Options
                  </option>
                  <option value="Keto-Friendly Dishes">
                    Keto-Friendly Dishes
                  </option>
                  <option value="Low-Sugar Desserts">Low-Sugar Desserts</option>
                  <option value="Seasonal Dishes">Seasonal Dishes</option>
                  <option value="Chef’s Specials">Chef’s Specials</option>
                  <option value="Regional Cuisine">Regional Cuisine</option>
                  <option value="Ketchup">Ketchup</option>
                  <option value="Mustard">Mustard</option>
                  <option value="Mayonnaise">Mayonnaise</option>
                  <option value="Hot Sauce">Hot Sauce</option>
                  <option value="Dips">Dips</option>
                  <option value="Bread">Bread</option>
                  <option value="Bagels">Bagels</option>
                  <option value="Croissants">Croissants</option>
                  <option value="Donuts">Donuts</option>
                  <option value="Mexican Dishes">Mexican Dishes</option>
                  <option value="Italian Dishes">Italian Dishes</option>
                  <option value="Chinese Dishes">Chinese Dishes</option>
                  <option value="Indian Dishes">Indian Dishes</option>
                  <option value="Japanese Dishes">Japanese Dishes</option>
                </select>
                <button id="confirmItemCategory" type="submit">
                  Confirm And Add Item
                </button>
              </form>
            </div>
            <div id="displayRestItemsCategories">
              <h4 id="categoriesHeading">
                The Item Type That You Are Currently Selling
              </h4>
              <div id="categoriesContainer">
                {fetchedCategories.length > 0 ? (
                  fetchedCategories.map((category) => {
                    // console.log("Rendering category:", category);
                    return (
                      <div key={category._id}>
                        <div id="categoryBackground">
                          <h4 id="categoryName">{category.name}</h4>
                          <button
                            id="insertNewItem"
                            onClick={() =>
                              showInsertionElements(category.relatedId)
                            }
                          >
                            New Item
                          </button>
                          <button
                            id="editItem"
                            onClick={handleSetEditModalTrue}
                          >
                            Edit Item
                          </button>
                          <button
                            id="deleteItem"
                            onClick={handleShowItemDelModal}
                          >
                            Delete Item
                          </button>
                          <p id="categoryUploadTime">
                            This category is added on someday at{" "}
                            {formatDate(category.timestamp)}
                          </p>
                          <button
                            id="removeCategory"
                            onClick={() =>
                              handleDeleteCategory(category.relatedId)
                            }
                          >
                            Remove Category
                          </button>
                        </div>
                        <h4 id="categoriesContainrHeading">Other Data</h4>
                        <h4 id="totalItemsHeading">
                          Total Number Of Items This Category Have :{" "}
                          {handleCalculateTotalSubitems()}
                        </h4>
                      </div>
                    );
                  })
                ) : (
                  <p id="noCategoryAvailable">No Category Added Yet !! </p>
                )}
              </div>
            </div>
            {categorySaveMsg && (
              <>
                <h4 id="successfullySaveCategory">
                  The category has been saved successfully that is now
                  associated with your restaurent
                </h4>
              </>
            )}
            {categoryDeleteMsg && (
              <>
                <h4 id="successfullyCategoryDelete">
                  Success, the category has been removed!
                </h4>
              </>
            )}
            {newItemModal && (
              <>
                <div id="modalBackground">
                  <div id="newItemModalBG">
                    <h4 id="itemModalHead">Fill up all details to add</h4>
                    <div id="newItemModalCL"></div>
                    <form
                      id="addnewitemForm"
                      onSubmit={handleInsertNewItemToCategory}
                    >
                      <h4 id="newItemNameHeading">Enter name of item</h4>
                      <input
                        type="text"
                        id="newItemNameInput"
                        value={data.itemName}
                        onChange={handleInputChange}
                        name="itemName"
                        required
                      />
                      <h4 id="newItemPriceHeading">Enter price</h4>
                      <input
                        type="number"
                        id="newItemPriceInput"
                        value={data.itemPrice}
                        onChange={handleInputChange}
                        name="itemPrice"
                        required
                      />
                      <h4 id="newItemQuantityHeading">Enter Quantity</h4>
                      <input
                        id="newItemQuantityInput"
                        type="number"
                        value={data.itemQuantity}
                        onChange={handleInputChange}
                        name="itemQuantity"
                        required
                      />
                      <textarea
                        id="newItemDesInput"
                        placeholder="Enter Description (optional)"
                        value={data.itemDescription}
                        onChange={handleInputChange}
                        name="itemDescription"
                      ></textarea>
                      <div class="custom-file-input">
                        <input
                          type="file"
                          id="newItemImageInput"
                          accept="image/*"
                          multiple
                          required
                          onChange={handleFileInput}
                        />
                        <span>Add files</span>
                      </div>
                      <button id="insertNewItemButton" type="submit">
                        Insert Item
                      </button>
                    </form>
                    <button
                      id="closeItemInsertionContainer"
                      onClick={closeInsertionElements}
                    >
                      Close the container
                    </button>
                  </div>
                </div>
              </>
            )}
            {editItemModal && (
              <>
                <div id="modalBackground">
                  <div id="editModalBackground">
                    <h4 id="editModalHeading">
                      All Items You Uploaded In This Category
                    </h4>
                    <div id="editModalCL"></div>
                    <div id="displayItemsForEdit">
                      {fetchedItems && fetchedItems.length > 0 ? (
                        fetchedItems.map((item) => (
                          <div key={item._id}>
                            {item.subItems && item.subItems.length > 0 ? (
                              item.subItems.map((subItem, index) => (
                                <div key={index} id="itemBackground">
                                  {subItem.subitemImages &&
                                  subItem.subitemImages.length > 0 ? (
                                    <>
                                      <img
                                        id="itemFrontImage"
                                        src={`http://localhost:8081/restaurentItemImg/${subItem.subitemImages[0]}`}
                                        alt="Item Image"
                                      />
                                      <h4 id="imageHead">Item Image</h4>
                                    </>
                                  ) : (
                                    <p>No image available</p>
                                  )}
                                  <h4 id="resItemName">{subItem.name}</h4>
                                  <h4 id="resItemPrice">
                                    {subItem.price} ruppees
                                  </h4>
                                  <h4 id="resItemQuantity">
                                    {subItem.quantity} in stock
                                  </h4>
                                  <div id="resItemDescriptionContainer">
                                    <p id="resItemDescriptionText">
                                      " {subItem.description} "
                                    </p>
                                  </div>
                                  <button
                                    id="enterNewDetails"
                                    onClick={() =>
                                      handleSetEditItemContainerTrue(subItem)
                                    }
                                  >
                                    New Details
                                  </button>
                                  <p id="resItemAddedTime">
                                    {item.createdAt
                                      ? new Date(
                                          item.createdAt
                                        ).toLocaleString()
                                      : "No date available"}
                                  </p>
                                </div>
                              ))
                            ) : (
                              <p id="noResItemFound">
                                No items have been uploaded yet !!
                              </p>
                            )}
                          </div>
                        ))
                      ) : (
                        <p id="noResItemFound">
                          No items have been uploaded yet !!
                        </p>
                      )}
                    </div>
                    <button id="closeEditModal" onClick={handleCloseEditModal}>
                      Close the container
                    </button>
                  </div>
                </div>
              </>
            )}
            {editItemContainer && (
              <>
                <div id="modalBackground">
                  <div id="enterNewItemDetailsContainer">
                    <h4 id="newItemHeading">Here, you can enter the details</h4>
                    <div id="newItemCL"></div>
                    <form id="newItemDetailsForm">
                      <input
                        type="text"
                        id="itemNewName"
                        placeholder="Enter item name"
                        value={selectedSubItem.name}
                        onChange={(e) =>
                          setSelectedSubItem((prev) => ({
                            ...prev,
                            name: e.target.value,
                          }))
                        }
                        required
                      />
                      <input
                        type="number"
                        id="itemNewPrice"
                        placeholder="Enter item price"
                        value={selectedSubItem.price}
                        onChange={(e) =>
                          setSelectedSubItem((prev) => ({
                            ...prev,
                            price: e.target.value,
                          }))
                        }
                        required
                      />
                      <input
                        type="number"
                        id="itemNewQuantity"
                        placeholder="Enter item quantity"
                        value={selectedSubItem.quantity}
                        onChange={(e) =>
                          setSelectedSubItem((prev) => ({
                            ...prev,
                            quantity: e.target.value,
                          }))
                        }
                        required
                      />
                      <textarea
                        id="itemNewDescription"
                        placeholder="Enter item description"
                        value={selectedSubItem.description}
                        onChange={(e) =>
                          setSelectedSubItem((prev) => ({
                            ...prev,
                            description: e.target.value,
                          }))
                        }
                        required
                      />
                      <button
                        id="saveNewItemDetails"
                        type="button"
                        onClick={() => handleUpdateResItem(selectedSubItem._id)}
                      >
                        Save Entered Info
                      </button>
                    </form>
                    <button
                      id="viewItemImages"
                      onClick={() => setSelectedItemImgContainer(true)}
                    >
                      View Item Images{" "}
                    </button>
                    <button
                      id="closeResItemEditContainer"
                      onClick={handleSetEditItemContainerFalse}
                    >
                      Close
                    </button>
                  </div>
                  <div
                    id="displayItemImages"
                    style={{
                      display: selectedItemImgContainer ? "block" : "none",
                    }}
                  >
                    <h4 id="itemImagesHeading">Images Of Selected Items </h4>
                    <div id="itemImagesCL"></div>
                    <div id="displayResImagesContainer">
                      {selectedSubItem.subitemImages &&
                      selectedSubItem.subitemImages.length > 0 ? (
                        selectedSubItem.subitemImages.map((image, index) => (
                          <>
                            <img
                              key={index}
                              id="selectedItemFetchedImage"
                              src={`http://localhost:8081/restaurentItemImg/${image}`}
                              alt={`Item Image ${index + 1}`}
                            />
                            <input
                              type="file"
                              id={`imageInput-${index}`}
                              className="imageInput"
                              onChange={(e) =>
                                handleResItemImageChange(e, index)
                              }
                            />
                          </>
                        ))
                      ) : (
                        <p id="noSelectedItemImageHead">No Image Founded !!</p>
                      )}
                    </div>
                    <button
                      id="closeResImagesContainer"
                      onClick={() => setSelectedItemImgContainer(false)}
                    >
                      Hide Images
                    </button>
                  </div>
                </div>
              </>
            )}
            {deleteItemModal && (
              <>
                <div id="modalBackground">
                  <div id="deleteModalBackground">
                    <h4 id="resItemsDelModHead">
                      Items Of This Category You Can Delete
                    </h4>
                    <div id="resItemDelModCL"></div>
                    <div id="displayResItems2Del">
                      {fetchedItems && fetchedItems.length > 0 ? (
                        fetchedItems.map((item) => (
                          <div key={item._id}>
                            {item.subItems && item.subItems.length > 0 ? (
                              item.subItems.map((subItem, index) => (
                                <div key={index} id="itemBackground">
                                  {subItem.subitemImages &&
                                  subItem.subitemImages.length > 0 ? (
                                    <>
                                      <img
                                        id="itemFrontImage"
                                        src={`http://localhost:8081/restaurentItemImg/${subItem.subitemImages[0]}`}
                                        alt="Item Image"
                                      />
                                      <h4 id="imageHead">Item Image</h4>
                                    </>
                                  ) : (
                                    <p>No image available</p>
                                  )}
                                  <h4 id="resItemName">{subItem.name}</h4>
                                  <h4 id="resItemPrice">
                                    {subItem.price} ruppees
                                  </h4>
                                  <h4 id="resItemQuantity">
                                    {subItem.quantity} in stock
                                  </h4>
                                  <div id="resItemDescriptionContainer">
                                    <p id="resItemDescriptionText">
                                      " {subItem.description} "
                                    </p>
                                  </div>
                                  <button
                                    id="deleteResItem"
                                    onClick={() =>
                                      handleDeleteResItemFun(subItem._id)
                                    }
                                  >
                                    Delete Item
                                  </button>
                                  <p id="resItemAddedTime">
                                    {item.createdAt
                                      ? new Date(
                                          item.createdAt
                                        ).toLocaleString()
                                      : "No date available"}
                                  </p>
                                </div>
                              ))
                            ) : (
                              <p id="noResItemFound">
                                No items have been uploaded yet !!
                              </p>
                            )}
                          </div>
                        ))
                      ) : (
                        <p id="noResItemFound">
                          No items have been uploaded yet !!
                        </p>
                      )}
                    </div>
                    <button
                      id="closeDelItemContainer"
                      onClick={handleHideItemDelModal}
                    >
                      Close The Container
                    </button>
                  </div>
                </div>
              </>
            )}
          </>
        )}
        {showEditProfile && (
          <>
            <div id="displayEditingElementsContainer">
              <h4 id="displayEditingContainerHead">
                Here, You Can Add New Details
              </h4>
              <div id="displayEditingContainerCL">
                <form
                  id="editRestInfoForm"
                  onSubmit={handleChangeRestaurentData}
                >
                  <input
                    type="text"
                    id="newResNameInput"
                    placeholder="Enter new name"
                    value={newNameRes}
                    name="newNameRes"
                    onChange={(e) => setNewNameRes(e.target.value)}
                  />
                  <input
                    type="text"
                    id="newResLocationInput"
                    placeholder="Enter restaurent location"
                    value={newResLocation}
                    name="newResLocation"
                    onChange={(e) => setNewResLocation(e.target.value)}
                  />
                  <input
                    type="file"
                    id="imageInput-0"
                    class="ResImageInput"
                    onChange={handleSetNewResImage}
                  />
                  <h4 id="noteEditResInfoContainer">
                    Note : Enter correct password in below box to continue and
                    save new info
                  </h4>
                  <input
                    id="enterResAccountPassword"
                    type="password"
                    placeholder="Enter password "
                    value={data.confirmResAccountPassword}
                    onChange={handleCheckCorrectPassword}
                  />
                  <button
                    id="confirmAndSaveResInfo"
                    type="submit"
                    disabled={isConfirmButtonDisabled}
                  >
                    Continue{" "}
                  </button>
                </form>
                <div id="resNewInfoCL"></div>
                {noPassMatch && (
                  <p id="noPassMatchHead">
                    Keep writing, you are almost there !!
                  </p>
                )}
                {yeaPassMatch && (
                  <p id="passMatchSuccHead">
                    Great work, password matched successfully !!
                  </p>
                )}
                {noPasswordInput && (
                  <div id="displayRestaurentAllDetails">
                    {restaurentData ? (
                      <>
                        <img
                          id="restaurentInfoImage"
                          src={`http://localhost:8081/api/restaurentUploads/${restaurentData?.restaurentpfp}`}
                          alt="Restaurent Profile Pic"
                        />
                        <h4 id="restaurentInfoName">
                          Name : {restaurentData?.restaurentname}
                        </h4>
                        <p id="restaurentInfoLocation">
                          Location : {restaurentData?.restaurentlocation}
                        </p>
                        <h4 id="restaurentInfoHeading">
                          Your Restaurent Details
                        </h4>
                        <p id="restaurentInfoStartedDate">
                          Started on :{" "}
                          {new Date(restaurentData?.createdAt).toLocaleString()}
                        </p>
                        <p id="restaurentInfoOwnerName">
                          Owned by : {user?.username}
                        </p>
                      </>
                    ) : (
                      <p>Loading data...</p>
                    )}
                  </div>
                )}
                {showContainerNote && (
                  <p id="showContainerLine">
                    Container will be display shortly after updating information
                  </p>
                )}
              </div>
            </div>
          </>
        )}
        {manageResItemOrders && (
          <>
            <div id="displayResItemsMainContainer">
              <div
                id="displayPendingOrdersContainers"
                style={{
                  display: showPendingOrders ? "block" : "none",
                }}
              >
                {pendingOrderData.length > 0 ? (
                  pendingOrderData.map((order) => (
                    <div key={order._id}>
                      <div id="PODBG">
                        <div id="POImgContainer">
                          {order.itemimages && order.itemimages.length > 0 ? (
                            <>
                              <img
                                id="POItemBGimg"
                                src={`http://localhost:8081/restaurentItemImg/${order.itemimages[0]}`}
                                alt="Item Image"
                              />
                            </>
                          ) : (
                            <p>No image has been added for this item.</p>
                          )}
                        </div>
                        <div id="POdetailsContainer">
                          <p id="POitemId">Order ID : {order._id}</p>
                          <p id="POcustomerName">
                            Customer Name : {order.customername}
                          </p>
                          <p id="POitemName">Item Name : {order.itemname}</p>
                          <p id="POtotalItemPrice">
                            Total Cost : {order.itemquantity * order.itemprice}{" "}
                            rupees only
                          </p>
                          <div id="customerAddressContainer">
                            <button
                              id="morePOdetails"
                              onClick={() => handleMDModalOpen(order)}
                            >
                              More Details
                            </button>
                            <button
                              id="confirmPO"
                              onClick={() => handleAcceptTheOrder(order)}
                            >
                              Confirm
                            </button>
                          </div>
                          <p
                            id="orderedDate"
                            style={{
                              display: orderConfirmationLine ? "none" : "block",
                            }}
                          >
                            Ordered On :{" "}
                            {new Date(order.orderedDate).toLocaleDateString()}
                          </p>
                          <p
                            id="POsuccessConfirm"
                            style={{
                              display: orderConfirmationLine ? "block" : "none",
                            }}
                          >
                            You accepted an order recently
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p id="noPendingOrderFounded">
                    No Pending Order Found For Your Restaurent.
                  </p>
                )}
              </div>
              <div
                id="displayCompletedOrdersContainers"
                style={{
                  display: showPendingOrders ? "none" : "block",
                }}
              >
                {confirmResOrders.length > 0 ? (
                  confirmResOrders.map((confirmedOrder) => (
                    <div key={confirmedOrder._id}>
                      <div id="PODBG">
                        <div id="POImgContainer">
                          {confirmedOrder.itemimages &&
                          confirmedOrder.itemimages.length > 0 ? (
                            <>
                              <img
                                id="POItemBGimg"
                                src={`http://localhost:8081/restaurentItemImg/${confirmedOrder.itemimages[0]}`}
                                alt="Item Image"
                              />
                            </>
                          ) : (
                            <p>No image has been added for this item.</p>
                          )}
                          <div id="COdetailsContainer">
                            <p id="POitemId">Order ID : {confirmedOrder._id}</p>
                            <p id="POcustomerName">
                              Customer Name : {confirmedOrder.customername}
                            </p>
                            <p id="POitemName">
                              Item Name : {confirmedOrder.itemname}
                            </p>
                            <p id="COitemQuantity">
                              Items Ordered : {confirmedOrder.itemquantity}{" "}
                              items
                            </p>
                            <p id="COitemPrice">
                              Item Price : {confirmedOrder.itemprice}{" "}
                              rupees/item
                            </p>
                            <p id="COitemTE">
                              Total Cost :{" "}
                              {confirmedOrder.itemquantity *
                                confirmedOrder.itemprice}{" "}
                              rupees earned
                            </p>
                            <button
                              id="delieveryDetailsBtn"
                              onClick={() =>
                                handleShowDelieveryDetails(confirmedOrder)
                              }
                            >
                              Delivery Details
                            </button>
                            <button
                              id="orderReviewBtn"
                              onClick={() =>
                                handleShowSelectedItemReviews(confirmedOrder)
                              }
                            >
                              View Reviews
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p id="noConfirmResOrderHead">
                    No Order Has Been Accepted Yet
                  </p>
                )}
              </div>
              <button
                id="viewPendingOrders"
                type="button"
                onClick={() => setShowPendingOrders(true)}
                style={{
                  display: showPendingOrders ? "none" : "block",
                  bottom: isOrderAvailable ? "" : "60px",
                  position: "relative",
                }}
              >
                Pending Orders
              </button>
              <button
                id="completedOrders"
                type="button"
                onClick={() => setShowPendingOrders(false)}
                style={{
                  display: showPendingOrders ? "block" : "none",
                }}
                disabled={confirmResOrders.length === 0}
              >
                Completed Orders
              </button>
            </div>
          </>
        )}
        {POMDmodal && selectedOrder && (
          <>
            <div id="modalBackground">
              <div id="POmodal">
                <h4 id="POmodalHead">Selected Order Details</h4>
                <div id="POmodalSL"></div>
                <div id="POmodalImgContainer">
                  {selectedOrder.itemimages &&
                  selectedOrder.itemimages.length > 0 ? (
                    <>
                      <img
                        id="POCimage"
                        src={`http://localhost:8081/restaurentItemImg/${selectedOrder.itemimages[0]}`}
                        alt="Item Image"
                      />
                    </>
                  ) : (
                    <p>No item image has been uploaded. </p>
                  )}
                </div>
                <div id="POmodalCL"></div>
                <div id="POmodalDataContainer">
                  <p id="POmodalItemName">
                    Item Name : {selectedOrder.itemname}
                  </p>
                  <p id="POmodalItemPrice">
                    Item Price : {selectedOrder.itemprice} rupees/item
                  </p>
                  <p id="POmodalItemQuantity">
                    Item Quantity : {selectedOrder.itemquantity} items
                  </p>
                  <div id="pOmodalItemAddressContainer">
                    <p id="customerDAhead">Delivery Address</p>
                    <p id="customerDA">{selectedOrder.deliveryaddress}</p>
                  </div>
                  <p id="POmodalCustomernumber">
                    Customer Contact : {selectedOrder.customernumber}
                  </p>
                </div>
                <button id="POmodalCloseBtn" onClick={handleCloseMDModal}>
                  Close
                </button>
              </div>
            </div>
          </>
        )}
      </div>
      {showSelectedItemReviews && (
        <div id="modalBackground">
          <div id="selectedItemReviewsContainer">
            <p id="selectedItemReviewHead">Reviews of {selectedItemName}</p>
            <div id="selectedItemReviewContainer">
              {selectedItemReviews.length > 0 ? (
                selectedItemReviews.map((review) => (
                  <div key={review._id} id="selectedItemBackground">
                    <div id="selectedItemUserPFPContainer">
                      <img
                        id="defuserimg"
                        src="http://localhost:8081/public/images/defaultUser.png"
                        alt="User PFP"
                      />
                    </div>
                    <p id="selectedItemReviewCustomerName">
                      {review.customerName}
                    </p>
                    <div id="selectedItemReviewTextContainer">
                      <p id="selectedItemReviewText">" {review.reviewText} "</p>
                    </div>
                    <p id="selectedItemReviewLikes">
                      This review got {review.likes ?? 0}{" "}
                      {review.likes === 1 ? "like" : "likes"}
                    </p>
                  </div>
                ))
              ) : (
                <p id="noSelectedItemReviewsHead">
                  No reviews found for this item!
                </p>
              )}
            </div>
            <button
              id="closeSelectedItemReviewContainer"
              onClick={handleCloseSelectedItemReviews}
            >
              Close
            </button>
          </div>
        </div>
      )}
      {showResNotifications && (
        <div id="resNotificationsContainer">
          <p id="resNotificationHead">Your restaurent notifications</p>
          <div id="restaurentNotificationContianer">
            {restNotifications.length > 0 ? (
              restNotifications.map((notification) => (
                <div key={notification._id} id="restNotificationBackground">
                  <p id="restNotificationHead">Recent Activity</p>
                  <p id="restNotificationText">{notification.message}</p>
                  <button
                    id="deleteNotificationRestButton"
                    onClick={() =>
                      handleDeleteRestNotification(notification._id)
                    }
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </div>
              ))
            ) : (
              <p id="noRestNotificationHead">No activity found recently!</p>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default RestaurentOwnerHomePage;
