import axios, { AxiosResponse } from 'axios';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const http = axios.create({ baseURL: BASE_URL, withCredentials: true });

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

export const getUserData = () => apiHandler(() => http.get('/users/'));

export const registerUser = (registerUserData: {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}) => apiHandler(() => http.post('/users/register', registerUserData));

export const loginUser = (loginUserData: { email: string; password: string }) =>
  apiHandler(() => http.post('/users/login', loginUserData));

export const logoutUser = () => apiHandler(() => http.post('/users/logout'));

export const getAllNotes = () => apiHandler(() => http.get('/notes'));

export const addNewNote = (noteData: { title: string; body: string }) =>
  apiHandler(() => http.post('/notes', noteData));

export const getNoteById = (id: string) =>
  apiHandler(() => http.get(`/notes/${id}`));

export const updateNoteById = (
  id: string,
  noteData: { title: string; body: string }
) => apiHandler(() => http.put(`/notes/${id}`, noteData));

export const deleteNoteById = (id: string) =>
  apiHandler(() => http.delete(`/notes/${id}`));
