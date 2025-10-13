// src/redux/userSlice.js
import { createSlice } from '@reduxjs/toolkit';
import { jwtDecode } from 'jwt-decode';

const initialState = {
  token: null,
  user: null, // 디코딩된 사용자 정보 (username, isAdmin 등)
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setToken: (state, action) => {
      state.token = action.payload;
      try {
        state.user = jwtDecode(action.payload);
      } catch (e) {
        state.user = null;
      }
    },
    clearToken: (state) => {
      state.token = null;
      state.user = null;
    },
  },
});

export const { setToken, clearToken } = userSlice.actions;
export default userSlice.reducer;
