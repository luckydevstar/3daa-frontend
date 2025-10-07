import React, { useState, useEffect } from 'react';
import { includes } from 'ramda';

import common from 'app/common';

const {
  components: { Accordion }
} = common;

const Unit = ({ title }) => {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <div
      className="gallery-evidence__items__associate__unit-container"
      onClick={() => {
        setIsOpen(!isOpen);
      }}
    >
      <div className="gallery-evidence__items__associate__unit__title">
        <div className="gallery-evidence__items__associate__unit__title__arrow">
          {isOpen && <i className="fa fa-angle-up" />}
          {!isOpen && <i className="fa fa-angle-down" />}
        </div>
        <span>{title}</span>
      </div>
      <div className="gallery-evidence__items__associate__unit__progress">
        <div
          className="gallery-evidence__items__associate__unit__progress__line"
          style={{ width: '50%' }}
        />
      </div>
    </div>
  );
};

const Outcome = ({ title }) => {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <div
      className="gallery-evidence__items__associate__outcome-container"
      onClick={() => {
        setIsOpen(!isOpen);
      }}
    >
      {isOpen && <i className="fa fa-angle-up" />}
      {!isOpen && <i className="fa fa-angle-down" />}
      <span>1 {title}</span>
    </div>
  );
};

function GalleryEvidenceItemsAssociate({
  selectedEvidence,
  allCriterias,
  unitsTags
}) {
  const [units, setUnits] = useState([...unitsTags]);

  const onSearch = e => {
    const value = e.target.value.toLowerCase();
    if (value) {
      const searchedUnits = [...unitsTags].filter(unit =>
        includes(value, unit.title.toLowerCase())
      );
      setUnits(searchedUnits);
    } else {
      setUnits([...unitsTags]);
    }
  };

  useEffect(() => {
    setUnits([...unitsTags]);
  }, [unitsTags]);

  return (
    <div>
      {selectedEvidence && (
        <div className="gallery-evidence__items__search-units">
          <input type="text" placeholder="Search Gallery" onChange={onSearch} />
          <i className="fa fa-search" />
        </div>
      )}
      <div className="gallery-evidence__items__associate">
        {units &&
          units.length > 0 &&
          units.map(unit => (
            <Accordion
              {...{
                key: unit.unit_id,
                renderHead: () => <Unit title={unit.title} />,
                renderBody: () => {
                  return unit.mapped_outcomes.map((outcome, index) => (
                    <Accordion
                      {...{
                        key: index,
                        renderHead: () => (
                          <Outcome title={outcome.outcome_title} />
                        ),
                        renderBody: () => (
                          <div className="gallery-evidence__items__associate__criteria">
                            <div>1.1 {outcome.element_title}</div>
                            <input type="checkbox" checked readOnly />
                          </div>
                        )
                      }}
                    />
                  ));
                }
              }}
            />
          ))}
      </div>
    </div>
  );
}

export default GalleryEvidenceItemsAssociate;
