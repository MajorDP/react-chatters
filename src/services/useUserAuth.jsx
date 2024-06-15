import { useMutation } from "react-query";
import { login, register } from "./userAuth";
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
