import { useEffect, useState } from "react";
import FriendDetails from "../etc/FriendDetails";
import SideBar from "../etc/SideBar";
import Chat from "./Chat";
import styles from "./ChatContainer.module.css";
import { useNavigate } from "react-router-dom";

function ChatContainer() {
  const navigate = useNavigate();
  const [selectedFriend, setSelectedFriend] = useState(null);

  //making sure a user is logged in before proceeding further
  const user = JSON.parse(sessionStorage.getItem("user"));

  useEffect(
    function () {
      if (user === null) {
        navigate("/"); //if no user is logged in, we are redirected to /auth
      }
    },
    [navigate, user]
  );

  //returning a loader needed so that there are no errors between mounting the component and useEffect taking action
  if (!user) return <div>Loading...</div>;

  return (
    <div className={styles.container}>
      <SideBar setSelectedFriend={setSelectedFriend} currentUser={user} />
      {selectedFriend !== null && (
        <>
          <Chat selectedFriend={selectedFriend} currentUser={user} />
          <FriendDetails selectedFriend={selectedFriend} />
        </>
      )}
    </div>
  );
}

export default ChatContainer;
