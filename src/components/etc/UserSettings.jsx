import { useEffect } from "react";
import UserSection from "../chat/UserSection";
import styles from "./UserSettings.module.css";
import { useNavigate } from "react-router-dom";
import FriendList from "../chat/FriendList";
import { useForm } from "react-hook-form";
import { logOut, updateUser } from "../../services/userAuth";
import { useUpdateUser } from "../../services/useUserAuth";
import toast from "react-hot-toast";
function UserSettings() {
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm();
  const { mutate: updateUser, data, error } = useUpdateUser();

  //making sure a user is logged in before proceeding further
  const user = JSON.parse(sessionStorage.getItem("user"));

  useEffect(
    function () {
      if (user === null) {
        navigate("/"); //if no user is logged in, we are redirected to /auth
      }
    },
    [navigate, user]
  );

  function onChange(data) {
    const userImg = data.userPfp[0];
    const userDesc = data.userDesc;
    const userId = user.id;

    updateUser({ userImg, userDesc, userId });
  }

  function onError(err) {
    console.error(err);
  }

  function onLogOut() {
    logOut();
    navigate("/");
    toast.success("Logging out...");
  }
  return (
    <div className={styles.container}>
      <h3>{user.username} </h3>

      <form
        className={styles.userInfo}
        onSubmit={handleSubmit(onChange, onError)}
      >
        <div className={styles.pfp}>
          <img src={user.userImg} alt="" />
          <label htmlFor="pfp">Change profile picture</label>
          <input
            id="pfp"
            type="file"
            hidden
            {...register("userPfp", {
              required: false,
            })}
          />
        </div>
        <div>
          <p>Username: {user.username}</p>
          <p>Email: ****{user.email.substr(4)}</p>
          <p>
            Description:{" "}
            <input
              placeholder="Enter new description"
              {...register("userDesc", {
                required: false,
              })}
            />
            <label className={styles.infoLabel}>
              Leave empty to keep old description
            </label>
          </p>
          <button type="submit">Save Changes</button>
        </div>
      </form>
      <button className={styles.logOutBtn} onClick={() => onLogOut()}>
        Log out
      </button>
    </div>
  );
}

export default UserSettings;
