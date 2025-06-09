import { createSlice } from '@reduxjs/toolkit';
import CryptoJS from 'crypto-js';

const SECRET_KEY = process.env.REACT_APP_JWT_SECRET; 

const encryptedSession = localStorage.getItem('session');
let decryptedSession = null;

if (encryptedSession) {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedSession, SECRET_KEY);
    decryptedSession = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  } catch (error) {
    console.error('Error decrypting session:', error);
  }
}

const sessionSlice = createSlice({
  name: 'session',
  initialState: {
    session: decryptedSession,
  },
  reducers: {
    setSession: (state, action) => {
      state.session = action.payload;
      const encrypted = CryptoJS.AES.encrypt(
        JSON.stringify(action.payload),
        SECRET_KEY
      ).toString();
      localStorage.setItem('session', encrypted);
    },
    logout: (state) => {
      state.session = null;
      localStorage.removeItem('session');
    },
  },
});

export const { setSession, logout } = sessionSlice.actions;
export default sessionSlice.reducer;
