import axios from "axios";


const apiUrl=" https://localhost:7048/users"
export const login = async(userLogin)=>{
    try {
        const response = await axios.post(apiUrl+"/login",userLogin);
              const data =response.data;
        return data
        
    } catch (err) {
        throw new Error(err.message)
    }
    }

export const signup = async (normalizedUser) => {
  try {
    const { data } = await axios.post(apiUrl, normalizedUser);
    return data;
  } catch (err) {
    throw new Error(err.message);
  }
};

export const getUserData = async (id) => {
  try {
    const { data } = await axios.get(`${apiUrl}/${id}`);
    return data;
  } catch (err) {
    throw new Error(err.message);
  }
};

export const updateUserData = async (id,normalizedUser) => {
  try {
    const { data } = await axios.put(`${apiUrl}/${id}`,normalizedUser);
    return data;
  } catch (err) {
    throw new Error(err.message);
  }
};

export const getAllUsersData = async () => {
 
  try {
    const { data } = await axios.get(apiUrl);
    return data;
  } catch (err) {
    throw new Error(err.message);
  }
};
