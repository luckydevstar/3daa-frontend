import React from 'react';
import { connect } from 'react-redux';
import { Creators } from 'app/qualifications/actions';
import common from 'app/common';
import LinkForm from './link-form';
import Isvg from 'react-inlinesvg';

import IconGlobe from 'images/icon_globe.svg';

const ContentModal = common.components.ContentModal;

class LinkModal extends React.Component {
  constructor(props) {
    super(props);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onSubmit(values) {
    this.props.updateEntity(this.props.block.getKey(), values);
    this.closeModal();
  }

  openModal() {
    this.linkBlockModal.open();
  }

  closeModal() {
    this.linkBlockModal.close();
  }

  removeBlock() {
    this.props.blockProps.onRemove(this.props.block.getKey());
  }

  renderLink() {
    const { entityData } = this.props.blockProps;
    let link;
    let result = false;
    link = entityData.url && entityData.url;
    if (link) {
      if (link.indexOf('http') === -1) {
        link = `//${link}`;
      }
      result = (
        <a href={link} rel="noopener noreferrer" target="_blank">
          {entityData.text || entityData.url}
        </a>
      );
    }

    return result;
  }

  render() {
    return (
      <div className="editor-block-container">
        <ContentModal
          ref={e => {
            this.linkBlockModal = e;
          }}
          className="link-block-form"
        >
          <h1 className="is-1">Insert or edit a link</h1>
          <LinkForm
            initialValues={this.props.blockProps.entityData}
            onSubmit={this.onSubmit}
          />
        </ContentModal>
        <div className="link-block">
          {this.renderLink() || 'Click a button below to insert new link'}
          <div className="globe-icon">
            <Isvg src={IconGlobe} />
          </div>
        </div>
        <div className="editor-block-footer">
          <div
            onClick={() => {
              this.openModal();
            }}
            className="button is-primary"
          >
            Customise this block
          </div>
          <div
            onClick={() => this.removeBlock()}
            className="remove-block is-pulled-right"
          >
            Delete Block
            <i className="fa fa-trash-o" />
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = () => ({});

const mapDispatchToProps = dispatch => ({
  updateEntity: (blockKey, newData) =>
    dispatch(Creators.editorUpdateEntity(blockKey, newData))
});

export default connect(mapStateToProps, mapDispatchToProps)(LinkModal);
