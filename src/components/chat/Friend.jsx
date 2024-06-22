/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import styles from "./FriendList.module.css";
import { getDescription, getImage } from "../../services/chatQueries";
function Friend({ friend, setSelectedFriend }) {
  const [friendImg, setFriendImg] = useState("");
  const [friendDesc, setFriendDesc] = useState("");

  useEffect(
    function () {
      async function getFriendPfp() {
        const userPfp = await getImage(friend.friendId);
        const userDesc = await getDescription(friend.friendId);

        setFriendImg(userPfp.userPfp);
        setFriendDesc(userDesc.userDescription);
      }

      getFriendPfp();
    },
    [friend.friendId]
  );

  return (
    <li className={styles.friend} onClick={() => setSelectedFriend({ friend })}>
      <img src={friendImg} alt="userPic" />
      <div className={styles.friendInfo}>
        <p>{friend.friendUsername}</p>
        <p>{friendDesc}</p>
      </div>
    </li>
  );
}

export default Friend;
