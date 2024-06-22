import { useContext, useState } from "react";
import styles from "./UserSection.module.css";
import { useSetDescription } from "../../services/useUserAuth";
import { useNavigate } from "react-router-dom";
import { Context } from "./ChatContainer";
function UserSection() {
  const { setSelectedFriend, currentUser } = useContext(Context);

  const navigate = useNavigate();
  const [description, setDesc] = useState(currentUser.description || "");
  const { mutate: changeDesc } = useSetDescription();

  async function updateDescription(e, description) {
    e.preventDefault();
    const userId = currentUser.id;
    changeDesc({ userId, description });
  }

  return (
    <div className={styles.container}>
      <img
        src={currentUser.userImg}
        alt="userPic"
        onClick={() => setSelectedFriend(currentUser.id)}
      />
      <div className={styles.userInfo}>
        <p>{currentUser.username}</p>
        {currentUser.description ? (
          <form onSubmit={(e) => updateDescription(e, description)}>
            <input
              maxLength="16"
              value={description}
              onChange={(e) => setDesc(e.target.value)}
            />
          </form>
        ) : (
          <form onSubmit={(e) => updateDescription(e, description)}>
            <input
              maxLength="16"
              placeholder="Add description"
              value={description}
              onChange={(e) => setDesc(e.target.value)}
            />
          </form>
        )}
      </div>
    </div>
  );
}

export default UserSection;
