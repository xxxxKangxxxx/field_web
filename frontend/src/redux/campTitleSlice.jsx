import {createSlice} from '@reduxjs/toolkit';

export const campTitleSlice = createSlice({
  name: 'campTitle',
  initialState: {
    value: 2024,
  },
  reducers: {
    setCampTitle: (state, action) => {
      Object.assign(state, {value: action.payload});
    },
  },
});

export const {setCampTitle} = campTitleSlice.actions;

export default campTitleSlice.reducer;
