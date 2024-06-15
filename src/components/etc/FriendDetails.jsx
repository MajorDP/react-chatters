import styles from "./FriendDetails.module.css";
function FriendDetails({ selectedFriend }) {
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
          <button className={styles.removeBtn}>Remove friend</button>
          <button className={styles.blockBtn}>Block</button>
        </div>
      </div>
    </div>
  );
}

export default FriendDetails;
