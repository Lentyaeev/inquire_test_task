/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { Post } from '../../types/Post';

export interface SelectedEditPostState {
  selectedEditPost: Post | null,
}

const initialState: SelectedEditPostState = {
  selectedEditPost: null,
};

export const selectedEditPostSlice = createSlice({
  name: 'selectedEditPost',
  initialState,
  reducers: {
    setSelectedEditPost: (state, action: PayloadAction<Post | null>) => {
      state.selectedEditPost = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setSelectedEditPost } = selectedEditPostSlice.actions;

export default selectedEditPostSlice.reducer;
