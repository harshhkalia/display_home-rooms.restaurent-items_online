import "./OwnerOfHomeNav.css";

const HomeOwnNav = ({ onLogOutPress }) => {
  return (
    <>
      <div id="homeOwnerNav">
        <h4 id="ownNavHeading">ROUSTUF</h4>
        <button id="logoutBtnHO" onClick={onLogOutPress}>
          Log Out
        </button>
      </div>
    </>
  );
};

export default HomeOwnNav;
