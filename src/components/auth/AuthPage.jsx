/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unescaped-entities */
import { useState } from "react";
import styles from "./AuthPage.module.css";
import { useLogin, useRegister } from "../../services/useUserAuth";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

function AuthPage() {
  const navigate = useNavigate();

  const emailRegexp =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  const { mutate: register, data: regData, error: regError } = useRegister();
  const { mutate: login, data: loginData, error: loginError } = useLogin();

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [repass, setRepass] = useState("");

  function onRegister(e, username, email, password, repass) {
    e.preventDefault();

    if (username === "" || email === "" || password === "" || repass === "") {
      toast.error("Please fill all fields to register.");
      return;
    }

    if (password !== repass) {
      toast.error("Password and Repeat password do not match.");
      return;
    }

    if (emailRegexp.test(email) === false) {
      toast.error("Please enter a valid email address.");
      return;
    }

    register(
      { username, email, password },
      {
        onSettled: (data) => {
          sessionStorage.setItem("user", JSON.stringify(data.currentUser));
          navigate("/chat");
        },
      }
    );
  }

  async function onLogin(e, email, password) {
    e.preventDefault();

    if (email === "" || password === "") {
      toast.error("Please fill all fields to log in.");
      return;
    }

    login(
      { email, password },
      {
        onSettled: (data) => {
          sessionStorage.setItem("user", JSON.stringify(data.currentUser));
          navigate("/chat");
        },
      }
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.register}>
        <h2>Don't have an account?</h2>
        <form
          onSubmit={(e) => onRegister(e, username, email, password, repass)}
        >
          <div>
            <label htmlFor="regEmail">Email</label>
            <input
              id="regEmail"
              type="email"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="regPassword">Password</label>
            <input
              id="regPassword"
              type="password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="repass">Repeat password</label>
            <input
              id="repass"
              type="password"
              onChange={(e) => setRepass(e.target.value)}
            />
          </div>
          <button type="submit">Sign up</button>
        </form>
      </div>
      <div className={styles.login}>
        <h2>Already have an account?</h2>
        <form onSubmit={(e) => onLogin(e, email, password)}>
          <div>
            <label htmlFor="logEmail">Email</label>
            <input
              id="logEmail"
              type="email"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="logPassword">Password</label>
            <input
              id="logPassword"
              type="password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit">Sign in</button>
        </form>
      </div>
    </div>
  );
}

export default AuthPage;
