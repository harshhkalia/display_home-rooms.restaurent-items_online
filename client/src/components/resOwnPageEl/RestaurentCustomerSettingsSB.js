import React from "react";
import "./RestaurentCustomerSettingSB.css";

const RestaurentCustomerSettingsSB = ({
  onTransactionClick,
  onEditProfileClick,
}) => {
  return (
    <>
      <div id="SideBarContainer">
        <button
          id="editProfileBtn"
          title="Edit Profile"
          onClick={onEditProfileClick}
        >
          Edit Profile
        </button>
        <button
          id="transactionHistoryBtn"
          title="Transaction History"
          onClick={onTransactionClick}
        >
          Transaction History
        </button>
        <p id="editProfileBtnText">For editing profile</p>
        <p id="transactionHistoryBtnText">Review your transactions</p>
      </div>
    </>
  );
};

export default RestaurentCustomerSettingsSB;
