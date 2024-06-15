import styles from "./UserSection.module.css";
function UserSection({ currentUser }) {
  const mockUserData = {
    id: 1,
    username: "Asura",
    userImg: "../../public/135603657106.webp",
    description: "I am wrath",
  };
  return (
    <div className={styles.container}>
      <img src={currentUser.userImg} alt="userPic" />
      <div className={styles.userInfo}>
        <p>{currentUser.username}</p>
        {currentUser.description ? (
          <p>{currentUser.description}</p>
        ) : (
          <input placeholder="Add description" />
        )}{" "}
        {/*TODO: ADD DESCRIPTION */}
      </div>
    </div>
  );
}

export default UserSection;
