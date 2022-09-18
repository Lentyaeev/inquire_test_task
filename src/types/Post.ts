export interface Post {
  id: number;
  title: string;
  body: string;
}

export type PostData = Pick<Post, 'body' | 'title' >;
