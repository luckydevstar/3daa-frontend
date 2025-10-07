import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Creators } from '../actions';
import common from 'app/common';

import { AddCustomerInfo, AddBusinessInfo } from '../components';

const { Footer } = common.components;

class CustomerAddRoute extends Component {
  constructor(props) {
    super(props);

    this.state = {
      pageName: 'customer',
      business_owner: '',
      business_name: '',
      business_website: '',
      business_number: '',
      address_line_1: '',
      address_line_2: '',
      country: '',
      town_city: '',
      postcode: '',
      logo_media: '',
      organization_media: '',
      errorText: ''
    };

    this.setPageName = this.setPageName.bind(this);
    this.uploadFile = this.uploadFile.bind(this);
    this.customerInfoValidation = this.customerInfoValidation.bind(this);
  }

  setPageName(pageName) {
    const { router } = this.props;
    if (pageName === 'business') {
      const errorText = this.customerInfoValidation();
      if (errorText) {
        this.setState({
          errorText
        });
        return;
      }
    } else {
      const errorText = this.businessInfoValidation();
      if (errorText) {
        this.setState({
          errorText
        });
      } else {
        router.push('/customer/logo');
      }
      return;
    }
    this.setState({
      pageName,
      errorText: ''
    });
  }

  customerInfoValidation() {
    const {
      firstname,
      lastname,
      email,
      gender,
      contact_number,
      logo_media
    } = this.props;
    if (
      !firstname ||
      !lastname ||
      !email ||
      !gender ||
      !contact_number ||
      !logo_media
    )
      return 'Please fill in all required fields';
    if (contact_number.length < 8)
      return 'The Contact Number field length must be more then 8';
    if (!/^[A-Za-z]+$/.test(firstname))
      return 'The Firstname field may only contain alphabetical characters';
    if (!/^[A-Za-z]+$/.test(lastname))
      return 'The Lastname field may only contain alphabetical characters';
    if (!/^[0-9]+$/.test(contact_number))
      return 'The Contact Number field may only contain numerical characters';
    if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))
      return 'The Email field must contain a valid email address';
    return false;
  }

  businessInfoValidation() {
    const {
      organization_media,
      business_owner,
      business_name,
      business_website,
      business_number,
      address_line_1,
      address_line_2,
      town_city,
      postcode
    } = this.props;
    if (
      !organization_media ||
      !business_owner ||
      !business_name ||
      !business_number ||
      !address_line_1 ||
      !town_city ||
      !postcode
    )
      return 'Please fill in all required fields';
    const websiteRegex = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/;
    if (!/^[0-9]+$/.test(business_number))
      return 'The Company Contact Number field must contain only numbers';
    if (business_number.length < 8)
      return 'The Company Contact Number field must be at least 8 characters in length';
    if (business_website.length > 0 && !websiteRegex.test(business_website))
      return 'The Company Website field must contain a valid website';
  }

  inputChange(name, value) {
    this.setState({
      [name]: value
    });
  }

  uploadFile(e) {
    const { uploadFile } = this.props;
    const { name } = e.target;
    const reader = new FileReader();
    const file = e.target.files[0];
    if (file.type.indexOf('image') !== -1) {
      reader.onload = event => {
        uploadFile(name, {
          file,
          url: event.target.result
        });
      };
      reader.readAsDataURL(file);
    }
  }

  render() {
    const { pageName, errorText } = this.state;
    const {
      firstname,
      lastname,
      gender,
      email,
      contact_number,
      logo_media,
      organization_media,
      business_owner,
      business_name,
      business_website,
      business_number,
      address_line_1,
      address_line_2,
      town_city,
      postcode,
      country,
      setFirstName,
      setLastName,
      setEmail,
      setContactNumber,
      setGender,
      setBusinessOwner,
      setBusinessName,
      setBusinessWebsite,
      setBusinessNumber,
      setAddressLine1,
      setAddressLine2,
      setCountry,
      setTownCity,
      setPostcode
    } = this.props;
    return (
      <div className="customer-container">
        <section className="content-section">
          <div className="container">
            <div className="customer-add-route">
              {pageName === 'customer' ? (
                <AddCustomerInfo
                  {...{
                    firstname,
                    lastname,
                    email,
                    gender,
                    contact_number,
                    setFirstName,
                    setLastName,
                    setEmail,
                    setContactNumber,
                    setGender,
                    logo_media,
                    errorText,
                    uploadFile: this.uploadFile,
                    onSubmit: () => this.setPageName('business')
                  }}
                />
              ) : (
                <AddBusinessInfo
                  {...{
                    organization_media,
                    business_owner,
                    business_name,
                    business_website,
                    business_number,
                    address_line_1,
                    address_line_2,
                    town_city,
                    postcode,
                    country,
                    setBusinessOwner,
                    setBusinessName,
                    setBusinessWebsite,
                    setBusinessNumber,
                    setAddressLine1,
                    setAddressLine2,
                    setCountry,
                    setTownCity,
                    setPostcode,
                    errorText,
                    uploadFile: this.uploadFile,
                    onSubmit: () => this.setPageName('customer')
                  }}
                />
              )}
            </div>
          </div>
        </section>
        <Footer />
      </div>
    );
  }
}

const mapStateToProps = ({ customer }) => ({
  ...customer
});

const mapDispatchToProps = dispatch => ({
  getCustomersAttempt: () => dispatch(Creators.getCustomersAttempt()),
  setFirstName: firstname => dispatch(Creators.setFirstName(firstname)),
  setLastName: lastname => dispatch(Creators.setLastName(lastname)),
  setEmail: email => dispatch(Creators.setEmail(email)),
  setContactNumber: contact_number =>
    dispatch(Creators.setContactNumber(contact_number)),
  setGender: gender => dispatch(Creators.setGender(gender)),
  setBusinessOwner: business_owner =>
    dispatch(Creators.setBusinessOwner(business_owner)),
  setBusinessName: business_name =>
    dispatch(Creators.setBusinessName(business_name)),
  setBusinessWebsite: business_website =>
    dispatch(Creators.setBusinessWebsite(business_website)),
  setBusinessNumber: business_number =>
    dispatch(Creators.setBusinessNumber(business_number)),
  setAddressLine1: address_line_1 =>
    dispatch(Creators.setAddressLine1(address_line_1)),
  setAddressLine2: address_line_2 =>
    dispatch(Creators.setAddressLine2(address_line_2)),
  setCountry: country => dispatch(Creators.setCountry(country)),
  setTownCity: town_city => dispatch(Creators.setTownCity(town_city)),
  setPostcode: postcode => dispatch(Creators.setPostcode(postcode))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CustomerAddRoute);
