import React, { useState } from 'react';
import PropTypes from 'prop-types';
import ReactPaginate from 'react-paginate';
import { Field } from 'redux-form';
import { addIndex, map, pipe, prop } from 'ramda';
import ActivityTout from './activity-tout';
import common from 'app/common';
import { required } from 'app/common/util/form-utils';
import { Text } from 'app/intl';

const {
  components: {
    Form: { textarea }
  }
} = common;

const previousLabel = <Text iKey="previous" />;
const nextLabel = <Text iKey="next" />;

const mapIndexed = addIndex(map);

const MultipleFreeTextActivity = ({
  activity: { content, tout, tout_type },
  readOnly
}) => {
  const [page, setPage] = useState(0);
  const contentParsed = JSON.parse(content);
  const prompts = prop('prompts')(contentParsed);
  const activePrompt = prompts[page];
  const { title, text } = activePrompt;
  return (
    <div className="workbook-activity-modal-body">
      <div className="columns">
        <div className="column is-half">
          <div className="workbook-activity-modal-tout">
            <ActivityTout {...{ tout, toutType: tout_type }} />
          </div>
        </div>
        <div className="column is-half">
          <h4>Activity</h4>
          <div className="multiple-free-text-activity">
            <div className="text-activity-slide">
              <span className="activity-question">{title}</span>
              <strong className="workbook-activity-modal-label">{text}</strong>
              <Field
                name={`input${page}`}
                component={textarea}
                fieldClassName="workbook-activity-modal-textarea"
                placeholder="Write / paste your answer here"
                disabled={readOnly}
                validate={[required]}
              />
            </div>
          </div>
          <div className="multiple-free-text-activity__pagination">
            <ReactPaginate
              pageCount={prompts.length}
              pageRangeDisplayed={3}
              marginPagesDisplayed={0}
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
              forcePage={0}
              initialPage={0}
              onPageChange={p => {
                setPage(p.selected);
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

MultipleFreeTextActivity.propTypes = {
  activity: PropTypes.object.isRequired
};

export default MultipleFreeTextActivity;
