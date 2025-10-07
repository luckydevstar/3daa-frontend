import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { pickAll } from 'ramda';
import classNames from 'classnames';

import common from 'app/common';
import { Creators } from '../actions';

import {
  CustomerHeader,
  Tabs,
  CustomerFooter,
  CustomerLiveViewer,
  CustomerSummary,
  CustomerOverViewer,
  CustomerPublishModal,
  LogoViewer,
  ContentsViewer
} from '../components';

const ContentModal = common.components.ContentModal;

class CustomerSummaryRoute extends Component {
  constructor(props) {
    super(props);

    this.state = {
      customType: 'liveview',
      errorText: ''
    };

    this.setCustomType = this.setCustomType.bind(this);
    this.openCustomerPublishModal = this.openCustomerPublishModal.bind(this);
    this.closeCustomerPublishModal = this.closeCustomerPublishModal.bind(this);
    this.createCustomer = this.createCustomer.bind(this);
  }

  setCustomType(customType) {
    this.setState({
      customType
    });
  }

  openCustomerPublishModal() {
    this.customerPublishModal.open();
  }

  closeCustomerPublishModal() {
    this.customerPublishModal.close();
  }

  createCustomer(customerToEdit) {
    const {
      firstname,
      lastname,
      email,
      contact_number,
      gender,
      business_owner,
      business_name,
      business_website,
      business_number,
      address_line_1,
      address_line_2,
      country,
      town_city,
      postcode,
      brand_logo_scale,
      brand_logo_title,
      brand_logo_font,
      brand_logo_font_size,
      brand_logo_color,
      brand_webfont_system_font,
      brand_colors_primary,
      brand_colors_secondary,
      brand_colors_accent,
      logo_media,
      organization_media,
      brand_logo_media,
      brand_webfont_media,
      brand_assets_header_background,
      brand_assets_additional_upload,
      createCustomerAttempt,
      editCustomerAttempt
    } = this.props;
    if (
      !brand_colors_primary ||
      !brand_colors_secondary ||
      !brand_colors_accent
    ) {
      this.setState({
        errorText: 'Please select Primary, Secondary and Accent colors'
      });
      return;
    }
    const formData = new FormData();
    formData.append('firstname', firstname);
    formData.append('lastname', lastname);
    formData.append('email', email);
    formData.append('contact_number', contact_number);
    formData.append('gender', gender);
    formData.append('business_owner', business_owner);
    formData.append('business_name', business_name);
    formData.append('business_website', business_website);
    formData.append('business_number', business_number);
    formData.append('address_line_1', address_line_1);
    formData.append('address_line_2', address_line_2);
    formData.append('country', country);
    formData.append('town_city', town_city);
    formData.append('postcode', postcode);
    formData.append('brand_logo_scale', brand_logo_scale);
    formData.append('brand_logo_title', brand_logo_title);
    formData.append('brand_logo_font', brand_logo_font);
    formData.append('brand_logo_font_size', brand_logo_font_size);
    formData.append('brand_logo_color', brand_logo_color);
    formData.append('brand_webfont_system_font', brand_webfont_system_font);
    formData.append(
      'brand_colors_primary',
      brand_colors_primary.replace('#', '')
    );
    formData.append(
      'brand_colors_secondary',
      brand_colors_secondary.replace('#', '')
    );
    formData.append(
      'brand_colors_accent',
      brand_colors_accent.replace('#', '')
    );
    formData.append('logo_media', logo_media.file || null);
    formData.append('organization_media', organization_media.file || null);
    formData.append(
      'brand_logo_media',
      brand_logo_media && brand_logo_media.name ? brand_logo_media : null
    );
    formData.append(
      'brand_webfont_media',
      brand_webfont_media && brand_webfont_media.name
        ? brand_webfont_media
        : null
    );
    formData.append(
      'brand_assets_header_background',
      brand_assets_header_background && brand_assets_header_background.name
        ? brand_assets_header_background
        : null
    );
    formData.append(
      'brand_assets_additional_upload',
      brand_assets_additional_upload && brand_assets_additional_upload.name
        ? brand_assets_additional_upload
        : null
    );
    if (customerToEdit) {
      editCustomerAttempt(formData, customerToEdit);
    } else {
      createCustomerAttempt(formData);
    }
  }

  render() {
    const {
      logoType,
      customerToEdit,
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
      createCustomerAttempting
    } = this.props;

    const { customType, errorText } = this.state;

    return (
      <div className="customer-container">
        <CustomerHeader
          {...{
            title: 'Summary',
            headline: 'Please take a look through the summary of the brand'
          }}
        />
        <Tabs />
        <section className="content-container">
          <div className="columns">
            <div className="column is-8">
              {customType === 'liveview' ? (
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
              ) : (
                <CustomerOverViewer
                  {...{
                    logoType,
                    uploadedLogo: brand_logo_media,
                    brand_logo_scale,
                    brand_logo_title,
                    brand_logo_font,
                    brand_logo_font_size,
                    brand_logo_color,
                    brand_webfont_system_font,
                    brand_colors_primary,
                    brand_colors_secondary,
                    brand_colors_accent
                  }}
                />
              )}
            </div>
            <div className="column is-4">
              <CustomerSummary
                {...{
                  customType,
                  setCustomType: this.setCustomType,
                  logoType,
                  uploadedLogo: brand_logo_media,
                  brand_logo_scale,
                  brand_logo_title,
                  brand_logo_font,
                  brand_logo_font_size,
                  brand_logo_color,
                  brand_webfont_system_font,
                  brand_colors_primary,
                  brand_colors_secondary,
                  brand_colors_accent,
                  errorText
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
          <button
            className={classNames('button is-primary m-r-30 m-l-20', {
              'is-loading': createCustomerAttempting
            })}
            disabled={createCustomerAttempting}
            onClick={() => {
              this.createCustomer(customerToEdit);
            }}
            // onClick={() => this.openCustomerPublishModal()}
          >
            Complete
          </button>
        </CustomerFooter>

        <ContentModal
          ref={e => {
            this.customerPublishModal = e;
          }}
          className="customer-publish-modal"
        >
          <CustomerPublishModal
            {...{
              closeCustomerPublishModal: this.closeCustomerPublishModal
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
      'createCustomerAttempting',
      'logoType',
      'customerToEdit',
      'uiLoadingCustomer',
      'firstname',
      'lastname',
      'email',
      'contact_number',
      'gender',
      'business_owner',
      'business_name',
      'business_website',
      'business_number',
      'address_line_1',
      'address_line_2',
      'country',
      'town_city',
      'postcode',
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
  createCustomerAttempt: (customers, params) =>
    dispatch(Creators.createCustomerAttempt(customers, params)),
  editCustomerAttempt: (params, platform_customer_id) =>
    dispatch(Creators.editCustomerAttempt(params, platform_customer_id))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CustomerSummaryRoute);
