import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
// eslint-disable-next-line import/no-cycle
import selectedPostReducer from '../features/posts/selectedPost';
import postsReducer from '../features/posts/posts';
import commentssReducer from '../features/posts/comments';
import selectedEditPostReducer from '../features/posts/selectedEditPost';

export const store = configureStore({
  reducer: {
    selectedPost: selectedPostReducer,
    posts: postsReducer,
    comments: commentssReducer,
    selectedEditPost: selectedEditPostReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

/* eslint-disable @typescript-eslint/indent */
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
/* eslint-enable @typescript-eslint/indent */
