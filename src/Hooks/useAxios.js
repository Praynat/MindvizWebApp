import axios from "axios";
import { useEffect } from "react";
import { useMyUser } from "../Providers/Users/UserProvider";
import { useSnack } from "../Providers/Utils/SnackbarProvider";

export default function useAxios() {
  const { token } = useMyUser();
  const setSnack = useSnack();

  useEffect(() => {
    axios.defaults.headers.common["Authorization"] = "Bearer "+token;

    const requestInterceptor = axios.interceptors.request.use((data) => {
      return Promise.resolve(data);
    });

    const responseInterceptor = axios.interceptors.response.use(
      null,
      (error) => {
        if (error.message) setSnack("error", error.message);
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.request.eject(requestInterceptor);
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, [token, setSnack]);
}