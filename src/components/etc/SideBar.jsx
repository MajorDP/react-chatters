import FriendList from "../chat/FriendList";
import UserSection from "../chat/UserSection";
import styles from "./SideBar.module.css";

function SideBar() {
  return (
    <div className={styles.container}>
      <UserSection />
      <FriendList />
    </div>
  );
}

export default SideBar;
