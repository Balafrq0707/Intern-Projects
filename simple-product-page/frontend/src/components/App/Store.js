import { configureStore } from "@reduxjs/toolkit";
import sessionReducer from '../slices/Slice'

export const store = configureStore({
    reducer: {
            session: sessionReducer,
    }
})