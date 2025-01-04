import { jwtDecode } from "jwt-decode";

const Token="MindvizToken"


export const setTokenInLocalStorage = (encryptedToken)=>{

    localStorage.setItem(Token, encryptedToken)
    }

export const removeToken = ()=> localStorage.removeItem(Token);

export const getToken = ()=>localStorage.getItem(Token);

export const getUser = () => {
    try {
      const myToken = getToken();
      return jwtDecode(myToken);
    } catch (error) {
      return null;
    }
  };