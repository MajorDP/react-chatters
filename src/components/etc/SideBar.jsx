import FriendList from "../chat/FriendList";
import UserSection from "../chat/UserSection";
import styles from "./SideBar.module.css";

function SideBar({ setSelectedFriend, currentUser }) {
  return (
    <div className={styles.container}>
      <UserSection currentUser={currentUser} />
      <FriendList
        setSelectedFriend={setSelectedFriend}
        currentUser={currentUser}
      />
    </div>
  );
}

export default SideBar;
