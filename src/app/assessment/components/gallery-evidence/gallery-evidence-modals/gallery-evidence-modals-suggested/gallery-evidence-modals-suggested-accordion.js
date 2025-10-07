import React from 'react';
import ReactPaginate from 'react-paginate';

import common from 'app/common';
import { Text } from 'app/intl';

const {
  components: { Accordion }
} = common;

const GalleryEvidenceModalsSuggestedAccordion = ({
  allCriterias,
  isCriteriaAdded,
  criteriaClick,
  activePage,
  setActivePage
}) => {
  const previousLabel = <Text iKey="previous" />;
  const nextLabel = <Text iKey="next" />;

  return (
    <div>
      {allCriterias &&
        allCriterias.map(criteria => (
          <Accordion
            {...{
              key: criteria.assessment_criteria_id,
              renderHead: () => (
                <div className="gallery-evidence-modal-suggested__accordion-head">
                  {criteria.unit_title}
                </div>
              ),
              renderBody: () => (
                <div className="gallery-evidence-modal-suggested__accordion-body">
                  <Accordion
                    {...{
                      renderHead: () => (
                        <div className="gallery-evidence-modal-suggested__accordion-head gallery-evidence-modal-suggested__accordion-head--outcome">
                          <span className="index-item">1</span>
                          {` ${criteria.outcome_title}`}
                        </div>
                      ),
                      renderBody: () => (
                        <div className="gallery-evidence-modal-suggested__accordion-body">
                          <div className="gallery-evidence-modal-suggested__accordion-body__item gallery-evidence-modal-suggested__accordion-body__item--criteria">
                            <span>
                              <span className="index-item">1.1</span>
                              {` ${criteria.title}`}
                            </span>
                            <input
                              type="checkbox"
                              checked={isCriteriaAdded(criteria)}
                              onChange={() => {
                                criteriaClick(criteria);
                              }}
                            />
                          </div>
                        </div>
                      )
                    }}
                  />
                </div>
              )
            }}
          />
        ))}
      <div className="gallery-evidence-modal-suggested__mappings">
        <span>{allCriterias.length}</span>
        Suggested Mappings
      </div>
      <div className="gallery-evidence-modal-suggested__mappings__pagination">
        <ReactPaginate
          pageCount={allCriterias.length}
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
    </div>
  );
};

export default GalleryEvidenceModalsSuggestedAccordion;
