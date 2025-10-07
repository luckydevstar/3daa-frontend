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
  CustomerColor,
  LogoViewer,
  ContentsViewer
} from '../components';

class CustomerColorRoute extends Component {
  componentDidMount() {
    const { logo_media, router } = this.props;
    if (!logo_media) router.push('/customer/add');
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
      brand_colors_accent,
      setBrandColorsPrimary,
      setBrandColorsSecondary,
      setBrandColorsAccent
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
              <CustomerColor
                {...{
                  brand_colors_primary,
                  brand_colors_secondary,
                  brand_colors_accent,
                  setBrandColorsPrimary,
                  setBrandColorsSecondary,
                  setBrandColorsAccent
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
          {/* <button className="button is-dark m-r-10 m-l-10">Save Changes</button> */}
          <Link to="/customer/assets">
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
      'brand_colors_accent'
    ],
    customer
  );
  return {
    ...picked
  };
};

const mapDispatchToProps = dispatch => ({
  setBrandColorsPrimary: brand_colors_primary =>
    dispatch(Creators.setBrandColorsPrimary(brand_colors_primary)),
  setBrandColorsSecondary: brand_colors_secondary =>
    dispatch(Creators.setBrandColorsSecondary(brand_colors_secondary)),
  setBrandColorsAccent: brand_colors_accent =>
    dispatch(Creators.setBrandColorsAccent(brand_colors_accent))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CustomerColorRoute);
