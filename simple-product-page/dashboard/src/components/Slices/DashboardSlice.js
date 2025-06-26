import { createSlice } from '@reduxjs/toolkit';
import CryptoJS from 'crypto-js';

const SECRET_KEY = process.env.REACT_APP_JWT_SECRET; 

const encryptedSession = localStorage.getItem('StaffSession');
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
  name: 'StaffSession',
  initialState: {
    StaffSession: decryptedSession,
  },
  reducers: {
    setStaffSession: (state, action) => {
      state.StaffSession = action.payload;
      const encrypted = CryptoJS.AES.encrypt(
        JSON.stringify(action.payload),
        SECRET_KEY
      ).toString();
      localStorage.setItem('StaffSession', encrypted);
    },
    logout: (state) => {
      state.StaffSession = null;
      localStorage.removeItem('StaffSession');
    },
  },
});

export const { setStaffSession, logout } = sessionSlice.actions;
export default sessionSlice.reducer;
