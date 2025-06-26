import { configureStore } from '@reduxjs/toolkit';
import sessionReducer from '../Slices/DashboardSlice';

const store = configureStore({
  reducer: {
    StaffSession: sessionReducer,
  },
});

export default store;
