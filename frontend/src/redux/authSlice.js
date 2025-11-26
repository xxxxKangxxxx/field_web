import { createSlice } from '@reduxjs/toolkit';

export const MANAGER_POSITIONS_LIST = [
  '단장',
  '부단장',
  '기획부장',
  '컴페티션부장',
  '홍보부장',
  '대외협력부장'
];

const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { user, token } = action.payload;
      state.user = user;
      state.token = token;
      state.isAuthenticated = true;
      localStorage.setItem('token', token);
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem('token');
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;

export const selectCurrentUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectIsManager = (state) => state.auth.user?.isAdmin === true;
export const selectIsSuperAdmin = (state) => state.auth.user?.isSuperAdmin === true;

export default authSlice.reducer; 