import { io } from "socket.io-client";
import { useState } from "react";
import styles from "./OpenedChat.module.css";
import {
  useGetFriendsChat,
  useSendMessage,
} from "../../services/useChatQueries";
import { useQueryClient } from "react-query";

function OpenedChat({ selectedFriend, currentUser }) {
  const queryClient = useQueryClient();
  const socket = io("http://localhost:3000");

  const selectedFriendId = selectedFriend.friend.friendId;

  const currentUserId = currentUser.id;

  const [message, setMessage] = useState("");

  const { isLoading, data, error } = useGetFriendsChat(
    selectedFriendId,
    currentUserId
  );

  const { mutate: send, data: msgData, error: sendMsgErr } = useSendMessage();

  if (isLoading) return <div>Loading chat...</div>;

  const currentChat =
    data.friendChats.chats.length > 0 ? data.friendChats.chats : [];

  //CHATROOM ID FOR SOCKET.IO TO MAKE THE CHAT WORK IN REAL TIME
  const currentChatRoom = data.friendChats.chatRoom;
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

  const chatRoom = data.friendChats.chatRoom;
  function onSend(e, message) {
    e.preventDefault();
    if (message === "") return;

    send(
      { message, currentUserId, friendId: selectedFriendId },
      {
        onSettled: () => {
          socket.emit("message-sent", chatRoom); //upon finishing the posting query (send) for the message, the client-side emits a "message-sent" signal to the server
        },
      }
    );
    setMessage("");
  }

  return (
    <div className={styles.container}>
      <h3>{selectedFriend.friend.friendUsername}</h3>
      <div className={styles.chat}>
        <div className={styles.chatMessages}>
          {currentChat.length > 0 &&
            currentChat.map((message, index) =>
              message.userId !== currentUser.id ? (
                <div className={styles.friendMessage} key={index}>
                  <img
                    className={styles.userImg}
                    src={selectedFriend.friend.friendImg}
                    alt="FriendImg"
                  />
                  <div className={styles.msgContentFriend}>
                    <p className={styles.date}>{message.date}</p>
                    <p className={styles.message}>{message.message}</p>
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

          {/* <div className={styles.friendMessage}>
          <img
          className={styles.userImg}
          src="../../public/friendImg1.jpg"
          alt="Friend"
          />
          <div className={styles.msgContentFriend}>
          <p className={styles.date}>date</p>
          <p className={styles.message}>
          <img src="../../public/friendImg1.jpg" alt="Friend" />
          </p>
          </div>
          </div>
          
          <div className={styles.userMessage}>
          <div className={styles.msgContentUser}>
          <p className={styles.date}>date</p>
          <p className={styles.message}>
          <img src="../../public/friendImg1.jpg" alt="Friend" />
          You bet i have it
          </p>
          </div>
          <img
          className={styles.userImg}
          src="../../public/friendImg1.jpg"
          alt="User"
          />
          </div> */}
        </div>
        <div className={styles.chatInput}>
          <form type="submit" onSubmit={(e) => onSend(e, message)}>
            <input
              className={styles.chatInput}
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </form>
        </div>
      </div>
    </div>
  );
}

export default OpenedChat;
