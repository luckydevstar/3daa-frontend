import React from 'react';
import PropTypes from 'prop-types';
import * as lodash from 'lodash';
import common from 'app/common';

const { UIArrowSteps, UISearch } = common.components;

const StoreStepbar = ({ active, steps, placeholder, translate, onSearch }) => {
  return (
    <div className="store-stepbar">
      <div className="container">
        <div className="columns is-marginless">
          <div className="column">
            <UIArrowSteps
              steps={steps}
              active={active}
              height={45}
              horizontalBorders={false}
              colors={{
                selectedBg: '#CFDC00',
                selectedText: '#4a4a4a',
                completedBg: 'white',
                completedText: '#4a4a4a',
                incompletedBg: 'white',
                incompletedText: '#4a4a4a'
              }}
            />
          </div>
          {placeholder && (
            <div className="column is-2 flex-none">
              <UISearch
                onSearch={e => onSearch(e)}
                placeholder={placeholder}
                translate={translate}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

StoreStepbar.propTypes = {
  active: PropTypes.number,
  steps: PropTypes.array,
  placeholder: PropTypes.string,
  translate: PropTypes.bool,
  onSearch: PropTypes.func
};

StoreStepbar.defaultProps = {
  active: 0,
  steps: ['Select Course', 'Assign Licence', 'Summary', 'MyAccount'],
  placeholder: 'Search Courses',
  translate: true,
  onSearch: e => {}
};

export default StoreStepbar;
// searchValue={searchValue}
// <input
//                 onKeyUp={e => onSearch(e)}
//                 type="text"
//                 className="input search"
//                 placeholder={placeholder}
//               />
//               <i className="fa fa-search p-r-10 p-l-5" />
