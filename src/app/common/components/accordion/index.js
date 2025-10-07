import React, { useState } from 'react';

function Accordion({ renderHead, renderBody }) {
  const [isBodyOpen, setIsBodyOpen] = useState(true);

  return (
    <div className="accordion">
      {renderHead && (
        <div
          className="accordion__head"
          onClick={() => {
            setIsBodyOpen(!isBodyOpen);
          }}
        >
          {renderHead()}
        </div>
      )}
      {isBodyOpen && renderBody && (
        <div className="accordion__body">{renderBody()}</div>
      )}
    </div>
  );
}

export default Accordion;
