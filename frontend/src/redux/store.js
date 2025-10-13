import { configureStore } from '@reduxjs/toolkit';
import profileReducer from './profileSlice';
import authReducer from './authSlice';
import campTitleReducer from './campTitleSlice';

export const store = configureStore({
  reducer: {
    profile: profileReducer,
    auth: authReducer,
    campTitle: campTitleReducer,
  },
});

export default store; 