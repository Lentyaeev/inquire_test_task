import classNames from 'classnames';
import React, { useState } from 'react';

type Props = {
  onSubmit: (_: string) => Promise<void>;
};

export const NewCommentForm: React.FC<Props> = ({ onSubmit }) => {
  const [submitting, setSubmitting] = useState(false);

  const [error, setError] = useState(false);

  const [body, setBody] = useState('');

  const clearForm = () => {
    setBody('');
    setError(false);
  };

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setBody(event.currentTarget.value);
    setError(false);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    setError(!body);

    if (!body) {
      return;
    }

    setSubmitting(true);

    await onSubmit(body);

    setSubmitting(false);
    clearForm();
  };

  return (
    <form onSubmit={handleSubmit} onReset={clearForm} data-cy="NewCommentForm">
      <div className="field" data-cy="BodyField">
        <label className="label" htmlFor="comment-body">
          Comment Text
        </label>

        <div className="control">
          <textarea
            id="comment-body"
            name="body"
            placeholder="Type comment here"
            className={classNames('textarea', { 'is-danger': error })}
            value={body}
            onChange={handleChange}
          />
        </div>

        {error && (
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
