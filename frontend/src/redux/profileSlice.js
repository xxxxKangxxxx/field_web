import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  profiles: [
    {
      id: 1,
      photo: '/assets/profiles/leader.jpg',
      department: '단장',
      name: '홍길동',
      introTitle: '환영합니다',
      intro: '안녕하세요. FIELD 16기 단장입니다.'
    },
    // 기본 프로필 데이터...
  ]
};

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    updateProfile: (state, action) => {
      const { id, updates } = action.payload;
      const profileIndex = state.profiles.findIndex(profile => profile.id === id);
      if (profileIndex !== -1) {
        state.profiles[profileIndex] = { ...state.profiles[profileIndex], ...updates };
      }
    },
    addProfile: (state, action) => {
      const newProfile = {
        id: state.profiles.length + 1,
        ...action.payload
      };
      state.profiles.push(newProfile);
    },
    deleteProfile: (state, action) => {
      state.profiles = state.profiles.filter(profile => profile.id !== action.payload);
    }
  }
});

export const { updateProfile, addProfile, deleteProfile } = profileSlice.actions;
export default profileSlice.reducer; 