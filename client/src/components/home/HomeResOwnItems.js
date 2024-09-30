import { useState, useEffect, useRef } from "react";
import ResOwnItemPageNav from "../navbarsAndFooters/ResOwnerItemsPageNav";
import ResOwnItemsPageSB from "../resOwnPageEl/ResOwnItemsPageSB";
import "./HomeResOwnItems.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFileWaveform,
  faCheck,
  faUser,
  faPhone,
  faArrowUp,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

const ResOwnItemPage = () => {
  const [selectedSubItem, setSelectedSubItem] = useState(null);
  const [manageItemModal, setManageItemModal] = useState(false);
  const [editItemModal, setEditItemModal] = useState(false);
  const [itemSaleCount, setItemSaleCount] = useState(0);
  const [itemSaleEarnings, setItemSaleEarnings] = useState(0);
  const [remainingOrdersModal, setRemainingOrdersModal] = useState(false);
  const [remainingOrders, setRemainingOrders] = useState([]);
  const [itemAllReviews, setItemAllReviews] = useState([]);
  const [allReviewsModal, setAllReviewsModal] = useState(false);
  const [previewOrderModal, setPreviewOrderModal] = useState(false);
  const [specificOrderData, setSpecificOrderData] = useState(null);
  const [userSelectedReview, setUserSelectedReview] = useState(null);
  const [nonSelectedRestItems, setNonSelectedRestItems] = useState([]);
  const [restaurentData, setRestaurentData] = useState(null);

  const otherItemsFetchedRef = useRef(false);

  const handleCloseImageSelect = () => {
    setSelectedSubItem(null);
  };

  const handleManageResItem = () => {
    setManageItemModal(true);
  };

  const handleEditResItem = () => {
    setManageItemModal(false);
    setEditItemModal(true);
  };

  const handleCloseEditResItem = () => {
    setEditItemModal(false);
  };

  const handleChangeInResItem = async () => {
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}changeresitemdetails`,
        {
          itemId: selectedSubItem?._id,
          newItemName: selectedSubItem?.name,
          newItemPrice: selectedSubItem?.price,
          newItemQuantity: selectedSubItem?.quantity,
          newItemDescription: selectedSubItem?.description,
        }
      );
      if (response.status === 200) {
        setEditItemModal(false);
        window.alert(response.data.message);

        const updatedItem = response.data.updatedItem;

        const updatedMainItem = updatedItem.items.find((item) =>
          item.subItems.some((subItem) => subItem._id === selectedSubItem?._id)
        );

        if (updatedMainItem) {
          const updatedSubItem = updatedMainItem.subItems.find(
            (subItem) => subItem._id === selectedSubItem?._id
          );

          if (updatedSubItem) {
            setSelectedSubItem((prevDetails) => ({
              ...prevDetails,
              name: updatedSubItem.name,
              price: updatedSubItem.price,
              quantity: updatedSubItem.quantity,
              description: updatedSubItem.description,
            }));
          }
        }

        const confirmation = window.confirm(
          "You recently changed the info of an item, do you want to reload the page for better experience ?"
        );
        if (confirmation) {
          window.location.reload();
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
          "Failed to change details of restaurent item due to : ",
          error
        );
        window.alert(
          "Failed to change details of restaurent item, please try again!!"
        );
      }
    }
  };

  const handleDeleteResItem = async () => {
    const confirmation = window.confirm(
      "Do you want to remove this item? It cannot be undone!"
    );
    if (confirmation) {
      try {
        const response = await axios.delete(
          `${process.env.REACT_APP_API_URL}deleteselecteditem/${selectedSubItem?._id}`
        );
        if (response.status === 200) {
          setManageItemModal(false);
          window.alert(response.data.message);

          const confirmation = window.confirm(
            "Do you want to reload the page to see new changes ?"
          );
          if (confirmation) {
            window.location.reload();
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
            "Failed to delete selected restaurant item due to: ",
            error
          );
          window.alert(
            "Failed to delete selected restaurant item, please try again!!"
          );
        }
      }
    }
  };

  const handleFetchItemSaleCount = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}fetchitemsalecountforowner?itemId=${selectedSubItem?._id}`
      );
      if (response.status === 200) {
        setItemSaleCount(response.data.saleCount);
      }
    } catch (error) {
      console.error("Failed to fetch item sale count due to : ", error);
      window.alert("Failed to fetch item sale count, please try again!!");
    }
  };

  const handleFetchItemSaleEarnings = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}fetchtotalitemsaleearnings?itemId=${selectedSubItem?._id}`
      );
      if (response.status === 200) {
        setItemSaleEarnings(response.data.totalEarnings);
      }
    } catch (error) {
      console.error("Failed to fetch item sale earnings due to : ", error);
    }
  };

  useEffect(() => {
    if (selectedSubItem) {
      handleFetchItemSaleCount();
      handleFetchItemSaleEarnings();
      handleFetchRemainingItemOrders();
      handleFetchAllItemReviews();
    }
  }, [selectedSubItem]);

  const handleShowSaleCount = () => {
    window.alert(
      `${itemSaleCount} items have been sold and you have earned ${itemSaleEarnings} ruppees from it!`
    );
  };

  const handleShowRemainingOrders = () => {
    setRemainingOrdersModal(true);
    handleFetchRemainingItemOrders();
  };

  const closeRemainingOrdersModal = () => {
    setRemainingOrdersModal(false);
    setRemainingOrders([]);
  };

  const handleFetchRemainingItemOrders = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}fetchremainingitemorders?itemId=${selectedSubItem?._id}`
      );
      if (response.status === 200) {
        setRemainingOrders(response.data.remainingOrders);
      }
    } catch (error) {
      console.error("Failed to fetch remaining item orders due to : ", error);
    }
  };

  if (remainingOrders?.length > 0) {
    console.log("fetched remaining orders : ", remainingOrders);
  }

  const handleConfirmOrder = async (orderId) => {
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}confirmorder/${orderId}`
      );
      if (response.status === 200) {
        window.alert(response.data.message);
        setRemainingOrders(
          remainingOrders.filter((order) => order._id !== orderId)
        );
      }
    } catch (error) {
      console.error("Failed to confirm order due to : ", error);
      window.alert("Failed to confirm order, please try again!!");
    }
  };

  const handleFetchAllItemReviews = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}fetchallitemreviews?itemId=${selectedSubItem?._id}`
      );
      if (response.status === 200) {
        setItemAllReviews(response.data.allReviews);
      }
    } catch (error) {
      console.error("Failed to fetch all item reviews due to : ", error);
    }
  };

  const handleCloseAllReviewsModal = () => {
    setAllReviewsModal(false);
    setItemAllReviews([]);
    setNonSelectedRestItems([]);
  };

  const handleShowSpecificOrderModal = (review) => {
    setPreviewOrderModal(true);
    setAllReviewsModal(false);
    setUserSelectedReview(review);
    handleFetchSpecificOrderData(review.orderId);
  };

  const handleFetchSpecificOrderData = async (orderId) => {
    if (!orderId) {
      console.error("Order ID is null or undefined");
      return;
    }

    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}fetchspecificorder?orderId=${orderId}`
      );
      if (response.status === 200) {
        setSpecificOrderData(response.data.order);
      }
    } catch (error) {
      console.error("Failed to fetch specific order data due to : ", error);
    }
  };

  if (specificOrderData) {
    console.log("Specific Order Data Is : ", specificOrderData);
  }

  const handleClosePreviewOrderModal = () => {
    setPreviewOrderModal(false);
    setSpecificOrderData(null);
    setUserSelectedReview(null);
    setAllReviewsModal(true);
  };

  const handleShowReviewsSection = () => {
    setAllReviewsModal(true);
    handleFetchAllItemReviews();
    if (!otherItemsFetchedRef.current) {
      handleFetchNonSelectedRestItems();
    }
    handleFetchNonSelectedRestItems();
  };

  const handleFetchNonSelectedRestItems = async () => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}fetchotherrestitems?itemId=${selectedSubItem?._id}`,
        {
          restaurentId: restaurentData?._id,
        }
      );
      if (response.status === 200) {
        setNonSelectedRestItems(response.data.allItems);
        otherItemsFetchedRef.current = true;
      }
    } catch (error) {
      console.error(
        "Failed to fetch non-selected restaurent items due to : ",
        error
      );
    }
  };

  useEffect(() => {
    const restaurant = JSON.parse(localStorage.getItem("restaurent"));
    if (restaurant) {
      setRestaurentData(restaurant);
    }
  }, []);

  return (
    <>
      <ResOwnItemPageNav />
      <ResOwnItemsPageSB setSelectedSubItem={setSelectedSubItem} />
      {!selectedSubItem && (
        <div id="noItemChoosedTB">
          <span id="noItemTBL">Select an item which you want to inspect!</span>
        </div>
      )}
      {selectedSubItem && (
        <div id="itemSelectedTB">
          <div id="displayItemImagesContainer">
            {selectedSubItem.subitemImages &&
            selectedSubItem.subitemImages.length > 0 ? (
              selectedSubItem.subitemImages.map((image, index) => (
                <img
                  key={index}
                  id="fetchedResItemImage"
                  src={`http://localhost:8081/restaurentItemImg/${image}`}
                  alt={`SubItem Image ${index + 1}`}
                />
              ))
            ) : (
              <p>No images available for this item.</p>
            )}
          </div>
          <div id="SLDdisplayItemImages"></div>
          <h4 id="displayImagesHeading">
            Images Of The Item You Selected To Display
          </h4>
          <div id="selectedItemDLContainer">
            <h4 id="selectedItemDL">
              Some Operations Which You Can Perform Related To This Item
            </h4>
            <button
              id="manageSelectedItem"
              onClick={() => handleManageResItem()}
            >
              Manage Item
            </button>
            <button id="remainingSIOrders" onClick={handleShowRemainingOrders}>
              Remaining Orders
            </button>
            <button id="selectedItemInsight" onClick={handleShowSaleCount}>
              Item Insight
            </button>
          </div>
          <div id="displayItemInfoContainer">
            <p id="selectedItemName">Name : {selectedSubItem.name}</p>
            <p id="selectedItemPrice">
              Price : {selectedSubItem.price} ruppees
            </p>
            <p id="selectedItemQuantity">
              Quantity : {selectedSubItem.quantity} items left
            </p>
            <div id="selectedItemDescriptionContainer">
              <span id="selectedItemDescription">
                " {selectedSubItem.description} "
              </span>
            </div>
            <p id="selectedItemDI">
              About Item <FontAwesomeIcon icon={faFileWaveform} />
            </p>
          </div>
          <div id="displayCommentsOfItemContainer">
            <img
              id="commentsBGImage"
              src="http://localhost:8081/public/images/commentsBG.jpg"
              alt="Comment Section Image"
              onClick={handleShowReviewsSection}
            />
          </div>
          <p id="displayCommentsHeading">Press Above Image To View Comments</p>
          <div id="SLItemPage"></div>
          <button id="deselectItemSelected" onClick={handleCloseImageSelect}>
            Go Back
          </button>
        </div>
      )}
      {manageItemModal && (
        <>
          <div id="modalBackground">
            <div id="manageItemModal">
              {selectedSubItem.subitemImages &&
              selectedSubItem.subitemImages?.length > 0 ? (
                <>
                  <img
                    id="selectedSubItemImage"
                    src={`http://localhost:8081/restaurentItemImg/${selectedSubItem.subitemImages[0]}`}
                    alt="SubItem Image"
                  />
                </>
              ) : (
                <p>No image has been added for this item.</p>
              )}
              <div id="selectedSubitemInfoContainer">
                <h4 id="selectedSubitemHead">
                  What Would You Want To Do With This Item ?
                </h4>
                <button
                  id="editSelectedItemBtn"
                  onClick={() => handleEditResItem()}
                >
                  Edit Item
                </button>
                <button
                  id="deleteSelectedItemBtn"
                  onClick={handleDeleteResItem}
                >
                  Delete Item
                </button>
                <button
                  id="closeSSIContainer"
                  onClick={() => setManageItemModal(false)}
                >
                  Nothing
                </button>
              </div>
            </div>
          </div>
        </>
      )}
      {editItemModal && (
        <>
          <div id="modalBackground">
            <div id="editSelectedItemModal">
              <h4 id="editselectedItemHead">Enter Details For Item</h4>
              <input
                id="newItemName"
                type="text"
                placeholder="New Item Name"
                value={selectedSubItem.name}
                onChange={(e) =>
                  setSelectedSubItem((prevDetail) => ({
                    ...prevDetail,
                    name: e.target.value,
                  }))
                }
              />
              <input
                id="newItemPrice"
                type="number"
                placeholder="New Item Price"
                value={selectedSubItem.price}
                onChange={(e) =>
                  setSelectedSubItem((prevDetail) => ({
                    ...prevDetail,
                    price: e.target.value,
                  }))
                }
              />
              <input
                id="newItemQuantity"
                type="number"
                placeholder="New Item Quantity"
                value={selectedSubItem.quantity}
                onChange={(e) =>
                  setSelectedSubItem((prevDetail) => ({
                    ...prevDetail,
                    quantity: e.target.value,
                  }))
                }
              />
              <textarea
                id="newItemDescription"
                placeholder="New Item Description"
                value={selectedSubItem.description}
                onChange={(e) =>
                  setSelectedSubItem((prevDetail) => ({
                    ...prevDetail,
                    description: e.target.value,
                  }))
                }
              />
              <button id="saveNewInfoBtn" onClick={handleChangeInResItem}>
                Save
              </button>
              <button id="cancelNewInfoBtn" onClick={handleCloseEditResItem}>
                Cancel
              </button>
              <div id="noteContainerEditInfo">
                <h4 id="noteCH">Important Notes</h4>
                <ul>
                  <li id="editModalHeadingFirst">
                    {" "}
                    If You Won't Save The Information Recently Added Then It
                    Will Changed To Previous One When Page Get Reload!
                  </li>
                  <li id="editModalHeadingSecond">
                    You Can't Change Item Image From Here.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </>
      )}
      {remainingOrdersModal && (
        <>
          <div id="modalBackground">
            <div id="remainingOrdersModal">
              <div id="remainingOrdersContainer">
                {remainingOrders.length > 0 ? (
                  remainingOrders.map((order) => (
                    <div key={order._id} id="RObackground">
                      {order.itemimages && order.itemimages.length > 0 ? (
                        <img
                          id="ROitemImage"
                          src={`http://localhost:8081/restaurentItemImg/${order.itemimages[0]}`}
                          alt="Item Image"
                        />
                      ) : (
                        <p>No image available for this item.</p>
                      )}
                      <div id="otherRODetailsContainer">
                        <div id="ROitemDetailsContainer">
                          <p id="ROitemName">{order.itemname}</p>
                          <p id="ROitemPrice">₹ {order.itemprice}/item</p>
                          <p id="ROitemQuantity">
                            <FontAwesomeIcon icon={faCheck} />{" "}
                            {order.itemquantity} items
                          </p>
                          <p id="ROitemTotalPrice">
                            Total Price : ₹{" "}
                            {order.itemprice * order.itemquantity}/-
                          </p>
                        </div>
                        <p id="ROIDHead">Item Details</p>
                        <p id="ROCDHead">Customer Details</p>
                        <div id="ROcustomerDetailsContainer">
                          <p id="ROcustomerName">
                            <span id="ROcustomerIcon">
                              <FontAwesomeIcon icon={faUser} />
                            </span>
                            {order.customername}
                          </p>
                          <p id="ROcustomerPhone">
                            <span id="ROcustomerIcon">
                              <FontAwesomeIcon icon={faPhone} />
                            </span>
                            {order.customernumber}
                          </p>
                          <p id="ROcustomerAddressHead">Customer Address</p>
                          <div id="ROcustomerAddressContainer">
                            <p id="ROcustomerAddress">
                              " {order.deliveryaddress} "
                            </p>
                          </div>
                          <p id="noMoreDetails">No More Details Found</p>
                        </div>
                        <button
                          id="ROConfirmOrderBtn"
                          onClick={() => handleConfirmOrder(order._id)}
                        >
                          Confirm Order
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p id="noRemainingOrderFound">
                    No Pending Order Found For This Item!
                  </p>
                )}
              </div>
              <button
                id="closeRemainingOrdersModal"
                onClick={closeRemainingOrdersModal}
              >
                Close
              </button>
            </div>
          </div>
        </>
      )}
      {allReviewsModal && (
        <>
          <div id="modalBackground">
            <div id="allReviewsModal">
              <p id="allReviewsModalHead">Item Reviews</p>
              <div id="allReviewsContainer">
                {itemAllReviews.length > 0 ? (
                  itemAllReviews.map((review) => (
                    <div key={review._id} id="reviewBC">
                      <div id="ARUPFPD">
                        <img
                          id="reviewProfileDP"
                          src="http://localhost:8081/public/images/reviewProfilePic.png"
                          alt="User Profile Picture"
                        />
                      </div>
                      <p id="reviewUserName">{review.customerName}</p>
                      <div id="RTContainer">
                        <p id="RTdata">" {review.reviewText} "</p>
                      </div>
                      <p id="reviewLC">
                        {!review.likes
                          ? "0 likes"
                          : `${review.likes} ${
                              review.likes === 1 ? "like" : "likes"
                            }`}
                      </p>
                      <button
                        id="showOrderBtn"
                        onClick={() => handleShowSpecificOrderModal(review)}
                      >
                        Preview Order
                      </button>
                    </div>
                  ))
                ) : (
                  <p id="noRFOAI">No Reviews Found For This Item!</p>
                )}
              </div>
              <button id="clsARCBtn" onClick={handleCloseAllReviewsModal}>
                Close
              </button>
            </div>
          </div>
        </>
      )}
      {previewOrderModal && userSelectedReview && (
        <>
          <div id="modalBackground">
            <div id="previewOrderModal">
              <p id="previewOrderURHead">User Review</p>
              <div id="URcontainer">
                <div id="UDPFPC">
                  <img
                    id="reviewProfileDP"
                    src="http://localhost:8081/public/images/reviewProfilePic.png"
                    alt="User Profile Picture"
                  />
                </div>
                <p id="USRCusName">{userSelectedReview.customerName}</p>
                <div id="USRDC">
                  <p id="USRT">" {userSelectedReview.reviewText} "</p>
                </div>
                <p id="USRlikes">
                  {`This review has ${userSelectedReview.likes || 0} ${
                    userSelectedReview.likes === 1 ? "like" : "likes"
                  }`}
                </p>
              </div>
              <div id="PMCL"></div>
              <p id="PMbelowHead">Order Data</p>
              <div id="PMODC">
                <p id="PMcustname">
                  Customer : {specificOrderData?.customername}
                </p>
                <p id="PMcustnum">
                  Mobile Number : {specificOrderData?.customernumber}
                </p>
                <p id="PMcusTotalPrice">
                  Total Price : ₹{" "}
                  {specificOrderData?.itemprice *
                    specificOrderData?.itemquantity}
                  /-
                </p>
                <div id="PMCusAddC">
                  <p id="PMcusAdd">" {specificOrderData?.deliveryaddress} "</p>
                </div>
                <p id="PMcusAddHead">
                  Customer Address <FontAwesomeIcon icon={faArrowUp} />{" "}
                </p>
              </div>
              <button
                id="clsPMcontainer"
                onClick={handleClosePreviewOrderModal}
              >
                Close
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default ResOwnItemPage;
