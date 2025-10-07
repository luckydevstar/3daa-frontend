import React from 'react';
import { connect } from 'react-redux';
import common from 'app/common';
import { uniq, without, map, addIndex, equals, path, clone } from 'ramda';
import { Creators as QualificationActions } from 'app/qualifications/actions';
import { Creators as WorkBooksCreators } from 'app/workbooks/actions';
import Editor from '../components/workbook/editor';

const {
  components: { UIPortal }
} = common;

class WorkbooksEditorRoute extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      activities: props.activities,
      filteredOutcomes: null,
      outcomesToOpen: null
    };
  }

  componentDidMount() {
    const { getActivityTypes } = this.props;
    getActivityTypes();
  }

  componentWillUnmount() {
    // NOTE clear current moderator if it is current user
    const { workbook, user } = this.props;
    if (
      workbook &&
      workbook.current_moderator &&
      user &&
      workbook.current_moderator.member_id === user.member_id
    ) {
      this.props.clearWorkbookCurrentModerator(
        workbook.unit_id,
        workbook.workbook_id
      );
    }

    this.props.clearWorkbookState();
  }

  saveWorkbook(workbook) {
    this.props.saveWorkbook(workbook);
  }

  render() {
    const { open, activityTypes, params, user, children } = this.props;
    return (
      <div className="workbooks-builder-container">
        <Editor
          ref={e => {
            this.editor = e;
          }}
          open={open}
          user={user}
          unitId={params.unit_id}
          workbookId={params.workbook_id}
          activityTypes={activityTypes}
          onSave={this.saveWorkbook}
        />
        {children && (
          <UIPortal isOpened>
            <div>{children}</div>
          </UIPortal>
        )}
      </div>
    );
  }
}

/**
 * Redux mappings
 */
const mapStateToProps = state => ({
  persistedSector: path(['persisted', 'sector'])(state),
  open: state.qualifications.showOutcomesTray,
  activityTypes: state.qualifications.activityTypes,
  units: state.units,
  workbook: state.workbooks.workbook,
  user: state.profile.user
});

const mapDispatchToProps = dispatch => ({
  getActivityTypes: () =>
    dispatch(QualificationActions.getActivityTypesAttempt()),
  clearWorkbookState: () => dispatch(WorkBooksCreators.resetWorkbookState()),
  clearWorkbookCurrentModerator: (unit_id, workbook_id) =>
    dispatch(
      WorkBooksCreators.clearWorkbookCurrentModeratorAttempt(
        unit_id,
        workbook_id
      )
    )
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WorkbooksEditorRoute);
