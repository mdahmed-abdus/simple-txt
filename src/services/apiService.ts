import axios, { AxiosResponse } from 'axios';

const BASE_URL = '/api';

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

export const sendVerificationEmail = (email: string) =>
  apiHandler(() => http.post('/users/email/resend', { email }));

export const verifyEmail = (tokenId: string) =>
  apiHandler(() => http.post(`/users/email/verify?tokenId=${tokenId}`));

export const sendPasswordResetEmail = (email: string) =>
  apiHandler(() => http.post('/users/password/forgot', { email }));

export const resetPassword = (
  tokenId: string,
  resetPasswordData: { password: string; confirmPassword: string }
) =>
  apiHandler(() =>
    http.post(`/users/password/reset?tokenId=${tokenId}`, resetPasswordData)
  );

export const getEncAndDec = (data: string, password: string) =>
  apiHandler(() => http.post('/crypto/both', { data, password }));

export const lockNote = (id: string, notePassword: string) =>
  apiHandler(() => http.post(`/notes/${id}/lock`, { notePassword }));

export const unlockNote = (id: string, notePassword: string) =>
  apiHandler(() => http.post(`/notes/${id}/unlock`, { notePassword }));

export const viewLockedNote = (id: string, notePassword: string) =>
  apiHandler(() => http.post(`/notes/${id}/view-locked`, { notePassword }));
