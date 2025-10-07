import React from 'react';
import { nth } from 'ramda';
import cx from 'classnames';

const DraggableItem = main => i => {
  const { rotate, title, image } = nth(i, main);
  return (
    <div
      id={`item${i}`}
      key={`item${i}`}
      className={cx('draggable-item', { hasImage: image })}
      style={{ transform: `rotate(${rotate}deg)` }}
    >
      {image
        ? <div
            className="draggable-item-image"
            style={{ background: `url(${image})` }}
          />
        : null}
      <span className="draggable-item-title">
        {title}
      </span>
    </div>
  );
};

export default DraggableItem;
