import React from "react";
import { useNavigate } from "react-router-dom";
import "./RestaurentCustomerSettingsNav.css";

const RestaurentCustomerSettingsNav = () => {
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

  const navigateCustomerHome = () => {
    navigate("/selectedrestaurentitems");
  };

  return (
    <>
      <div id="customerHomeNav">
        <h4 id="ownNavHeading">ROUSTUF</h4>
        <button id="logoutCustomer" onClick={handleLogOut}>
          Log Out
        </button>
        <button id="homeBtnCustomer" onClick={navigateCustomerHome}>
          Home Page
        </button>
      </div>
    </>
  );
};

export default RestaurentCustomerSettingsNav;
