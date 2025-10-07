import React from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import common from 'app/common';

const { ContentModalConfirm } = common.components;

class BottomBar extends React.Component {
  render() {
    const { onSave, onCancel, saving } = this.props;
    const saveButtonClasses = classNames('button is-primary', {
      'is-loading': saving
    });
    return (
      <div className="bottom-bar">
        <button
          className="button is-primary is-outlined"
          onClick={() => this.confirmModal.open()}
        >
          Discard Changes
        </button>
        <button
          className={saveButtonClasses}
          onClick={onSave}
          disabled={saving}
        >
          Save Changes
        </button>
        <ContentModalConfirm
          callback={onCancel}
          ref={e => {
            this.confirmModal = e;
          }}
        >
          <p>Are you sure you want to discard current changes?</p>
        </ContentModalConfirm>
      </div>
    );
  }
}

const mapStateToProps = state => ({});

const mapDispatchToProps = () => ({});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BottomBar);
