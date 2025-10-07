import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { pickAll } from 'ramda';

import common from 'app/common';
import { Creators } from '../actions';

import {
  CustomerHeader,
  Tabs,
  CustomerFooter,
  CustomerLiveViewer,
  CustomerLogoImage,
  CustomerLogoText,
  AddLogoModal,
  LogoViewer
} from '../components';

const ContentModal = common.components.ContentModal;

class CustomerLogoRoute extends Component {
  constructor(props) {
    super(props);

    this.state = {
      uploadedFile: []
    };

    this.onDrop = this.onDrop.bind(this);
    this.sendLogoToPlatform = this.sendLogoToPlatform.bind(this);
    this.openAddLogoModal = this.openAddLogoModal.bind(this);
    this.closeAddLogoModal = this.closeAddLogoModal.bind(this);
  }
  componentDidMount() {
    const { logo_media, router } = this.props;
    if (!logo_media) router.push('/customer/add');
  }
  onDrop(uploadedFile) {
    this.setState({
      uploadedFile
    });
    setTimeout(() => {
      this.openAddLogoModal();
    }, 100);
  }

  sendLogoToPlatform() {
    const { uploadFile } = this.props;
    const { uploadedFile } = this.state;
    uploadFile('brand_logo_media', uploadedFile[0]);
    this.closeAddLogoModal();
  }
  openAddLogoModal() {
    this.addLogoModal.open();
  }

  closeAddLogoModal() {
    this.addLogoModal.close();
  }

  render() {
    const {
      logoType,
      setLogoType,
      uploadFile,
      brand_logo_media,
      brand_logo_scale,
      brand_logo_title,
      brand_logo_font,
      brand_logo_font_size,
      brand_logo_color,
      setBrandLogoScale,
      setBrandLogoTitle,
      setBrandLogoFont,
      setBrandLogoFontSize,
      setBrandLogoColor
    } = this.props;
    const { uploadedFile } = this.state;
    return (
      <div className="customer-container">
        <CustomerHeader />
        <Tabs />
        <section className="content-container">
          <div className="columns">
            <div className="column is-8">
              <CustomerLiveViewer>
                <LogoViewer
                  {...{
                    logoType,
                    uploadedLogo: brand_logo_media,
                    brand_logo_scale,
                    brand_logo_title,
                    brand_logo_font,
                    brand_logo_font_size,
                    brand_logo_color
                  }}
                />
                <div />
              </CustomerLiveViewer>
            </div>
            <div className="column is-4">
              {logoType === 'image' ? (
                <CustomerLogoImage
                  {...{
                    setLogoType,
                    onDrop: this.onDrop,
                    uploadedLogo: brand_logo_media,
                    removeUploadedLogo: () => {
                      uploadFile('brand_logo_media', null);
                    },
                    brand_logo_scale,
                    setBrandLogoScale
                  }}
                />
              ) : (
                <CustomerLogoText
                  {...{
                    setLogoType,
                    brand_logo_title,
                    brand_logo_font,
                    brand_logo_font_size,
                    brand_logo_color,
                    setBrandLogoTitle,
                    setBrandLogoFont,
                    setBrandLogoFontSize,
                    setBrandLogoColor
                  }}
                />
              )}
            </div>
          </div>
        </section>
        <CustomerFooter>
          <Link to="/customer/add">
            <button className="button is-primary m-r-20">Back</button>
          </Link>
          <Link to="/customer">
            <button className="button is-default is-outlined m-r-10 m-l-10">
              Cancel
            </button>
          </Link>
          <Link to="/customer/fonts">
            <button className="button is-primary m-r-30 m-l-20">Next</button>
          </Link>
        </CustomerFooter>

        <ContentModal
          ref={e => {
            this.addLogoModal = e;
          }}
          className="add-logo-modal"
        >
          <AddLogoModal
            {...{
              sendLogoToPlatform: this.sendLogoToPlatform,
              uploadedFile
            }}
          />
        </ContentModal>
      </div>
    );
  }
}

const mapStateToProps = ({ customer }) => {
  const picked = pickAll(
    [
      'logoType',
      'uiLoadingCustomer',
      'brand_logo_scale',
      'brand_logo_title',
      'brand_logo_font',
      'brand_logo_font_size',
      'brand_logo_color'
    ],
    customer
  );
  return {
    ...picked
  };
};

const mapDispatchToProps = dispatch => ({
  setLogoType: logoType => dispatch(Creators.setLogoType(logoType)),
  setBrandLogoScale: brand_logo_scale =>
    dispatch(Creators.setBrandLogoScale(brand_logo_scale)),
  setBrandLogoTitle: brand_logo_title =>
    dispatch(Creators.setBrandLogoTitle(brand_logo_title)),
  setBrandLogoFont: brand_logo_font =>
    dispatch(Creators.setBrandLogoFont(brand_logo_font)),
  setBrandLogoFontSize: brand_logo_font_size =>
    dispatch(Creators.setBrandLogoFontSize(brand_logo_font_size)),
  setBrandLogoColor: brand_logo_color =>
    dispatch(Creators.setBrandLogoColor(brand_logo_color))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CustomerLogoRoute);
