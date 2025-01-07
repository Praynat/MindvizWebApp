import { jwtDecode } from "jwt-decode";

const TokenName="MindvizToken"


export const setTokenInLocalStorage = (encryptedToken)=>{

  if (typeof encryptedToken === "object") {
    encryptedToken = JSON.stringify(encryptedToken);
  }
    localStorage.setItem(TokenName, encryptedToken)
    }

export const removeToken = ()=> localStorage.removeItem(TokenName);

export const getToken = ()=>localStorage.getItem(TokenName);

export const getUser = () => {
    try {
      const myToken = getToken();
      return jwtDecode(myToken);
    } catch (error) {
      return null;
    }
  };