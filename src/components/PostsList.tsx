import classNames from 'classnames';
import React, { useState , useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../app/store';
import { setSelectedPost } from '../features/posts/selectedPost';
import { NewPostForm } from './NewPostForm';
import * as postsApi from '../api/posts';
import { PostData } from '../types/Post';
import { setSelectedEditPost } from '../features/posts/selectedEditPost';
import { setHasError, setPosts } from '../features/posts/posts';
import Icon from '@mdi/react'
import { mdiLeadPencil } from '@mdi/js';

export const PostsList: React.FC = () => {
  const posts = useSelector((state: RootState) => state.posts.posts);
  const selectedPost = useSelector((state: RootState) => (
    state.selectedPost.selectedPost
  ));
  const selectedEditPost = useSelector((state: RootState) => state.selectedEditPost.selectedEditPost);
  const dispatch = useDispatch();
  const [visible, setVisible] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const editField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editField.current) {
      editField.current.focus();
    }
  }, [isEditing]);

  const updateTitle = async (event: React.FormEvent) => {
    event.preventDefault();
    if(!newTitle.trim()) {
      return;
    }
    const postId = selectedEditPost?.id;

    let newPost = posts.find(post => post.id === postId);
    if(newPost !== undefined) {
      newPost = {...newPost, title: newTitle};
    }

    dispatch(setPosts(
      posts.map(post => post.id === newPost?.id ? newPost : post)
    ));

    setNewTitle('');

    if(newPost !== undefined) {
      await postsApi.updatePost(newPost);
      setIsEditing(false);
    }
  }

  const deletePost = async (postId: number) => {
    dispatch(setPosts(
      posts.filter(
        post => post.id !== postId,
      ),
    ));

    await postsApi.deletePost(postId);
  };
  const tooggle = () => {
    setVisible((prevstate: boolean) => !prevstate);
  }
  const addPost = async ({body, title}: PostData) => {
    try {
      const newPost = await postsApi.createPost({
        title,
        body,
      });

      dispatch(setPosts(
        [...posts, newPost],
      ));

    } catch (error) {

      dispatch(setHasError(true));
    }
  };

  return (
    <div data-cy="PostsList">
      <p className="title">Posts:</p>

      <table className="table is-fullwidth is-striped is-hoverable is-narrow">
        <thead>
          <tr className="has-background-link-light">
            <th>#</th>
            <th>Title</th>
            <th></th>
            <th></th>
            <th></th>
          </tr>
        </thead>

        <tbody>
          {posts?.map(post => (
            <tr
              key={post.id}
              onDoubleClick={() => {
                setIsEditing(true);
                if (editField.current) {
                  editField.current.focus();
                }
                dispatch(setSelectedEditPost(post))
                setNewTitle(post.title);
              }}
            >
              <td className="is-vcentered">{post.id}</td>
              <td className="is-vcentered"
              >
                {selectedEditPost !== post ? post.title : (
                  <form 
                    onSubmit={updateTitle}
                    onBlur={updateTitle}
                    onKeyUp={event => {
                      if (event.key === 'Escape') {
                        updateTitle(event);
                      }
                    }}
                  >
                    <div className="control">
                      <input
                        type="text"
                        name="title"
                        ref={editField}
                        id="post-title"
                        placeholder="Title"
                        className={classNames('input is-info', { 'is-danger': !newTitle })}
                        value={newTitle}
                        onChange={(event) => setNewTitle(event.target.value)}
                      />
                    </div>
                  </form>
                )}
              </td>
              <td className="has-text-right is-vcentered">{post !== selectedEditPost && (
              <button className="button" onClick={() => {
                  setIsEditing(true);
                  if (editField.current) {
                    editField.current.focus();
                  }
                  dispatch(setSelectedEditPost(post))
                  setNewTitle(post.title);
                }}
              >
                <Icon path={mdiLeadPencil} size={1}/>
              </button>
              )}
              </td>
              <td className="has-text-right is-vcentered">
                <button
                  type="button"
                  className={classNames(
                    'button',
                    'is-link',
                    {
                      'is-light': post.id !== selectedPost,
                    },
                  )}
                  onClick={() => {
                    dispatch(setSelectedPost(
                      post.id === selectedPost ? null : post.id,
                    ));
                  }}
                >
                  {post.id === selectedPost ? 'Close' : 'Open'}
                </button>
              </td>
              <td className="has-text-right is-vcentered">
                  <button
                    type="button"
                    className="delete"
                    aria-label="delete"
                    onClick={() => {
                      deletePost(post.id);
                      dispatch(setSelectedPost(null));
                    }}
                  >
                  </button>
                </td>
            </tr>
          ))}
        </tbody>
      </table>
      {!visible ? (
        <button
          type="button"
          className="button is-link"
          onClick={() => setVisible(true)}
        >
        Write a post
      </button>
      ) : <NewPostForm onSubmit={addPost} toggle={tooggle}/>}
    </div>
  );
};
