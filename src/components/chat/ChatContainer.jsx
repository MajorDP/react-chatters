import { createContext, useEffect, useState } from "react";
import FriendDetails from "../etc/FriendDetails";
import SideBar from "../etc/SideBar";
import Chat from "./Chat";
import styles from "./ChatContainer.module.css";
import { useNavigate } from "react-router-dom";
import UserSettings from "../etc/UserSettings";

export const Context = createContext();
function ChatContainer() {
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState(null);

  //making sure a user is logged in before proceeding further
  const currentUser = JSON.parse(sessionStorage.getItem("user"));

  useEffect(
    function () {
      if (currentUser === null) {
        navigate("/"); //if no user is logged in, we are redirected to /auth
      }
    },
    [navigate, currentUser]
  );

  //returning a loader needed so that there are no errors between mounting the component and useEffect taking action
  if (!currentUser) return <div>Loading...</div>;

  return (
    <Context.Provider
      value={{
        selectedFriend,
        setSelectedFriend,
        currentUser,
        userDetails,
        setUserDetails,
      }}
    >
      <div className={styles.container}>
        <SideBar />
        {selectedFriend === currentUser.id && <UserSettings />}
        {selectedFriend !== null && selectedFriend !== currentUser.id && (
          <>
            <Chat />
            {userDetails && <FriendDetails />}
          </>
        )}
      </div>
    </Context.Provider>
  );
}

export default ChatContainer;
