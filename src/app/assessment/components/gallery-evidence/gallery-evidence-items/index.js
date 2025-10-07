import React, { useState, useEffect } from 'react';
import cx from 'classnames';
import moment from 'moment';
import { path, includes, filter, propEq } from 'ramda';

import common from 'app/common';
import GalleryEvidenceItem from './gallery-evidence-item';
import GalleryEvidenceItemsAssociate from './gallery-evidence-items-associate';

const filters = [
  { key: 1, name: 'All Evidence' },
  { key: 2, name: 'View by Date' },
  { key: 3, name: 'Required Approval' },
  { key: 4, name: 'Approved' }
];
const { UISelectDropdown, UILoading } = common.components;

function GalleryEvidenceItems({
  evidences,
  units,
  allCriterias,
  member,
  unitsTags,
  attemptingDeleteAssessmentEvidence,
  attemptingGetAssessmentMemberEvidences,
  isInfoOpen,
  selectedEvidence,
  selectedEvidenceIndex,
  setEvidenceAddModal,
  setSelectedEvidence,
  setEvidenceSelectTypeModal
}) {
  const [slideIndex, setSlideIndex] = useState(0);
  const [items, setItems] = useState([...evidences]);
  const [selectedKey, setSelectedKey] = useState(1);

  const approved = path(['approved'], selectedEvidence);

  const lastUpdated = path(['modified'], selectedEvidence);
  const videos =
    items && items.length > 0
      ? filter(propEq('cloudinary_file_type', 'video'))(items)
      : [];
  const images =
    items && items.length > 0
      ? filter(propEq('cloudinary_file_type', 'image'))(items)
      : [];

  // const role = member && member.roles && member.roles[0];

  const chunkArray = (myArray, chunk_size) => {
    let results = [];
    let newMyArray = [...myArray];
    while (newMyArray.length) {
      results.push(newMyArray.splice(0, chunk_size));
    }
    return results;
  };

  const slides = chunkArray(items, 18);

  const slideLeft = () => {
    if (slideIndex <= 0) return;
    setSlideIndex(slideIndex - 1);
  };

  const slideRight = () => {
    if (slideIndex >= slides.length - 1) return;
    setSlideIndex(slideIndex + 1);
  };

  const filterByDate = () => {
    const arr = [...evidences];
    arr.sort(
      (a, b) =>
        moment(a.date).format('YYYYMMDD') - moment(b.date).format('YYYYMMDD')
    );
    setItems(arr);
  };

  const changeFilter = key => {
    setSelectedKey(key);
    switch (key) {
      case 2: {
        filterByDate();
        return;
      }
      case 3: {
        setItems([...evidences].filter(evidence => !evidence.approved));
        return;
      }
      case 4: {
        setItems([...evidences].filter(evidence => evidence.approved));
        return;
      }
      default: {
        setItems([...evidences]);
        return;
      }
    }
  };

  const onSearchItems = e => {
    const { value } = e.target;
    if (value === '') {
      setItems([...evidences]);
    } else {
      const searchedItems = [...evidences].filter(evidence =>
        includes(value.toLowerCase(), evidence.title.toLowerCase())
      );
      setItems(searchedItems);
    }
  };

  useEffect(() => {
    if (evidences) {
      setItems([...evidences]);
    }
  }, [evidences]);

  return (
    <div
      className={cx('gallery-evidence__items', {
        'gallery-evidence__items--minimized': isInfoOpen
      })}
    >
      <div className="gallery-evidence__items__search">
        <div className="gallery-evidence__items__search__input">
          <input
            type="text"
            onChange={onSearchItems}
            placeholder="Search Gallery"
          />
          <i className="fa fa-search" />
        </div>
        {!approved && (
          <div className="gallery-evidence__items__search__status">
            <div className="gallery-evidence__items__search__status__required-approval">
              <div className="gallery-evidence__items__search__status__required-approval__inner">
                !
              </div>
            </div>
            <span>Required Approval</span>
          </div>
        )}
        {approved && <div />}
      </div>
      <div className="gallery-evidence__items__block">
        {slides.length > 1 && (
          <button
            className={cx('gallery-evidence__items__block__slide-left', {
              'gallery-evidence__items__block__slide-left--disabled':
                slideIndex <= 0
            })}
            onClick={slideLeft}
          >
            <i className="fa fa-angle-left" />
          </button>
        )}
        {attemptingDeleteAssessmentEvidence ||
          (attemptingGetAssessmentMemberEvidences && (
            <UILoading marginTop="150px" marginBottom="150px" />
          ))}
        {slides.length === 0 &&
          (!attemptingDeleteAssessmentEvidence ||
            !attemptingGetAssessmentMemberEvidences) && (
            <div className="gallery-evidence__items__empty">No evidences</div>
          )}
        {slides.length > 0 &&
          (!attemptingDeleteAssessmentEvidence ||
            !attemptingGetAssessmentMemberEvidences) && (
            <div
              className="gallery-evidence__items__block__track"
              style={{ transform: `translateX(-${slideIndex * 100}%)` }}
            >
              {slides.map((slide, i) => (
                <div key={i} className="gallery-evidence__items__block__slide">
                  {slide.map(evidence => (
                    <GalleryEvidenceItem
                      {...{
                        key: evidence.learning_progress_evidence_id,
                        evidence,
                        selectedEvidence,
                        setSelectedEvidence
                      }}
                    />
                  ))}
                </div>
              ))}
            </div>
          )}
        {slides.length > 1 && (
          <button
            className={cx('gallery-evidence__items__block__slide-right', {
              'gallery-evidence__items__block__slide-right--disabled':
                slideIndex >= slides.length - 1
            })}
            onClick={slideRight}
          >
            <i className="fa fa-angle-right" />
          </button>
        )}
      </div>
      <div className="gallery-evidence__items__block__dots">
        {slides.map((slide, index) => (
          <div
            className={cx('gallery-evidence__items__block__dot', {
              'gallery-evidence__items__block__dot--active':
                index === slideIndex
            })}
            onClick={() => {
              setSlideIndex(index);
            }}
            key={index}
          />
        ))}
      </div>
      <div className="gallery-evidence__items__filter-container">
        {lastUpdated && (
          <div className="gallery-evidence__items__filter__updated">
            <div className="gallery-evidence__items__filter__updated__date">
              <img src="/assets/images/evidence-calendar.png" />
              <span>{moment(lastUpdated).format('ddd D MMM')}</span>
            </div>
            <div>Last updated</div>
          </div>
        )}
        <div className="gallery-evidence__items__filter__select">
          <UISelectDropdown
            dropdownList={filters}
            defaultTxt="Filter"
            defaultKey={selectedKey}
            onChange={changeFilter}
          />
        </div>
        <div
          className="gallery-evidence__items__filter__add"
          onClick={() => {
            setEvidenceSelectTypeModal(true);
          }}
        >
          +
        </div>
      </div>
      {selectedEvidence && (
        <div className="gallery-evidence__items__edvidence-units-header">
          <div className="gallery-evidence__items__edvidence-units__title">
            {`${path(['title'], selectedEvidence) ||
              ''} #${selectedEvidenceIndex} - Associate with units`}
          </div>
          <div className="gallery-evidence__items__edvidence-units__info">
            <div className="gallery-evidence__items__edvidence-units__info__videos">
              All Videos: <span>{videos.length}</span>
            </div>
            <div className="gallery-evidence__items__edvidence-units__info__images">
              All Images: <span>{images.length}</span>
            </div>
          </div>
        </div>
      )}
      {selectedEvidence && (
        <div className="gallery-evidence__items__hr">
          <hr />
        </div>
      )}

      <GalleryEvidenceItemsAssociate
        {...{
          selectedEvidence,
          units,
          allCriterias,
          unitsTags
        }}
      />
    </div>
  );
}

export default GalleryEvidenceItems;
