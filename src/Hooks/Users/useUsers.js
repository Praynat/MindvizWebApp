import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUser, removeToken, setTokenInLocalStorage } from "../../Services/Users/localStorageService";
import { updateUserData, login, signup } from "../../Services/Users/usersApiService";
import { useCallback } from "react";
import ROUTES from "../../Routes/routesModel";
import { useSnack } from "../../Providers/Utils/SnackbarProvider";
import { useMyUser } from "../../Providers/Users/UserProvider";
import normalizeUser from "../../Helpers/Users/normalization/normalizeUser";
import normalizeUpdateUser from "../../Helpers/Users/normalization/normalizeUpdateUser";

const useUsers=()=> {
    const [isLoading, setIsLoading] = useState();
    const [error, setError] = useState(null);
    const setSnack = useSnack();



    const {  setToken, setUser }=useMyUser();
    const navigate = useNavigate();

    const handleLogin = useCallback(
        async (userLogin) => {
          setIsLoading(true);
          try {
            const token = await login(userLogin);
            setTokenInLocalStorage(token);
            setToken(token);
            setUser(getUser());
            navigate(ROUTES.CARDS);
          } catch (error) {
            setError(error.message);
          }
          setIsLoading(false);
        },
        [setToken, setUser, navigate]
      );

    const handleLogout = useCallback(() => {
        removeToken();
        setUser(null);
      }, [setUser]);

      
    const handleSignup = useCallback(
      async (userFromClient) => {
        setIsLoading(true);
        try {
          const normalizedUser = normalizeUser(userFromClient);
          await signup(normalizedUser);
          await handleLogin({
            email: userFromClient.email,
            password: userFromClient.password,
          });
        } catch (error) {
          setError(error.message);
        }
        setIsLoading(false);
      },
      [handleLogin]
    );
    const handleContact =useCallback(() => {
      setSnack("success", "Message sent successfully");
      
    }, [setSnack]); 

    const handleUserUpdate=useCallback(
      async (userFromClient,id) => {
        setIsLoading(true);
        try {
          const normalizedUser = normalizeUpdateUser(userFromClient);
          await updateUserData(id,normalizedUser);
          setSnack("success", "User updated successfully");
          setTimeout(() => {
            window.location.reload();
          }, 500);
        } catch (error) {
          setError(error.message);
        }
        setIsLoading(false);
      },
      [setSnack]
    );


      
return{isLoading, error, handleLogin, handleLogout, handleSignup,handleContact,handleUserUpdate }
}
export default useUsers

