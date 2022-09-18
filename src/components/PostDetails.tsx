import React, { useEffect, useState, useRef} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Loader } from './Loader';
import {
  setComments, setLoaded, setHasError,
} from '../features/posts/comments';
import { NewCommentForm } from './NewCommentForm';
import * as commentsApi from '../api/comments';
import { setPosts } from '../features/posts/posts';
import * as postsApi from '../api/posts';
import classNames from 'classnames';
import Icon from '@mdi/react'
import { mdiLeadPencil } from '@mdi/js';

import { RootState } from '../app/store';
import { Post } from '../types/Post';

type Props = {
  post: Post
};

export const PostDetails: React.FC<Props> = ({ post }) => {
  const posts = useSelector((state: RootState) => state.posts.posts);
  const [visible, setVisible] = useState(false);
  const comments = useSelector((state: RootState) => state.comments.comments);
  const loaded = useSelector((state: RootState) => state.comments.loaded);
  const hasError = useSelector((state: RootState) => state.comments.hasError);
  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const editField = useRef<HTMLInputElement>(null);
  const [newBody, setNewBody] = useState('');

  useEffect(() => {
    if (editField.current) {
      editField.current.focus();
    }
  }, [isEditing]);

  const updateBody = async (event: React.FormEvent) => {
    event.preventDefault();
    if(!newBody.trim()) {
      return;
    }
    const postId = post.id;

    let newPost = posts.find(post => post.id === postId);
    if(newPost !== undefined) {
      newPost = {...newPost, body: newBody};
    }

    dispatch(setPosts(
      posts.map(post => post.id === newPost?.id ? newPost : post)
    ));

    if(newPost !== undefined) {
      await postsApi.updatePost(newPost);
      setIsEditing(false);
    }
    setNewBody('');
  }

  function loadComments() {
    dispatch(setLoaded(false));
    dispatch(setHasError(false));
    setVisible(false);

    commentsApi.getPostComments(post.id)
      .then(res => dispatch(setComments(res))) 
      .catch(() => dispatch(setHasError(true))) 
      .finally(() => dispatch(setLoaded(true)));
  }

  useEffect(loadComments, [post.id]);

  const addComment = async (body: string) => {
    try {
      const newComment = await commentsApi.createComment({
        body,
        postId: post.id,
      });

      dispatch(setComments(
        [...comments, newComment],
      ));

    } catch (error) {

      dispatch(setHasError(true));
    }
  };

  const deleteComment = async (commentId: number) => {
    dispatch(setComments(
      comments.filter(
        comment => comment.id !== commentId,
      ),
    ));

    await commentsApi.deleteComment(commentId);
  };

  return (
    <div className="content">
      <div className="block">
        <h2>
          {`#${post.id}: ${post.title}`}
        </h2>
        <p>
          {!isEditing ? post.body : (
            <form 
              onSubmit={updateBody}
              onBlur={updateBody}
              onKeyUp={event => {
                if (event.key === 'Escape') {
                  updateBody(event);
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
                  className={classNames('input is-info', { 'is-danger': !newBody })}
                  value={newBody}
                  onChange={(event) => setNewBody(event.target.value)}
                />
              </div>
            </form>
          )}
        </p>
        {!isEditing && <button className="button" onClick={() => {
            setIsEditing(true);
            if (editField.current) {
              editField.current.focus();
            }
            setNewBody(post.body);
          }}
        >
          <Icon path={mdiLeadPencil} size={1}/>
        </button>}
      </div>

      <div className="block">
        {!loaded && (
          <Loader />
        )}

        {loaded && hasError && (
          <div className="notification is-danger" data-cy="CommentsError">
            Something went wrong
          </div>
        )}

        {loaded && !hasError && comments.length === 0 && (
          <p className="title is-4" data-cy="NoCommentsMessage">
            No comments yet
          </p>
        )}

        {loaded && !hasError && comments.length > 0 && (
          <>
            <p className="title is-4">Comments:</p>

            {comments.map(comment => (
              <article
                className="message is-small"
                key={comment.id}
              >
                <div className="message-header">

                  <button
                    type="button"
                    className="delete is-small"
                    aria-label="delete"
                    onClick={() => deleteComment(comment.id)}
                  >
                    delete button
                  </button>
                </div>

                <div className="message-body">
                  {comment.body}
                </div>
              </article>
            ))}
          </>
        )}

        {loaded && !hasError && !visible && (
          <button
            type="button"
            className="button is-link"
            onClick={() => setVisible(true)}
          >
            Write a comment
          </button>
        )}

        {loaded && !hasError && visible && (
          <NewCommentForm onSubmit={addComment} />
        )}
      </div>
    </div>
  );
};
