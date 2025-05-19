import { createSlice } from '@reduxjs/toolkit';

const storedSession = JSON.parse(localStorage.getItem('session')) || null; 

const sessionSlice = createSlice({
  name: 'session',
  initialState: {
    session: storedSession, 
  },
  reducers: {
    setSession: (state, action) => {
      state.session = action.payload;
      localStorage.setItem('session', JSON.stringify(action.payload)); 
    },
    logout: (state) => {
      state.session = null;
      localStorage.removeItem('user');
    },
  },
});

export const { setSession, logout } = sessionSlice.actions;
export default sessionSlice.reducer;
