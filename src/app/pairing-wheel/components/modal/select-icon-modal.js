import React from 'react';
import classNames from 'classnames';

import icon_names from './icon_names';
import SelectIconModalIcons from './select-icon-modal-icons';
import SelectIocnModalUpload from './select-icon-modal-upload';

class SelectIconModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTab: 'icons',
      search: '',
      selectedIcon: ''
    };

    this.setActiveTab = this.setActiveTab.bind(this);
    this.changeSearch = this.changeSearch.bind(this);
    this.selectIcon = this.selectIcon.bind(this);
    this.insertSelectedIcon = this.insertSelectedIcon.bind(this);
  }
  setActiveTab(tab) {
    this.setState({ activeTab: tab });
  }
  changeSearch(e) {
    this.setState({ search: e.target.value });
  }
  selectIcon(icon_name) {
    this.setState({ selectedIcon: icon_name });
  }
  insertSelectedIcon() {
    const {
      selectIcon,
      closeModal,
      setUploadedImage,
      uploadedImage
    } = this.props;
    const { selectedIcon } = this.state;
    if (selectedIcon) {
      selectIcon(selectedIcon);
    }
    if (uploadedImage) {
      setUploadedImage(uploadedImage.url);
    }
    closeModal();
  }
  render() {
    const { closeModal, setLocalUploadedImage, uploadedImage } = this.props;
    const { activeTab, search, selectedIcon } = this.state;
    const searchedIcons = icon_names.filter(
      icon_name => icon_name.indexOf(search) !== -1
    );
    return (
      <div className="pairing-wheel__select-icon-content">
        <div className="pairing-wheel__select-icon-content__title">
          Insert Icon
        </div>
        <div className="pairing-wheel__select-icon__navbar">
          <div className="pairing-wheel__select-icon__navbar__tabs">
            <div
              className={classNames('pairing-wheel__select-icon__navbar__tab', {
                'pairing-wheel__select-icon__navbar__tab--active':
                  activeTab === 'icons'
              })}
              onClick={() => {
                this.setActiveTab('icons');
              }}
            >
              Icons
            </div>
            <div
              className={classNames('pairing-wheel__select-icon__navbar__tab', {
                'pairing-wheel__select-icon__navbar__tab--active':
                  activeTab === 'upload'
              })}
              onClick={() => {
                this.setActiveTab('upload');
              }}
            >
              Upload From Computer
            </div>
          </div>
          <div className="pairing-wheel__select-icon__navbar__search">
            <i className="fa fa-search" />
            <input
              value={search}
              onChange={this.changeSearch}
              placeholder="Search for anything"
            />
          </div>
        </div>
        <div>
          {activeTab === 'icons' && (
            <SelectIconModalIcons
              {...{
                icon_names: searchedIcons,
                selectIcon: this.selectIcon,
                selectedIcon
              }}
            />
          )}
          {activeTab === 'upload' && (
            <SelectIocnModalUpload
              {...{ setLocalUploadedImage, uploadedImage }}
            />
          )}
        </div>
        <div className="pairing-wheel__select-icon-content__footer">
          <button
            type="button"
            className="button pairing-wheel__select-icon-content__footer__cancel"
            onClick={closeModal}
          >
            Cancel
          </button>
          <button
            type="button"
            className="button is-success pairing-wheel__select-icon-content__footer__insert"
            onClick={this.insertSelectedIcon}
          >
            Insert Selected
          </button>
        </div>
      </div>
    );
  }
}

export default SelectIconModal;
