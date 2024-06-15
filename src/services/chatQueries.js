import supabase from "./supabase";

export async function getFriends(currentUserId) {
  let { data: friendList, error } = await supabase
    .from("friendLists")
    .select("*")
    .eq("id", currentUserId)
    .select()
    .single();

  return { friendList, error };
}

export async function getFriendChat(friendId, userId) {
  let { data: friendChats, error } = await supabase
    .from("userChats")
    .select("*")
    .eq("friendId", friendId)
    .eq("userId", userId)
    .single();

  return { friendChats, error };
}

export async function sendFriendRequest({ username }) {
  let { data: currRequests, error } = await supabase
    .from("friendLists")
    .select("requests")
    .eq("username", username)
    .single();

  const currentUser = JSON.parse(sessionStorage.getItem("user"));

  const currentUserObj = {
    friendId: currentUser.id,
    friendUsername: currentUser.username,
    friendDescription: currentUser.description,
    friendImg: currentUser.userImg,
  };

  let newRequests = null;

  if (currRequests.requests !== null)
    newRequests = [...currRequests.requests, currentUserObj];
  else newRequests = [currentUserObj];

  const { data, error: sendReqError } = await supabase
    .from("friendLists")
    .update({ requests: newRequests })
    .eq("username", username)
    .select();
}

export async function acceptFriendRequest({ friendId, currentUserId, req }) {
  //accepting the new friend's user info (id,username, description, image) through the req obj

  //requesting the new friend's friend list via ID
  let { data: friend, error: friendFriendsErr } = await supabase
    .from("friendLists")
    .select("friends")
    .eq("id", friendId)
    .single();

  if (friendFriendsErr) throw friendFriendsErr;

  //getting current user's information to form his object for the new friend's friend list
  const currentUser = JSON.parse(sessionStorage.getItem("user"));

  const currentUserObj = {
    friendId: currentUser.id,
    friendUsername: currentUser.username,
    friendDescription: currentUser.description,
    friendImg: currentUser.userImg,
  };

  //forming the object with the friend's information for the current user's friend list
  const friendUserObj = {
    friendId: req.friendId,
    friendUsername: req.friendUsername,
    friendDescription: req.friendDescription,
    friendImg: req.friendImg,
  };

  //creating the object for the friend list of both the user and the new friend
  const friendFriendsObj = [...friend.friends, currentUserObj];

  let { data: currentUserFriends, error: userFriendsErr } = await supabase
    .from("friendLists")
    .select("friends")
    .eq("id", currentUserId)
    .single();

  if (userFriendsErr) throw userFriendsErr;

  const currentUserFriendsObj = [...currentUserFriends.friends, friendUserObj];

  //updating both users' friend lists
  const { data: newFriendFrienList, error: newFriendFrienListErr } =
    await supabase
      .from("friendLists")
      .update({ friends: friendFriendsObj })
      .eq("id", friendId);

  if (newFriendFrienListErr) throw newFriendFrienListErr;

  const { data: newUserFriendList, error: newUserFriendListErr } =
    await supabase
      .from("friendLists")
      .update({ friends: currentUserFriendsObj })
      .eq("id", currentUserId);

  if (newUserFriendListErr) throw newUserFriendListErr;

  //creating a new chat for each user to access in the userChats database table

  const chatRoom = Math.random();
  let keyIdOne = new Date().toDateString().replaceAll(" ", Math.random());
  const { data: userChat, error: userChatErr } = await supabase
    .from("userChats")
    .insert([
      {
        id: keyIdOne,
        chats: [],
        friendId: friendId,
        userId: currentUserId,
        chatRoom: chatRoom,
      },
    ])
    .select();

  if (userChatErr) throw userChatErr;

  let keyIdTwo = new Date().toDateString().replaceAll(" ", Math.random());
  const { data: friendChat, error: friendChatErr } = await supabase
    .from("userChats")
    .insert([
      {
        id: keyIdTwo,
        chats: [],
        friendId: currentUserId,
        userId: friendId,
        chatRoom: chatRoom,
      },
    ])
    .select();
  if (friendChatErr) throw friendChatErr;

  //removing friend request after accepting it
  let { data: userFriendReqs, error: userFriendReqsErr } = await supabase
    .from("friendLists")
    .select("requests")
    .eq("id", currentUserId);

  const newRequests = userFriendReqs[0].requests.filter(
    (req) => req.friendId !== friendId
  );

  const { data, error } = await supabase
    .from("friendLists")
    .update({ requests: newRequests })
    .eq("id", currentUserId)
    .select();
}

export async function sendMessage({ message, currentUserId, friendId }) {
  //getting the chat of the users (both are the same)
  let { data: userChat, error } = await supabase
    .from("userChats")
    .select("chats")
    .eq("userId", currentUserId)
    .eq("friendId", friendId);

  if (error) throw updateErr;

  //forming new message object
  const currentChat = userChat[0].chats;
  const date = new Date().toDateString();

  const newMessage = {
    userId: currentUserId,
    date: date,
    message: message,
  };

  //updating the chat array
  currentChat.push(newMessage);

  //updating both users' chat logs in database with the update chat array
  const { data: dataOne, error: updateErr } = await supabase
    .from("userChats")
    .update({ chats: currentChat })
    .eq("userId", currentUserId)
    .eq("friendId", friendId)
    .select();

  if (updateErr) throw updateErr;

  const { data: dataTwo, error: updateErrTwo } = await supabase
    .from("userChats")
    .update({ chats: currentChat })
    .eq("userId", friendId)
    .eq("friendId", currentUserId)
    .select();

  if (updateErrTwo) throw updateErrTwo;
}
