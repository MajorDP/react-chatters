import supabase from "../services/supabase";

export async function register({ username, email, password }) {
  let { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        username,
        userImg:
          "https://qyucvqgjipbnhwrlbgby.supabase.co/storage/v1/object/sign/userImages/default-user-img.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJ1c2VySW1hZ2VzL2RlZmF1bHQtdXNlci1pbWcuanBnIiwiaWF0IjoxNzE3NjAzNjAxLCJleHAiOjE3NDg1NjAzNjAxfQ.99d-ouEqZ6B5NsiGpLFINQPiHq0hQvV3HMDIMR_eemQ&t=2024-06-05T16%3A06%3A41.346Z",
        description: "",
      },
    },
  });

  if (error) throw error;

  const newUserId = data.user.id;
  const { data: newFriendList, error: newFriendListErr } = await supabase
    .from("friendLists")
    .insert([{ id: newUserId, friends: [], username }])
    .select();

  const currentUser = {
    id: data.user.id,
    email: data.user.email,
    username: data.user.user_metadata.username,
    userImg: data.user.user_metadata.userImg,
    description: data.user.user_metadata.description,
  };

  localStorage.clear();

  return { currentUser, error };
}

export async function login({ email, password }) {
  let { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;

  const currentUser = {
    id: data.user.id,
    email: data.user.email,
    username: data.user.user_metadata.username,
    userImg: data.user.user_metadata.userImg,
    description: data.user.user_metadata.description,
  };

  localStorage.clear();

  return { currentUser, error };
}
