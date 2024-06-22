/* eslint-disable no-unused-vars */
import { useMutation } from "react-query";
import { login, register, setDescription, updateUser } from "./userAuth";
import toast from "react-hot-toast";

export function useRegister() {
  const { mutate, data, error } = useMutation({
    mutationFn: ({ username, email, password }) =>
      register({ username, email, password }),
    onSuccess: () => toast.success(`Account successfully created, welcome.`),
    onError: (err) => toast.error(err.message),
  });

  return { mutate, data, error };
}

export function useLogin() {
  const { mutate, data, error } = useMutation({
    mutationFn: ({ email, password }) => login({ email, password }),
    onSuccess: () => toast.success("Login was successful, welcome."),
    onError: () => toast.error("User was not found."),
  });

  return { mutate, data, error };
}

export function useSetDescription() {
  const { mutate, data, errpr } = useMutation({
    mutationFn: ({ userId, description }) =>
      setDescription({ userId, description }),
    onSuccess: () => toast.success("Description was successfully changed."),
    onError: () => toast.error("Description could not be changed."),
  });

  return { mutate };
}

export function useUpdateUser() {
  const { mutate, data, error } = useMutation({
    mutationFn: ({ userImg, userDesc, userId }) =>
      updateUser({ userImg, userDesc, userId }),
    onSuccess: () =>
      toast.success(
        "Account was updated, please log in again to see the changes."
      ),
    onError: () => toast.error("Account could not be changed."),
  });

  return { mutate, data, error };
}
