import { useState } from "react";
import styles from "./FriendList.module.css";

import {
  useAcceptFriendRequest,
  useGetFriends,
  useSendFriendRequest,
} from "../../services/useChatQueries";
import { useQueryClient } from "react-query";
function FriendList({ setSelectedFriend, currentUser }) {
  const queryClient = useQueryClient();
  const [username, setUsername] = useState("");

  const currentUserId = currentUser.id;
  const currentUserUsername = currentUser.username;
  const { isLoading, data, error } = useGetFriends(currentUserId);
  const {
    mutate: acceptFriend,
    data: friendData,
    error: friendErr,
  } = useAcceptFriendRequest();

  const {
    mutate: sendRequest,
    data: friendReqData,
    error: friendReqErr,
  } = useSendFriendRequest();

  if (isLoading) return <div>Loading friends...</div>;

  const currentFriendList = data.friendList.friends;
  const currentFriendReqs = data.friendList.requests;

  function handleSendFriendReq(e, username) {
    if (username === currentUserUsername) return;
    e.preventDefault();
    sendRequest({ username, currentUserId, currentUserUsername });

    setUsername("");
  }

  function handleAcceptFriendReq(friendId, currentUserId, req) {
    acceptFriend(
      { friendId, currentUserId, req },
      {
        onSettled: () =>
          queryClient.invalidateQueries(["friendList", currentUserId]),
      }
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.friendOptions}>
        <form onSubmit={(e) => handleSendFriendReq(e, username)}>
          <button type="submit">
            <span className={styles.emoji}>➕</span>
          </button>
          <input
            placeholder="Add a friend..."
            onChange={(e) => setUsername(e.target.value)}
          />
        </form>
      </div>
      {currentFriendReqs !== null && (
        <p className={styles.friendsLabel}>Friend requests</p>
      )}
      {currentFriendReqs !== null && (
        <ul className={styles.requests}>
          {currentFriendReqs.map((req) => (
            <li key={req.friendId}>
              <span>{req.friendUsername}</span>
              <div>
                <button
                  onClick={() =>
                    handleAcceptFriendReq(req.friendId, currentUserId, req)
                  }
                >
                  ✔
                </button>{" "}
                <button>❌</button>
              </div>
            </li>
          ))}
        </ul>
      )}
      <p className={styles.friendsLabel}>Your Friends</p>
      <ul>
        {currentFriendList.map((friend) => (
          <li
            key={friend.friendId}
            className={styles.friend}
            onClick={(selectedFriend) => setSelectedFriend({ friend })}
          >
            <img src={friend.friendImg} alt="userPic" />
            <div className={styles.friendInfo}>
              <p>{friend.friendUsername}</p>
              <p>{friend.friendDescription}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default FriendList;
