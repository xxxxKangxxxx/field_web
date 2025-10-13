import {configureStore} from '@reduxjs/toolkit';
import campTitleReducer from '../campTitleSlice';
import monthTitleReducer from '../monthFieldSlice';
import userReducer from '../userSlice';

export const store = configureStore({
  reducer: {
    campTitle: campTitleReducer,
    monthTitle: monthTitleReducer,
    user: userReducer,
  },
});
