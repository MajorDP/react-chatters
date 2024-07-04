import { io } from "socket.io-client";
import { useContext, useEffect, useRef, useState } from "react";
import styles from "./OpenedChat.module.css";
import {
  useGetFriendsChat,
  useSendMessage,
} from "../../services/useChatQueries";
import { useQueryClient } from "react-query";
import { useForm } from "react-hook-form";
import { Context } from "./ChatContainer";

function OpenedChat() {
  const { selectedFriend, currentUser, setUserDetails, userDetails } =
    useContext(Context);

  const { register, handleSubmit, reset } = useForm();

  const selectedFriendId = selectedFriend.friend.friendId;
  const currentUserId = currentUser.id;
  const { isLoading, data, error } = useGetFriendsChat(
    selectedFriendId,
    currentUserId
  );

  const chatRef = useRef(null);

  //scroll the chat to the bottom
  useEffect(() => {
    const scrollableDiv = chatRef.current;
    if (scrollableDiv) {
      scrollableDiv.scrollTop = scrollableDiv.scrollHeight;
    }
  }, [data]);

  const queryClient = useQueryClient();
  const socket = io("http://localhost:3000");

  const { mutate: send, data: msgData, error: sendMsgErr } = useSendMessage();

  if (isLoading) return <div>Loading chat...</div>;

  const currentChat =
    data?.friendChats?.chats.length > 0 ? data.friendChats.chats : [];

  //CHATROOM ID FOR SOCKET.IO TO MAKE THE CHAT WORK IN REAL TIME
  const currentChatRoom = data.friendChats?.chatRoom;
  const friendId = selectedFriendId;

  socket.on("connect", () => {
    //the client receives this from the server
    socket.on("received-message", (chatRoom) => {
      //making sure the socket only invalidates the queries of the users inside the chat room (the 2 users that text each other)
      if (chatRoom === currentChatRoom) {
        queryClient.invalidateQueries("currentChat", friendId, currentUserId);
      }
    });
  });

  const chatRoom = data.friendChats?.chatRoom;
  function onSend(data) {
    const messageImg = data.messageImg[0];
    const message = data.message;

    if (message === "" && messageImg === undefined) return;

    send(
      { message, messageImg, currentUserId, friendId: selectedFriendId },
      {
        onSettled: () => {
          socket.emit("message-sent", chatRoom); //upon finishing the posting query (send) for the message, the client-side emits a "message-sent" signal to the server
        },
      }
    );
    reset();
  }

  function onError() {
    console.log("ERR");
  }

  if (!chatRoom) return;

  return (
    <div className={styles.container}>
      <h3>
        {selectedFriend.friend.friendUsername}{" "}
        <button
          className={styles.detailsButton}
          onClick={() => setUserDetails(!userDetails)}
        >
          {userDetails === false ? "See details" : "Hide details"}
        </button>
      </h3>
      <div
        className={`${styles.chat} ${userDetails ? styles.isOtherShown : ""}`}
      >
        <div className={styles.chatMessages} ref={chatRef}>
          {currentChat.length > 0 &&
            currentChat.map((message, index) =>
              message.userId !== currentUser.id ? (
                <div className={styles.friendMessage} key={index}>
                  <img
                    className={styles.userImg}
                    src={selectedFriend.friend.friendImg}
                    alt="Friend"
                  />
                  <div className={styles.msgContentFriend}>
                    <p className={styles.date}>{message.date}</p>
                    <p className={styles.message}>{message.message}</p>
                    {message.messageImg && (
                      <img src={message.messageImg} alt="Image couldn't load" />
                    )}
                  </div>
                </div>
              ) : (
                <div className={styles.userMessage} key={index}>
                  <div className={styles.msgContentUser}>
                    <p className={styles.date}>{message.date}</p>
                    <p className={styles.message}>
                      {message.message}{" "}
                      {message.messageImg && (
                        <img
                          src={message.messageImg}
                          alt="Image couldn't load"
                        />
                      )}
                    </p>
                  </div>
                  <img
                    className={styles.userImg}
                    src={currentUser.userImg}
                    alt="User"
                  />
                </div>
              )
            )}
        </div>
        <div className={styles.chatInput}>
          <form type="submit" onSubmit={handleSubmit(onSend, onError)}>
            <label htmlFor="files">📁</label>
            <input
              id="files"
              type="file"
              accept="image/png, image/jpeg"
              className={styles.fileInput}
              {...register("messageImg", {
                required: false,
              })}
            />
            <input
              className={styles.textInput}
              type="text"
              {...register("message", {
                required: false,
              })}
            />
          </form>
        </div>
      </div>
    </div>
  );
}

export default OpenedChat;
