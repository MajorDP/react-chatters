import supabase, { supabaseUrl } from "../services/supabase";

export async function register({ username, email, password }) {
  let { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        username,
      },
    },
  });

  if (error) throw error;

  const newUserId = data.user.id;
  const { data: newFriendList, error: newFriendListErr } = await supabase
    .from("friendLists")
    .insert([{ id: newUserId, friends: [], username, userDescription: "" }])
    .select();

  const currentUser = {
    id: data.user.id,
    email: data.user.email,
    username: data.user.user_metadata.username,
    userImg:
      "https://qyucvqgjipbnhwrlbgby.supabase.co/storage/v1/object/sign/userImages/default-user-img.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJ1c2VySW1hZ2VzL2RlZmF1bHQtdXNlci1pbWcuanBnIiwiaWF0IjoxNzE3NjAzNjAxLCJleHAiOjE3NDg1NjAzNjAxfQ.99d-ouEqZ6B5NsiGpLFINQPiHq0hQvV3HMDIMR_eemQ&t=2024-06-05T16%3A06%3A41.346Z",
    userDescription: "",
  };

  const { data: userPfp, error: userPfpErr } = await supabase
    .from("userPfps")
    .insert([
      {
        id: currentUser.id,
        userPfp:
          "https://qyucvqgjipbnhwrlbgby.supabase.co/storage/v1/object/sign/userImages/default-user-img.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJ1c2VySW1hZ2VzL2RlZmF1bHQtdXNlci1pbWcuanBnIiwiaWF0IjoxNzE3NjAzNjAxLCJleHAiOjE3NDg1NjAzNjAxfQ.99d-ouEqZ6B5NsiGpLFINQPiHq0hQvV3HMDIMR_eemQ&t=2024-06-05T16%3A06%3A41.346Z",
      },
    ])
    .select();

  localStorage.clear();

  return { currentUser, error };
}

export async function login({ email, password }) {
  let { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw error;

  let { data: userDesc, error: descErr } = await supabase
    .from("friendLists")
    .select("userDescription")
    .eq("id", data.user.id)
    .single();

  let { data: userPfps, error: userPfpErr } = await supabase
    .from("userPfps")
    .select("userPfp")
    .eq("id", data.user.id)
    .single();

  if (userPfpErr) throw userPfpErr;

  const currentUser = {
    id: data.user.id,
    email: data.user.email,
    username: data.user.user_metadata.username,
    userImg: userPfps.userPfp,
    description: userDesc.userDescription,
  };

  localStorage.clear();

  return { currentUser, error };
}

export async function logOut() {
  sessionStorage.clear();
}

export async function setDescription({ userId, description }) {
  const { data, error } = await supabase
    .from("friendLists")
    .update({ userDescription: description })
    .eq("id", userId)
    .select();

  let user = JSON.parse(sessionStorage.getItem("user"));
  user.description = description === "" ? "" : description;

  sessionStorage.setItem("user", JSON.stringify(user));
}

export async function updateUser({ userImg, userDesc, userId }) {
  if ((!userImg && !userDesc) || !userId) return;

  const user = JSON.parse(sessionStorage.getItem("user"));

  if (userImg !== undefined) {
    const imgName = `${Math.random()}-${userImg.name}`.replaceAll("/", "");
    const imgPath = `${supabaseUrl}/storage/v1/object/public/userImages/${imgName}`;

    const { error: storageError } = await supabase.storage
      .from("userImages")
      .upload(imgName, userImg); //posting image

    if (!storageError) {
      const { data, error } = await supabase
        .from("userPfps")
        .update({ userPfp: imgPath })
        .eq("id", userId);

      if (error) throw error;

      user.userImg = imgPath;
    } else throw storageError;

    sessionStorage.setItem("user", JSON.parse(user));
  }

  if (userDesc !== undefined) {
    console.log("aaa");
    const { data, error } = await supabase
      .from("friendLists")
      .update({ userDescription: userDesc })
      .eq("id", userId)
      .select();

    if (error) throw error;

    user.description = userDesc;
  }

  localStorage.setItem("user", user);
}
