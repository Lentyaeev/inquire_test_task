export interface Comment {
  id: number,
  postId: number;
  body: string;
}

export type CommentData = Pick<Comment, 'body' >;
