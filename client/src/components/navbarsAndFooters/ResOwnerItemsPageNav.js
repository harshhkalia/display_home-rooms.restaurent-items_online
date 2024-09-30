import { useNavigate } from "react-router-dom";

const ResOwnItemPageNav = () => {
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

  const navigateResOwnSettings = () => {
    navigate("/restaurentownersettingspage");
  };

  return (
    <>
      <div id="resOwnNavBar">
        <h4 id="ownNavHeading">ROUSTUF</h4>
        <button id="ownNavLogoutButton" onClick={handleLogoutUser}>
          Log-Out
        </button>
        <button id="settingsButton" onClick={navigateResOwnSettings}>
          Settings
        </button>
      </div>
    </>
  );
};

export default ResOwnItemPageNav;
