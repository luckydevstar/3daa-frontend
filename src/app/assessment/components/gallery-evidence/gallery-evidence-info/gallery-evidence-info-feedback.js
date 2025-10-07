import React, { useState } from 'react';
import moment from 'moment';
import cx from 'classnames';
import { path } from 'ramda';

function GalleryEvidenceInfoFeedback({
  evidenceComments,
  postAssessmentEvidenceComment,
  member,
  user,
  selectedEvidence,
  attemptingPostAssessmentEvidenceComment
}) {
  const [message, setMessage] = useState('');

  const sendMessage = e => {
    const member_id = path(['member_id'], member);
    const qualification_id = path(
      ['current_qualification', 'qualification_id'],
      member
    );
    const evidence_id = path(
      ['learning_progress_evidence_id'],
      selectedEvidence
    );

    e.preventDefault();

    postAssessmentEvidenceComment(member_id, qualification_id, evidence_id, {
      message
    });
    setMessage('');
  };
  return (
    <div className="gallery-evidence__info__feedback">
      <div className="gallery-evidence__info__feedback__chat">
        {evidenceComments.map(comment => (
          <div
            key={comment.learning_progress_evidence_comment_id}
            className={cx('gallery-evidence__info__feedback__chat__item', {
              'gallery-evidence__info__feedback__chat__item--left':
                comment.member_id.toString() === user.member_id.toString()
            })}
          >
            <div className="gallery-evidence__info__feedback__chat__item__avatar">
              {comment && comment.media_url && (
                <img src={comment.media_url} alt="" />
              )}
            </div>
            <div className="gallery-evidence__info__feedback__chat__item__message">
              <div className="gallery-evidence__info__feedback__chat__item__message__date">
                {moment(comment.created).format('Mo MMM HH:mm')}
              </div>
              <div className="gallery-evidence__info__feedback__chat__item__message__cloud">
                {comment && (comment.first_name || comment.last_name) && (
                  <div className="gallery-evidence__info__feedback__chat__item__message__cloud__name">{`${comment.first_name} ${comment.last_name}`}</div>
                )}
                {comment && comment.message && (
                  <div className="gallery-evidence__info__feedback__chat__item__message__cloud__text">
                    {comment.message}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      <form
        className="gallery-evidence__info__feedback__input"
        onSubmit={sendMessage}
      >
        <input
          value={message}
          onChange={e => {
            setMessage(e.target.value);
          }}
          placeholder="Type a message..."
        />
        {attemptingPostAssessmentEvidenceComment && (
          <button className="button is-loading" />
        )}
      </form>
    </div>
  );
}

export default GalleryEvidenceInfoFeedback;
