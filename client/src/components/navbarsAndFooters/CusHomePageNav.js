import React, { useState } from "react";
import "./CusHomePageNav.css";

function CusHomePageNav({
  onCommentRepliesPress,
  onHomeBookmarkPress,
  onProfileBtnPress,
  onLogoutPress,
  onQueriesPress,
  onNotificationPress,
}) {
  const [settingOn, setSettingOn] = useState(false);

  return (
    <>
      <div id="homeOwnerNav">
        <h4 id="ownNavHeading">ROUSTUF</h4>
        {!settingOn && (
          <>
            <button id="settingsCusNavPage" onClick={() => setSettingOn(true)}>
              Settings
            </button>
            <button id="logoutCusNavPage" onClick={onLogoutPress}>
              Log Out
            </button>
            <button id="notificationCusNavPage" onClick={onNotificationPress}>
              Notifications
            </button>
          </>
        )}
        {settingOn && (
          <>
            <button id="homeNavButtons" onClick={() => setSettingOn(false)}>
              Go Back
            </button>
            <button
              id="settingsHomeCusEditProfileBtn"
              onClick={onProfileBtnPress}
            >
              Edit Profile
            </button>
            <button id="queriesBtnNav" onClick={onQueriesPress}>
              My Queries
            </button>
            <button id="bookmarksBtn" onClick={onHomeBookmarkPress}>
              Bookmarks
            </button>
            <button id="commentRepliesBtn" onClick={onCommentRepliesPress}>
              Comment Replies
            </button>
          </>
        )}
      </div>
    </>
  );
}

export default CusHomePageNav;
