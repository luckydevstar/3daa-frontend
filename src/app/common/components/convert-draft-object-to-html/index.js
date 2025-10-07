import React from 'react';
import { convertFromRaw } from 'draft-js';
import { stateToHTML } from 'draft-js-export-html';

const htmlConvertionOptions = {
  inlineStyles: {
    bold: { element: 'b' },
    italic: { element: 'i' },
    heading: { element: 'h1' }
  }
};

const ConvertDraftObjectToHtml = ({ object, className, errorMessage }) => {
  let html;
  let tmp;

  try {
    if (typeof object === 'string') {
      tmp = object.replace(/“|”/g, '"').replace('’', '');
      html = stateToHTML(
        convertFromRaw(JSON.parse(tmp)),
        htmlConvertionOptions
      );
      return (
        <div className={className} dangerouslySetInnerHTML={{ __html: html }} />
      );
    } else if (errorMessage && className) {
      return <div className={className}>{errorMessage}</div>;
    }
    return null;
  } catch (e) {
    if (errorMessage && className) {
      return <div className={className}>{errorMessage}</div>;
    } else {
      return null;
    }
  }
};

export default ConvertDraftObjectToHtml;
