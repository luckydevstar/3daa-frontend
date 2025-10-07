import React from 'react';
import { map, addIndex } from 'ramda';
import Isvg from 'react-inlinesvg';

import IconPin from 'images/icon_pin.svg';

const mapIndexed = addIndex(map);

const renderQuoteBlock = (
  text // <blockquote className="quote-block animate fade-in">
) => (
  <blockquote className="quote-block">
    <div className="pin-icon">
      <Isvg src={IconPin} />
    </div>
    <div className="quoted-text">{text}</div>
  </blockquote>
);

export const renderers = {
  inline: {
    BOLD: (children, { key }) => <b key={key}>{children}</b>,
    ITALIC: (children, { key }) => <i key={key}>{children}</i>,
    highlight: (children, { key }) => (
      <span className="preview-highlight" key={key}>
        {children}
      </span>
    )
  },
  blocks: {
    unstyled: mapIndexed((child, i) => (
      <p key={`p${i}`}>
        {child}
        <br />
      </p>
    )),
    blockquote: mapIndexed(renderQuoteBlock),
    'header-one': mapIndexed((child, i) => <h1 key={`h1${i}`}>{child}</h1>),
    'header-two': mapIndexed((child, i) => <h2 key={`h2${i}`}>{child}</h2>),
    'header-three': mapIndexed((child, i) => <h3 key={`h3${i}`}>{child}</h3>),
    'unordered-list-item': (children, { keys }) => (
      <ul key={keys[keys.length - 1]}>
        {mapIndexed(
          (child, index) => (
            <li key={keys[index]}>{child}</li>
          ),
          children
        )}
      </ul>
    ),
    'ordered-list-item': (children, { keys }) => (
      <ol key={keys.join('|')}>
        {mapIndexed(
          (child, index) => (
            <li key={keys[index]}>{child}</li>
          ),
          children
        )}
      </ol>
    )
  }
};

export default renderers;
