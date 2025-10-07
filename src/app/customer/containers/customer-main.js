import React from 'react';
import { connect } from 'react-redux';
import { Creators } from '../actions';

class CustomerMain extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      logo_media: null,
      organization_media: null,
      brand_logo_media: null,
      brand_webfont_media: null,
      brand_assets_header_background: null,
      brand_assets_additional_upload: null
    };
    this.uploadFile = this.uploadFile.bind(this);
    this.cancelClick = this.cancelClick.bind(this);
  }
  componentDidMount() {
    const {
      logo_media_url,
      organization_media_url,
      brand_logo_media_url
    } = this.props;
    if (logo_media_url) {
      this.setState({
        logo_media: {
          url: logo_media_url
        },
        organization_media: {
          url: organization_media_url
        },
        brand_logo_media: {
          preview: brand_logo_media_url
        }
      });
    }
  }
  componentWillUnmount() {
    const { resetCustomerData } = this.props;
    resetCustomerData();
  }
  uploadFile(name, file) {
    this.setState({
      [name]: file
    });
  }
  cancelClick() {
    const { router, resetCustomerData } = this.props;
    resetCustomerData();
    router.push('/customer');
  }
  render() {
    const { children } = this.props;
    const {
      logo_media,
      organization_media,
      brand_logo_media,
      brand_webfont_media,
      brand_assets_header_background,
      brand_assets_additional_upload
    } = this.state;
    return React.cloneElement(children, {
      logo_media,
      organization_media,
      brand_logo_media,
      brand_webfont_media,
      brand_assets_header_background,
      brand_assets_additional_upload,
      uploadFile: this.uploadFile,
      cancelClick: this.cancelClick
    });
  }
}

const mapStateToProps = ({ customer }) => ({
  ...customer
});

const mapDispatchToProps = dispatch => ({
  resetCustomerData: () => dispatch(Creators.resetCustomerData())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CustomerMain);
