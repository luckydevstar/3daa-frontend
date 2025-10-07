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
  CustomerAssets,
  LogoViewer,
  ContentsViewer
} from '../components';

class CustomerAssetsRoute extends Component {
  constructor(props) {
    super(props);

    this.state = {
      uploadedDefaultBackground: []
    };

    this.onDrop = this.onDrop.bind(this);
  }
  componentDidMount() {
    const { logo_media, router } = this.props;
    if (!logo_media) router.push('/customer/add');
  }
  onDrop(files) {
    const { uploadFile } = this.props;
    uploadFile('brand_assets_header_background', files[0]);
  }

  render() {
    const {
      logoType,
      brand_logo_media,
      brand_logo_scale,
      brand_logo_title,
      brand_logo_font,
      brand_logo_font_size,
      brand_logo_color,
      brand_webfont_system_font,
      brand_colors_primary,
      brand_colors_secondary,
      brand_assets_header_background,
      uploadFile
    } = this.props;

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
                <ContentsViewer
                  {...{
                    brand_webfont_system_font,
                    brand_colors_primary,
                    brand_colors_secondary
                  }}
                />
              </CustomerLiveViewer>
            </div>
            <div className="column is-4">
              <CustomerAssets
                {...{
                  brand_assets_header_background,
                  uploadFile
                }}
              />
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
          <Link to="/customer/summary">
            <button className="button is-primary m-r-30 m-l-20">Next</button>
          </Link>
        </CustomerFooter>
      </div>
    );
  }
}

const mapStateToProps = ({ customer }) => {
  const picked = pickAll(
    [
      'logoType',
      'uiLoadingCustomer',
      'uploadedLogo',
      'brand_logo_scale',
      'brand_logo_title',
      'brand_logo_font',
      'brand_logo_font_size',
      'brand_logo_color',
      'brand_webfont_system_font',
      'brand_colors_primary',
      'brand_colors_secondary'
    ],
    customer
  );
  return {
    ...picked
  };
};

// const mapDispatchToProps = dispatch => ({
//   setUploadedDefaultBackground: uploadedDefaultBackground =>
//     dispatch(Creators.setUploadedDefaultBackground(uploadedDefaultBackground)),
//   removeUploadedDefaultBackground: () =>
//     dispatch(Creators.removeUploadedDefaultBackground())
// });

export default connect(
  mapStateToProps,
  null
)(CustomerAssetsRoute);
