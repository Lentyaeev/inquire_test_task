import React, { useEffect } from 'react';
import 'bulma/bulma.sass';
import '@fortawesome/fontawesome-free/css/all.css';
import './App.scss';

import classNames from 'classnames';
import { useDispatch, useSelector } from 'react-redux';
import { PostsList } from './components/PostsList';
import { PostDetails } from './components/PostDetails';
import { Loader } from './components/Loader';
import { RootState } from './app/store';
import { setPosts, setLoaded, setHasError } from './features/posts/posts';
import { getPosts } from './api/posts';


export const App: React.FC = () => {
  const selectedPost = useSelector((state: RootState) => (
    state.selectedPost.selectedPost
  ));
  const post = useSelector((state: RootState) => (
    state.posts.posts.find(selectPost => selectPost.id === selectedPost)
  ));
  const dispatch = useDispatch();

  const loaded = useSelector((state: RootState) => state.posts.loaded);

  useEffect(() => {
    dispatch(setLoaded(false));

    getPosts()
      .then(res => dispatch(setPosts(res)))
      .catch(() => dispatch(setHasError(true)))
      .finally(() => dispatch(setLoaded(true)));
  },[]);

  return (
    <main className="section">
      <div className="container">
        <div className="tile is-ancestor">
          <div className="tile is-parent">
            <div className="tile is-child box is-success">
              <div className="block">
              </div>

              <div className="block" data-cy="MainContent">
                {loaded ? <PostsList /> : <Loader />}
              </div>
            </div>
          </div>

          <div
            data-cy="Sidebar"
            className={classNames(
              'tile',
              'is-parent',
              'is-8-desktop',
              'Sidebar',
              {
                'Sidebar--open': selectedPost,
              },
            )}
          >
            <div className="tile is-child box is-success ">
              {(selectedPost && post) && (
                <PostDetails post={post} />
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};
