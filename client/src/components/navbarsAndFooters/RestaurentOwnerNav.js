import "./RestaurentOwnerNav.css";
import { useNavigate } from "react-router-dom";

const ResOwnNav = () => {
  const navigate = useNavigate();

  const handleLogoutUser = () => {
    try {
      const confirmation = window.confirm("Do you really want to logout ?");
      if (confirmation) {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        navigate("/");
      }
    } catch (error) {
      console.error("Failed to logout the user due to : ", error);
      window.alert("Failed to logout the user, please try again!!");
    }
  };

  const navigateHomePageAgain = () => {
    navigate("/restaurentownerdashboard");
  };

  return (
    <>
      <div id="resOwnNavBar">
        <h4 id="ownNavHeading">ROUSTUF</h4>
        <button id="ownNavLogoutButton" onClick={handleLogoutUser}>
          Log-Out
        </button>
        <button id="homePageButton" onClick={navigateHomePageAgain}>
          Home
        </button>
      </div>
    </>
  );
};

export default ResOwnNav;
