import classNames from 'classnames';
import React, { useState } from 'react';
import { PostData } from '../types/Post';

type Props = {
  onSubmit: (_: PostData) => Promise<void>;
  toggle: () => void;
};

export const NewPostForm: React.FC<Props> = ({ onSubmit, toggle }) => {
  const [submitting, setSubmitting] = useState(false);

  const [errors, setErrors] = useState({
    body: false,
    title: false,
  });

  const [{body, title}, setValues] = useState({
    body: '',
    title: '',
  });

  const clearForm = () => {
    setValues({
      body: '',
      title: '',
    });
    setErrors({
      body: false,
      title: false,
    });
  };

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name: field, value } = event.target;

    setValues(current => ({ ...current, [field]: value }));
    setErrors(current => ({ ...current, [field]: false }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    setErrors({
      title: !title,
      body: !body,
    });

    if (!title || !body) {
      return;
    }

    setSubmitting(true);

    await onSubmit({body, title});
    setSubmitting(false);
    clearForm();
    toggle();
  };

  return (
    <form onSubmit={handleSubmit} onReset={clearForm}>
      <div className="field">
        <label className="label" htmlFor="post-title">
          Title
        </label>

        <div className="control">
          <input
            type="text"
            name="title"
            id="post-title"
            placeholder="Title"
            className={classNames('input is-info', { 'is-danger': errors.title })}
            value={title}
            onChange={handleChange}
          />

          {errors.title && (
            <span
              className="icon is-small is-right has-text-danger"
            >
              <i className="fas fa-exclamation-triangle" />
            </span>
          )}
        </div>

        {errors.title && (
          <p className="help is-danger" data-cy="ErrorMessage">
            Title is required
          </p>
        )}
      </div>
      <div className="field">
        <label className="label" htmlFor="post-body">
          Post body
        </label>

        <div className="control">
          <textarea
            id="post-body"
            name="body"
            placeholder="Type something here"
            className={classNames('textarea', { 'is-danger': errors.body })}
            value={body}
            onChange={handleChange}
          />
        </div>

        {errors.body && (
          <p
            className="help is-danger"
            data-cy="ErrorMessage"
          >
            Enter some text
          </p>
        )}
      </div>

      <div className="field is-grouped">
        <div className="control">
          <button
            type="submit"
            className={classNames('button', 'is-link', {
              'is-loading': submitting,
            })}
          >
            Add
          </button>
        </div>

        <div className="control">
          {/* eslint-disable-next-line react/button-has-type */}
          <button type="reset" className="button is-link is-light">
            Clear
          </button>
        </div>
      </div>
    </form>
  );
};
