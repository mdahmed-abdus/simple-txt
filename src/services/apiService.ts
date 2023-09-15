import axios, { AxiosResponse } from 'axios';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
const USER_URL = BASE_URL + '/users';

type apiFuncType = () => Promise<AxiosResponse<any, any>>;

const apiHandler = async (apiFunc: apiFuncType) => {
  try {
    const response = await apiFunc();
    return response.data;
  } catch (error: any) {
    // the request was made and the server responded with a status code that falls out of the range of 2xx
    if (error.response) {
      throw new Error(error.response.data.message);
    }
    // something happened in setting up the request that triggered an error
    console.log('Error', error.message);
    throw new Error('Something went wrong');
  }
};

export const getUserData = () => apiHandler(() => axios.get(`${USER_URL}/`));

export const registerUser = (registerUserData: {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}) => apiHandler(() => axios.post(`${USER_URL}/register`, registerUserData));

export const loginUser = (loginUserData: { email: string; password: string }) =>
  apiHandler(() => axios.post(`${USER_URL}/login`, loginUserData));

export const logoutUser = () =>
  apiHandler(() => axios.post(`${USER_URL}/logout`));
