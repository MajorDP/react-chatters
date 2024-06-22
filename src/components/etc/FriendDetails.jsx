import { useContext } from "react";
import { useRemoveFriend } from "../../services/useChatQueries";
import styles from "./FriendDetails.module.css";
import { Context } from "../chat/ChatContainer";
function FriendDetails() {
  const { setSelectedFriend, selectedFriend, currentUser } =
    useContext(Context);

  const currentUserId = currentUser.id;

  const { mutate: removeFriend, data, error } = useRemoveFriend();
  const currentFriendId = selectedFriend.friend.friendId;

  function onRemove(currentUserId, currentFriendId) {
    removeFriend({ currentUserId, currentFriendId });
    setSelectedFriend(null);
  }

  return (
    <div className={styles.container}>
      <div className={styles.friendInfo}>
        <img src={selectedFriend.friend.friendImg} />
        <h3>{selectedFriend.friend.friendUsername}</h3>
        <p>
          you and <span>{selectedFriend.friend.friendUsername}</span> have been
          friends since: 25.05.2024
        </p>
        <p>Description: {selectedFriend.friend.friendDescription}</p>
        <div className={styles.friendOptions}>
          <button
            className={styles.removeBtn}
            onClick={() => onRemove(currentUserId, currentFriendId)}
          >
            Remove friend
          </button>
        </div>
      </div>
    </div>
  );
}

export default FriendDetails;
