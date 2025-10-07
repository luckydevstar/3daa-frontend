import React from 'react';
import cx from 'classnames';
import { InlineIcon } from '@iconify/react';

const GalleryEvidencePreviewFooterRatingItem = ({
  isActive,
  icon,
  title,
  onClick
}) => (
  <div
    {...{
      className: cx('gallery-evidence__info__footer__rating__button', {
        'gallery-evidence__info__footer__rating__button--selected': isActive
      }),
      onClick
    }}
  >
    <div className="gallery-evidence__info__footer__rating__button__circle">
      <InlineIcon {...{ icon }} />
    </div>
    {title}
  </div>
);

export default GalleryEvidencePreviewFooterRatingItem;
