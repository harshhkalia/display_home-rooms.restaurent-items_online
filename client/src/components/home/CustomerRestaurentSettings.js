import { useEffect, useState } from "react";
import RestaurentCustomerSettingsNav from "../navbarsAndFooters/RestaurentCustomerSettingsNav";
import RestaurentCustomerSettingsSB from "../resOwnPageEl/RestaurentCustomerSettingsSB";
import "./CustomerRestaurentSettings.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CustomerRestaurentSettings = () => {
  const navigate = useNavigate();

  const [showEditProfile, setShowEditProfile] = useState(true);
  const [userData, setUserData] = useState(null);
  const [userFullname, setUserFullname] = useState("");
  const [userUsername, setUserUsername] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [newCustomer, setNewCustomer] = useState(null);
  const [successMessage, setSuccessMessage] = useState(false);
  const [defaultMessage, setDefaultMessage] = useState(true);
  const [transactionPage, setTransactionPage] = useState(false);
  const [transactionExpenseCount, setTransactionExpenseCount] = useState(0);
  const [totalRestaurentCount, setTotalRestaurentCount] = useState(0);
  const [recentItems, setRecentItems] = useState([]);
  const [orderAgainModal, setOrderAgainModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [cusNameDef, setCusNameDef] = useState("");
  const [cusPhoneDef, setCusPhoneDef] = useState("");
  const [itemQuantityDef, setItemQuantityDef] = useState(0);
  const [cusAddressDef, setCusAddressDef] = useState("");
  const [successStatusModal, setSuccessStatusModal] = useState(false);

  useEffect(() => {
    const fetchUserData = () => {
      const userData = JSON.parse(localStorage.getItem("user"));
      if (userData) {
        setUserData(userData);
        setUserFullname(userData.fullname);
        setUserUsername(userData.username);
        setCusNameDef(userData.fullname);
      }
    };
    fetchUserData();
  }, []);

  useEffect(() => {
    if (newCustomer) {
      setUserData((prevCustomer) => ({
        ...prevCustomer,
        fullname: newCustomer.fullname,
        username: newCustomer.username,
      }));
      setUserFullname(newCustomer.fullname);
      setUserUsername(newCustomer.username);
      setNewCustomer(null);
    }
  }, [newCustomer]);

  const handleEditProfile = () => {
    setIsEditing(true);
    setDefaultMessage(false);
  };

  const handleCancelEditProfile = () => {
    setIsEditing(false);
    setUserPassword("");
    setDefaultMessage(true);
  };

  const handleUpdateCustomerDetails = async () => {
    if (userData) {
      try {
        const response = await axios.put(
          `${process.env.REACT_APP_API_URL}updatecustomerdetails?customerId=${userData._id}`,
          {
            fullname: userFullname,
            username: userUsername,
            password: userPassword,
          }
        );
        if (response.status === 200) {
          setTimeout(() => {
            setIsEditing(false);
            setSuccessMessage(false);
            setDefaultMessage(true);
          }, 2000);
          setUserPassword("");
          setNewCustomer(response.data.newCustomer);
          localStorage.setItem(
            "user",
            JSON.stringify(response.data.newCustomer)
          );
          setSuccessMessage(true);
          setDefaultMessage(false);
        }
      } catch (error) {
        if (error.response && error.response.data.message) {
          window.alert(error.response.data.message);
        } else {
          console.error(
            "Failed to update your profile details due to : ",
            error
          );
          window.alert("Failed to update your profile details!!");
        }
      }
    }
  };

  const handleDeleteCustomer = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete your account ? This action cannot be undone."
    );

    if (confirmDelete) {
      try {
        const response = await axios.delete(
          `${process.env.REACT_APP_API_URL}deletecustomer?customerId=${userData._id}`
        );
        if (response.status === 200) {
          localStorage.removeItem("user");
          localStorage.removeItem("token");
          navigate("/");
        }
      } catch (error) {
        console.error("Failed to delete your account due to : ", error);
        window.alert("Failed to delete your account!!");
      }
    }
  };

  const onTransactionClick = () => {
    setTransactionPage(true);
    setShowEditProfile(false);
  };

  const onEditProfileClick = () => {
    setShowEditProfile(true);
    setTransactionPage(false);
  };

  useEffect(() => {
    const fetchTransactionExpenseCount = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}fetchtotalexpenses?customerId=${userData?._id}`
        );
        if (response.status === 200) {
          setTransactionExpenseCount(response.data.totalExpenses);
        }
      } catch (error) {
        console.error(
          "Failed to fetch transaction expense count due to : ",
          error
        );
      }
    };
    fetchTransactionExpenseCount();
  }, [userData?._id]);

  useEffect(() => {
    const fetchTotalRestaurentCount = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}fetchtotalrestaurents?customerId=${userData?._id}`
        );
        if (response.status === 200) {
          setTotalRestaurentCount(response.data.orderCount);
        }
      } catch (error) {
        console.error(
          "Failed to fetch total restaurent count due to : ",
          error
        );
      }
    };
    fetchTotalRestaurentCount();
  }, [userData?._id]);

  useEffect(() => {
    const fetchRecentItems = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}fetchrestaurentdetails?customerId=${userData?._id}`
        );
        if (response.status === 200) {
          setRecentItems(response.data.restaurentDetails);
          console.log(
            "recent items purchased : ",
            response.data.restaurentDetails
          );
        }
      } catch (error) {
        console.error("Failed to fetch recent items due to : ", error);
      }
    };
    fetchRecentItems();
  }, [userData?._id]);

  const handleOrderAgainModal = (item) => {
    setSelectedItem(item);
    setOrderAgainModal(true);
  };

  const handleCancelOrderAgainModal = () => {
    setOrderAgainModal(false);
    setSelectedItem(null);
    setCusNameDef("");
    setCusPhoneDef("");
    setItemQuantityDef(0);
    setCusAddressDef("");
  };

  const handlePlaceOrder = async () => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}placeorder`,
        {
          customerName: cusNameDef,
          customerId: userData._id,
          customerNumber: cusPhoneDef,
          deliveryAddress: cusAddressDef,
          restaurentId: selectedItem.restaurentId,
          itemId: selectedItem.itemId,
          itemQuantity: itemQuantityDef,
        }
      );
      if (response.status === 201) {
        setSuccessStatusModal(true);
        setOrderAgainModal(false);
      }
    } catch (error) {
      if (error.response && error.response.data.message) {
        window.alert(error.response.data.message);
      } else {
        console.error("Failed to place the order due to : ", error);
        window.alert("Failed to place the order! Please try again.");
      }
    }
  };

  const handleCloseSuccessStatusModal = () => {
    setSuccessStatusModal(false);
    handleCancelOrderAgainModal();
  };

  return (
    <>
      <RestaurentCustomerSettingsNav />
      <RestaurentCustomerSettingsSB
        onTransactionClick={onTransactionClick}
        onEditProfileClick={onEditProfileClick}
      />
      {showEditProfile && (
        <>
          <div id="editProfileContainer">
            <p id="EPcontainerText">Your Profile Details</p>
            <div id="EPCSL"></div>
            {userData && (
              <>
                <p id="customerFullnameHead">Your Name</p>
                <p id="customerFullname">" {userData.fullname} "</p>
                <p id="customerUsernameHead">Your Username</p>
                <p id="customerUsername">" {userData.username} "</p>
                <button
                  id="customerEditProfileBtn"
                  onClick={handleEditProfile}
                  disabled={isEditing}
                >
                  Edit Profile
                </button>
                <button
                  id="customerDeleteProfileBtn"
                  onClick={handleDeleteCustomer}
                >
                  Delete Profile
                </button>
                {defaultMessage && (
                  <p id="defaultMessageNewCustomer">
                    Note : You can only edit your name and username not password
                    as it is used to login into your account!
                  </p>
                )}
              </>
            )}
          </div>

          {isEditing && (
            <div id="newDetailsContainer">
              <p id="newDetailsContainerText">
                Add New Details To Your Profile
              </p>
              <div id="NDCSL"></div>
              <input
                type="text"
                placeholder="Enter Your Name"
                id="NDCnewName"
                value={userFullname}
                onChange={(e) => setUserFullname(e.target.value)}
              />
              <input
                type="text"
                placeholder="Enter Your Username"
                id="NDCnewUsername"
                value={userUsername}
                onChange={(e) => setUserUsername(e.target.value)}
              />
              <input
                type="password"
                placeholder="Enter The Password"
                id="NDCnewPassword"
                value={userPassword}
                onChange={(e) => setUserPassword(e.target.value)}
              />
              <button
                id="NDconfirmButton"
                onClick={handleUpdateCustomerDetails}
              >
                Confirm and Save
              </button>
              <button id="NDcancelButton" onClick={handleCancelEditProfile}>
                Cancel and Close
              </button>
              {successMessage && (
                <p id="SuccessMessageNewCustomer">
                  Message : Your profile details have been updated successfully!
                </p>
              )}
            </div>
          )}
        </>
      )}
      {transactionPage && (
        <div id="transactionPageContainer">
          <p id="transactionPageContainerText">Your Transaction Data</p>
          <div id="transactionPageContainerSL">
            <p id="transactionContainerOneHead">
              Your Total Transaction Count Till Yet = ₹{" "}
              {transactionExpenseCount}
            </p>
            <p id="transactionContainerTwoHead">
              Total Number Of Purchases Till Yet = {totalRestaurentCount}
            </p>
          </div>
          <div id="transactionPageContainerSLL"></div>
          <p id="transactionPageContainerTextOne">Your All Item Purchases</p>
          <div id="transactionItemsContainer">
            {recentItems.length > 0 ? (
              recentItems.map((item) => (
                <div key={item._id} className="recentItem">
                  {item.itemimages && item.itemimages.length > 0 ? (
                    <>
                      <img
                        id="recentItemImage"
                        src={`http://localhost:8081/restaurentItemImg/${item.itemimages[0]}`}
                        alt="SubItem Image"
                      />
                      <div id="recentItemLowerContainer">
                        <p id="recentItemName">{item.itemname}</p>
                        <p id="recentItemRestaurentName">
                          {item.restaurentname}
                        </p>
                        <span id="recentItemPrice">
                          <span id="recentItemPriceSymbol">₹</span>{" "}
                          {item.itemprice}/-
                        </span>
                        <p
                          id="orderAgainHead"
                          onClick={() => handleOrderAgainModal(item)}
                        >
                          <u>Order Again ?</u>
                        </p>
                      </div>
                    </>
                  ) : (
                    <p id="loadingRecentItemData">Loading Item Data...</p>
                  )}
                </div>
              ))
            ) : (
              <p id="noRecentItemPurchased">
                No Item Purchased by you till yet!
              </p>
            )}
          </div>
        </div>
      )}
      {orderAgainModal && (
        <div id="modalBackground">
          <div id="orderAgainModal">
            {selectedItem.itemimages && selectedItem.itemimages.length > 0 ? (
              <img
                id="orderAgainModalImage"
                src={`http://localhost:8081/restaurentItemImg/${selectedItem.itemimages[0]}`}
                alt="Selected Item Image"
              />
            ) : (
              <p id="loadingSelectedItemImage">Loading Item Image...</p>
            )}
            <div id="OAContainer">
              <div id="OAINcontainer">
                <p id="OAINitemName">Item Name : {selectedItem.itemname}</p>
              </div>
              <div id="OASL"></div>
              <input
                type="text"
                id="OACusNameInput"
                placeholder="Enter your name"
                value={cusNameDef}
                onChange={(e) => setCusNameDef(e.target.value)}
              />
              <input
                type="number"
                id="OACusPhoneInput"
                placeholder="Enter your number"
                value={cusPhoneDef}
                onChange={(e) => setCusPhoneDef(e.target.value)}
              />
              <input
                type="number"
                id="OAItemQuantity"
                placeholder="Enter quantity"
                value={itemQuantityDef}
                onChange={(e) => setItemQuantityDef(e.target.value)}
              />
              <textarea
                id="OAcusAddressInput"
                placeholder="Enter your address"
                value={cusAddressDef}
                onChange={(e) => setCusAddressDef(e.target.value)}
              ></textarea>
              <button id="OAplaceOrderBtn" onClick={handlePlaceOrder}>
                Order
              </button>
              <button
                id="OAcancelOrderBtn"
                onClick={handleCancelOrderAgainModal}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      {successStatusModal && (
        <div id="modalBackground">
          <div id="successStatusModal">
            <p id="successStatusModalText">New Message</p>
            <div id="successStatusBackground">
              <p id="successStatusText">
                Dear {cusNameDef}, Your order for {selectedItem?.itemname} has
                been placed successfully. You can track this order in your
                orders section. Thanks for using our services!
              </p>
            </div>
            <button
              id="closeSuccessStatusModalBtn"
              onClick={handleCloseSuccessStatusModal}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default CustomerRestaurentSettings;
