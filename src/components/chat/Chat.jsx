import ChatIntro from "../etc/ChatIntro";
import styles from "./Chat.module.css";
import OpenedChat from "./OpenedChat";

function Chat({ selectedFriend, currentUser }) {
  return (
    <div className={styles.container}>
      {<OpenedChat selectedFriend={selectedFriend} currentUser={currentUser} />}
    </div>
  );
}

export default Chat;
