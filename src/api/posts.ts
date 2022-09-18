import { client } from '../utils/fetchClient';
import { Post } from '../types/Post';

export const getPosts = () => {
  return client.get<Post[]>('/posts');
};

export const createPost = (data: Omit<Post, 'id'>) => {
  return client.post<Post>('/posts', data);
};

export const deletePost = (postId: number) => {
  return client.delete(`/posts/${postId}`);
};

export const updatePost = (post: Post) => {
  return client.patch(`/posts/${post.id}`, post);
};
