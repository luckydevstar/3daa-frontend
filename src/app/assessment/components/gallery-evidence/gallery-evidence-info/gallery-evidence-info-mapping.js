import React, { useState, useEffect } from 'react';
import cx from 'classnames';
import ReactPaginate from 'react-paginate';
import { includes } from 'ramda';

import { Text } from 'app/intl';

function GalleryEvidenceInfoMapping({
  units,
  unitsTags,
  allCriterias,
  criteriaClick,
  isCriteriaAdded
}) {
  const [viewMapping, setViewMapping] = useState(false);
  const [activePage, setActivePage] = useState(0);
  const [mappingUnits, setMappingUnits] = useState([]);
  const [criterias, setCriterias] = useState([]);

  const previousLabel = <Text iKey="previous" />;
  const nextLabel = <Text iKey="next" />;

  const unit =
    mappingUnits && mappingUnits.length > 0 && mappingUnits[activePage];

  const onSearch = e => {
    const value = e.target.value.toString();
    if (value) {
      const searchedUnits = [...unitsTags].filter(unit =>
        includes(value, unit.title.toLowerCase())
      );
      setMappingUnits(searchedUnits);
    } else {
      setMappingUnits([...unitsTags]);
    }
  };

  useEffect(() => {
    if (unitsTags && unitsTags.length > 0) {
      setMappingUnits([...unitsTags]);
    }
  }, [unitsTags]);

  return (
    <div className="gallery-evidence__info__mapping">
      <div className="gallery-evidence__info__mapping__header">
        <div className="gallery-evidence__info__mapping__header__search">
          <input type="text" placeholder="Search Gallery" onChange={onSearch} />
          <i className="fa fa-search" />
        </div>
        {viewMapping && (
          <div
            className="gallery-evidence__info__mapping__header__mapping-btn"
            onClick={() => {
              setViewMapping(false);
            }}
          >
            <span>Mapping Tool</span>
            <i className="fa fa-eye" />
          </div>
        )}
        {!viewMapping && (
          <div
            className="gallery-evidence__info__mapping__header__mapping-btn"
            onClick={() => {
              setViewMapping(true);
            }}
          >
            <span>View Mapping</span>
            <i className="fa fa-eye" />
          </div>
        )}
      </div>
      {!viewMapping && (
        <div className="gallery-evidence__info__mapping__units-container">
          <div className="gallery-evidence__info__mapping__units">
            {unit && (
              <div>
                <div className="gallery-evidence__info__mapping__units__unit">
                  <div className="gallery-evidence__info__mapping__units__unit__title">
                    {unit.title}
                  </div>
                  <div className="gallery-evidence__info__mapping__units__unit__outcomes">
                    {unit.mapped_outcomes &&
                      unit.mapped_outcomes.map((outcome, index) => (
                        <div key={index}>
                          <div className="gallery-evidence__info__mapping__units__unit__outcomes__outcome">
                            <div className="gallery-evidence__info__mapping__units__unit__outcomes__outcome__title">{`Outcome No. ${outcome.outcome_number}`}</div>
                            <div className="gallery-evidence__info__mapping__units__unit__outcomes__outcome__desc">
                              {outcome.element_title}
                            </div>
                          </div>
                          <div
                            className="gallery-evidence__info__mapping__units__check-container"
                            onClick={() => {
                              criteriaClick(unit);
                            }}
                          >
                            <div
                              className={cx(
                                'gallery-evidence__info__mapping__units__check',
                                {
                                  'gallery-evidence__info__mapping__units__check--active': isCriteriaAdded(
                                    unit
                                  )
                                }
                              )}
                            >
                              <i className="fa fa-check" />
                            </div>
                            <span>ADD</span>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {viewMapping && (
        <div className="gallery-evidence__info__mapping__units-container">
          <div
            className="gallery-evidence__info__mapping__units"
            style={{ backgroundColor: '#d8d8d8' }}
          >
            {mappingUnits &&
              mappingUnits.map(u => (
                <div key={u.unit_id}>
                  <div className="gallery-evidence__info__mapping__units__unit">
                    {u.title}
                  </div>
                  <div className="gallery-evidence__info__mapping__units__unit__tags">
                    {u.mapped_outcomes &&
                      u.mapped_outcomes.map((o, index) => (
                        <div
                          key={index}
                          className="gallery-evidence__info__mapping__units__unit__tag"
                        >
                          {o.outcome_number}
                        </div>
                      ))}
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {!viewMapping && (
        <div className="gallery-evidence__info__mapping__pagination">
          <ReactPaginate
            pageCount={mappingUnits.length}
            pageRangeDisplayed={3}
            marginPagesDisplayed={1}
            pageClassName="button"
            previousLabel={previousLabel}
            nextLabel={nextLabel}
            activeClassName="is-active"
            containerClassName="pagination"
            nextClassName="button p-l-20 p-r-20"
            previousClassName="button p-l-20 p-r-20"
            disabledClassName="is-disabled"
            previousLinkClassName="prev"
            nextLinkClassName="next"
            forcePage={activePage}
            initialPage={activePage}
            onPageChange={page => {
              setActivePage(page.selected);
            }}
          />
        </div>
      )}
    </div>
  );
}

export default GalleryEvidenceInfoMapping;
