import { useMutation, useQuery, useQueryClient } from "react-query";
import {
  acceptFriendRequest,
  getFriendChat,
  getFriends,
  removeFriend,
  sendFriendRequest,
  sendMessage,
} from "./chatQueries";
import toast from "react-hot-toast";

export function useGetFriends(currentUserId) {
  const { isLoading, data, error } = useQuery({
    queryKey: ["friendList", currentUserId],
    queryFn: () => getFriends(currentUserId),
  });

  return { isLoading, data, error };
}

export function useGetFriendsChat(friendId, currentUserId) {
  const { isLoading, data, error } = useQuery({
    queryKey: ["currentChat", friendId, currentUserId],
    queryFn: () => getFriendChat(friendId, currentUserId),
  });

  return { isLoading, data, error };
}

export function useSendFriendRequest() {
  const { mutate, data, error } = useMutation({
    mutationFn: ({ username, currentUserId, currentUserUsername }) =>
      sendFriendRequest({ username, currentUserId, currentUserUsername }),
    onSuccess: () => toast.success("Friend request sent."),
    onError: () => toast.error("Friend request could not be sent."),
  });

  return { mutate, data, error };
}

export function useAcceptFriendRequest() {
  const { mutate, data, error } = useMutation({
    mutationFn: ({ friendId, currentUserId, req }) =>
      acceptFriendRequest({ friendId, currentUserId, req }),
    onSuccess: () => {
      toast.success("Friend request accepted.");
    },
    onError: (error) => toast.error(error.message),
  });

  return { mutate, data, error };
}

export function useSendMessage() {
  const queryClient = useQueryClient();
  const { mutate, data, error } = useMutation({
    mutationFn: ({ message, messageImg, currentUserId, friendId }) =>
      sendMessage({ message, messageImg, currentUserId, friendId }),
    onSuccess: () => queryClient.invalidateQueries("currentChat"),
    onError: () => toast.error("Message could not be sent."),
  });

  return { mutate, data, error };
}

export function useRemoveFriend() {
  const queryClient = useQueryClient();
  const { mutate, data, error } = useMutation({
    mutationFn: ({ currentUserId, currentFriendId }) =>
      removeFriend({ currentUserId, currentFriendId }),
    onSuccess: () => {
      toast.success("Friend succesfully removed.");
      queryClient.invalidateQueries("friendList");
    },
    onError: () => toast.error("Friend could not be removed."),
  });

  return { mutate, data, error };
}
