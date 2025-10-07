import React, { Component } from 'react';
import PropTypes from 'prop-types';
import userUtil from 'app/user/util/';
import unitsUtil from 'app/units/util/';
import common from 'app/common';
import { uniq, without, map, addIndex } from 'ramda';
import { connect } from 'react-redux';
import { Field, reduxForm, change, initialize } from 'redux-form';
import Collapsible from 'react-collapsible';
import classNames from 'classnames';
import { Label, Text } from 'app/intl';
import { Creators as unitsActions } from 'app/units/actions';

const {
  Form: { field, dropzone },
  UILoading,
  UINavigation
} = common.components;
const FormField = field;
const FormDropzone = dropzone;
const { FormUtil } = userUtil;

const FORM_NAME = 'qualificationModalInsertMedia';
const errorMesage = "Data doesn't exist";

class QualificationModalInsertMedia extends Component {
  constructor(props) {
    super(props);
    this.tabs = ['Asset Library', 'New Asset'];
    this.state = {
      currentPage: 0,
      selectedAsset: null
    };
  }

  UNSAFE_componentWillMount() {
    // if (this.props.qualification) {
    //   this.props.initializeForm(this.props.qualification);
    // }
  }

  shouldComponentUpdate(nextProps) {
    return true;
  }

  onSubmit(formValues) {}

  handlePageChange(nextPage) {
    this.setState({ currentPage: nextPage });
  }

  render() {
    const { valid, onClose } = this.props;
    const { currentPage } = this.state;

    const convertTab = (tab, i) => ({
      key: `tab-${i}`,
      text: tab
    });
    const _tabs = addIndex(map)(convertTab, this.tabs);

    return (
      <div className="qualification-content">
        <div className="qualification-header">
          <div className="has-text-centered">
            <h3 className="title is-4">Insert Image</h3>
          </div>
          <div className="qualification-navbar">
            <UINavigation
              active={`tab-${currentPage}`}
              tabs={_tabs}
              change={key => this.handlePageChange(+key.substr(4))}
              // onSearch={value => unitFilterChanged(value)}
              showSearch={false}
              // searchValue={searchTerm}
              // searchPlaceholder="Search for a Unit"
            />
          </div>
        </div>
        <div className="qualification-creator">
          <form
            onSubmit={e => e.preventDefault()}
            style={{ display: currentPage !== 1 && 'none' }}
          >
            <Field
              name="image"
              mediaType={'image'}
              component={FormDropzone}
              // uploadedMedia={qualification && qualification.video}
              // handleDrop={file => this.onDrop(file)}
              multiple={false}
            />
          </form>

          <div
            className="units-list"
            style={{ display: currentPage !== 1 && 'none' }}
          >
            {/* {gettingUnitsList ? (
              <UILoading />
            ) : (
              <div></div>              
            )} */}
          </div>
        </div>
        <div className="qualification-footer">
          <div onClick={() => onClose()} className="button is-info m-r-20">
            Cancel
          </div>
          <button
            type="submit"
            disabled={!valid}
            className={classNames('button p-l-40 p-r-40', 'is-success')}
            onClick={this.props.handleSubmit(e => this.onSubmit(e))}
          >
            Insert Selected
          </button>
        </div>
      </div>
    );
  }
}

const validate = (values, props) => {
  const { maxVideoSize } = props;
  const errors = {};
  FormUtil.validate(values, errors, 'image').required();
  return errors;
};

const QualificationModalInsertMedaiForm = reduxForm({
  form: FORM_NAME,
  validate
})(QualificationModalInsertMedia);

QualificationModalInsertMedaiForm.defaultProps = {
  closeModal: () => {},
  onSubmit: () => {}
};

QualificationModalInsertMedaiForm.propTypes = {
  closeModal: PropTypes.func,
  handleSubmit: PropTypes.func
};

const mapStateToProps = () => ({});

const mapDispatchToProps = dispatch => ({
  changeFieldValue: (field_name, value) => {
    dispatch(change(FORM_NAME, field_name, value));
  },
  initializeForm: data => {
    dispatch(initialize(FORM_NAME, data));
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(QualificationModalInsertMedaiForm);
