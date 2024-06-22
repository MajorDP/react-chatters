import { useContext } from "react";
import styles from "./Chat.module.css";
import OpenedChat from "./OpenedChat";
import { Context } from "./ChatContainer";

function Chat() {
  const { userDetails } = useContext(Context);
  return (
    <div
      className={`${styles.container} ${
        userDetails ? styles.isOtherShown : ""
      }`}
    >
      <OpenedChat />
    </div>
  );
}

export default Chat;
