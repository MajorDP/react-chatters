/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import styles from "./FriendList.module.css";
import {
  getDescription,
  getImage,
  getIsSeen,
} from "../../services/chatQueries";
import { useGetIsSeen } from "../../services/useChatQueries";
function Friend({ friend, setSelectedFriend, currentUserId }) {
  const [friendImg, setFriendImg] = useState("");
  const [friendDesc, setFriendDesc] = useState("");
  const { data, isLoading } = useGetIsSeen(currentUserId, friend.friendId);

  useEffect(
    function () {
      async function getFriendInfo() {
        const userPfp = await getImage(friend.friendId);
        const userDesc = await getDescription(friend.friendId);

        setFriendImg(userPfp.userPfp);
        setFriendDesc(userDesc.userDescription);
      }

      getFriendInfo();
    },
    [friend.friendId]
  );

  if (isLoading) return <div>Loading...</div>;
  return (
    <li className={styles.friend} onClick={() => setSelectedFriend({ friend })}>
      <img src={friendImg} alt="userPic" />
      <div className={styles.friendInfo}>
        <p>{friend.friendUsername}</p>
        <p>{friendDesc}</p>
      </div>
      {data.isSeen === false && <span>🟡</span>}
    </li>
  );
}

export default Friend;
