import React from 'react';
import { path } from 'ramda';

function GalleryEvidenceInfoQa({ selectedEvidence }) {
  const qaComments = path(['qa_comments'], selectedEvidence) || [];
  return (
    <div className="gallery-evidence__info__qa">
      {!qaComments ||
        (qaComments.length === 0 && (
          <div className="gallery-evidence__info__qa__no-comments">
            No comments
          </div>
        ))}
      {qaComments &&
        qaComments.map(comment => (
          <div key={comment.learning_progress_evidence_comment_id}>
            <div className="gallery-evidence__info__qa__user">
              {comment && comment.media_url && (
                <img
                  className="gallery-evidence__info__qa__avatar"
                  src={comment.media_url}
                />
              )}
              {comment && (comment.first_name || comment.last_name) && (
                <div className="gallery-evidence__info__qa__name">{`${comment.first_name} ${comment.last_name}`}</div>
              )}
            </div>
            {comment && (comment.first_name || comment.last_name) && (
              <div className="gallery-evidence__info__qa__comment">
                {comment.message}
              </div>
            )}
            <div className="gallery-evidence__info__qa__date">
              {moment(comment.created).format('DD/MM/YYYY')}
            </div>
          </div>
        ))}
    </div>
  );
}

export default GalleryEvidenceInfoQa;
