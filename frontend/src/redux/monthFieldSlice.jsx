import {createSlice} from '@reduxjs/toolkit';

export const monthTitleSlice = createSlice({
  name: 'monthTitle',
  initialState: {
    value: 1,
  },
  reducers: {
    setMonthTitle: (state, action) => {
      Object.assign(state, {value: action.payload});
    },
  },
});

export const {setMonthTitle} = monthTitleSlice.actions;

export default monthTitleSlice.reducer;
