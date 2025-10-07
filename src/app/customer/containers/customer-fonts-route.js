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
  CustomerFontsSystem,
  CustomerFontsUpload,
  LogoViewer,
  ContentsViewer
} from '../components';

class CustomerFontsRoute extends Component {
  constructor(props) {
    super(props);

    this.state = {
      customType: 'system'
    };

    this.setCustomType = this.setCustomType.bind(this);
  }
  componentDidMount() {
    const { logo_media, router } = this.props;
    if (!logo_media) router.push('/customer/add');
  }
  setCustomType(customType) {
    this.setState({
      customType
    });
  }

  render() {
    const {
      logoType,
      brand_logo_scale,
      brand_logo_title,
      brand_logo_font,
      brand_logo_font_size,
      brand_logo_color,
      brand_webfont_system_font,
      setBrandWebfontSystemFont,
      brand_colors_primary,
      brand_colors_secondary,
      brand_logo_media,
      uploadFile
    } = this.props;
    const { customType } = this.state;

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
              {customType === 'system' ? (
                <CustomerFontsSystem
                  {...{
                    brand_webfont_system_font,
                    setCustomType: this.setCustomType,
                    setBrandWebfontSystemFont
                  }}
                />
              ) : (
                <CustomerFontsUpload
                  {...{
                    brand_webfont_system_font,
                    uploadFile,
                    setCustomType: this.setCustomType
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
          <Link to="/customer/colours">
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
      'brand_colors_secondary',
      'colorAccent'
    ],
    customer
  );
  return {
    ...picked
  };
};

const mapDispatchToProps = dispatch => ({
  setBrandWebfontSystemFont: brand_webfont_system_font =>
    dispatch(Creators.setBrandWebfontSystemFont(brand_webfont_system_font))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CustomerFontsRoute);
