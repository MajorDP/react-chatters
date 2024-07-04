/* eslint-disable no-unused-vars */
import { useContext, useState } from "react";
import styles from "./FriendList.module.css";

import {
  useAcceptFriendRequest,
  useGetFriends,
  useSendFriendRequest,
} from "../../services/useChatQueries";
import { useQueryClient } from "react-query";
import toast from "react-hot-toast";
import Friend from "./Friend";
import { Context } from "./ChatContainer";
function FriendList() {
  const { setSelectedFriend, currentUser } = useContext(Context);

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
    e.preventDefault();

    if (username === "") {
      return;
    }
    if (username === currentUserUsername) {
      setUsername("");
      return;
    }
    if (currentFriendList.some((obj) => obj.friendUsername === username)) {
      toast.error(`You are already friends with ${username}`);
      setUsername("");
      return;
    }

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
            value={username}
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
          <Friend
            currentUserId={currentUser.id}
            friend={friend}
            setSelectedFriend={setSelectedFriend}
            key={friend.friendId}
          />
        ))}
      </ul>
    </div>
  );
}

export default FriendList;
