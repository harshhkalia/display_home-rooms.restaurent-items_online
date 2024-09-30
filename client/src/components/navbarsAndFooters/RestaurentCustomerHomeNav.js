import "./RestaurentCustomerHomeNav.css";
import { useNavigate } from "react-router-dom";

const CustomerHomeNav = ({
  onMyOrderClick,
  onCartClick,
  onNotificationClick,
}) => {
  const navigate = useNavigate();

  const handleLogOut = () => {
    try {
      const confirmation = window.confirm(
        "Are you sure you want to logout, you will have to find this restaurent again!"
      );
      if (confirmation) {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        localStorage.removeItem("selectedRestaurentId");
        navigate("/");
      }
    } catch (error) {
      console.error("Failed to logout the user due to : ", error);
      window.alert("Failed to log you out, please try again");
    }
  };

  const navigateCustomerSettings = () => {
    navigate("/viewcustomersettings");
  };

  return (
    <>
      <div id="customerHomeNav">
        <h4 id="ownNavHeading">ROUSTUF</h4>
        <button id="customerOrders" onClick={onMyOrderClick}>
          My Orders
        </button>
        <button id="showCustomerNotifications" onClick={onNotificationClick}>
          Show Notifications
        </button>
        <button id="logoutBtnCustomer" onClick={handleLogOut}>
          Log Out
        </button>
        <button id="settingsBtnCustomer" onClick={navigateCustomerSettings}>
          Settings
        </button>
        <button id="showCartItems" onClick={onCartClick}>
          Items In Cart
        </button>
      </div>
    </>
  );
};

export default CustomerHomeNav;
