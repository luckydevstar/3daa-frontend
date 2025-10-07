import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link, browserHistory } from 'react-router';
import * as lodash from 'lodash';
import { Creators as Actions } from '../actions';
import { Roles } from 'app/core/config/constants';

import config from 'brand/config';
import common from 'app/common';
import components from '../components';

const {
  StoreHeader,
  StoreStepbar,
  StoreCardFront,
  StoreCardBack,
  AssignLicense
} = components;

const {
  CentreAdmin,
  CentreTutor,
  CentreLearner,
  SuperAdmin,
  SiteAdmin,
  Member
} = Roles;

const {
  util: {
    helpers: { extractUserRole }
  }
} = common;

const { UIFlipper, ContentModal, Footer, UIExplorerNav } = common.components;

class SelectQualification extends Component {
  constructor(props) {
    super(props);
    this.state = {
      centreRoles: [CentreTutor, CentreAdmin],
      adminRoles: [SiteAdmin, SuperAdmin],
      learnerRoles: [CentreLearner, Member],
      allowAssignQualification: false,
      searchQuery: ''
    };

    this.openAssignLicenseModal = this.openAssignLicenseModal.bind(this);
    this.closeAssignLicenseModal = this.closeAssignLicenseModal.bind(this);
  }

  UNSAFE_componentWillMount() {
    const {
      user,
      getAllQualificationsInStoreAttempt,
      cleanSelectedCentreMembers
    } = this.props;

    const { centreRoles } = this.state;

    const role = extractUserRole(user);

    cleanSelectedCentreMembers();

    if (centreRoles.indexOf(role) > -1) {
      this.setState({
        allowAssignQualification: true
      });
    }
  }

  componentDidMount() {
    const { user, getAllQualificationsInStoreAttempt } = this.props;
    getAllQualificationsInStoreAttempt(null);
  }

  openAssignLicenseModal() {
    this.assignLicenseModal.open();
  }

  closeAssignLicenseModal() {
    this.assignLicenseModal.close();
  }

  render() {
    const {
      attemptingGetQualificationsInStore,
      qualifications,
      addToCart
    } = this.props;
    const { allowAssignQualification, searchQuery } = this.state;

    let filteredItems = qualifications;

    if (searchQuery) {
      const phrase = searchQuery.trim().toLowerCase();
      filteredItems = qualifications.filter(
        item => item.title.toLowerCase().indexOf(phrase) >= 0
      );
    }

    return (
      <div className="select-course">
        <StoreHeader
          title="Store"
          subtitle={`Welcome to the ${config.title} Store`}
          showBackButton={false}
          showCheckoutButton={false}
          showUploadFileButton={false}
          showBasketButton={true}
        />
        <UIExplorerNav>
          <StoreStepbar
            steps={['Select Course', 'Basket']}
            onSearch={e => this.setState({ searchQuery: e })}
          />
        </UIExplorerNav>
        <div className="store-card-view-container p-t-20 p-b-20">
          <div className="store-cards">
            {filteredItems &&
              filteredItems.map((item, i) => (
                <div key={i} className="store-card">
                  <UIFlipper
                    front={
                      <StoreCardFront
                        qualification={item}
                        addToCart={addToCart}
                        allowAssignQualification={allowAssignQualification}
                        openAssignLicenseModal={this.openAssignLicenseModal}
                      />
                    }
                    back={
                      <StoreCardBack
                        qualification={item}
                        addToCart={addToCart}
                      />
                    }
                  />
                </div>
              ))}
          </div>
        </div>

        <Footer />

        <ContentModal
          className="assign-license-modal"
          ref={e => {
            this.assignLicenseModal = e;
          }}
        >
          <AssignLicense />
        </ContentModal>
      </div>
    );
  }
}

SelectQualification.propTypes = {
  qualifications: PropTypes.array
};

SelectQualification.defaultProps = {
  qualifications: []
};

const mapStateToProps = ({ store, profile: { user } }) => ({
  user,
  attemptingGetQualificationsInStore: store.attemptingGetQualificationsInStore,
  qualifications: store.qualifications
});

const mapDispatchToProps = dispatch => ({
  addToCart: qualification_id => {
    dispatch(Actions.addToCart(qualification_id, 1));
    browserHistory.push('/store/basket');
  },
  getAllQualificationsInStoreAttempt: params =>
    dispatch(Actions.getAllQualificationsInStoreAttempt(params)),
  cleanSelectedCentreMembers: () =>
    dispatch(Actions.cleanSelectedCentreMembers())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SelectQualification);

// import React, { Component } from 'react';
// import PropTypes from 'prop-types';
// import { connect } from 'react-redux';
// import { Link, browserHistory } from 'react-router';
// import * as lodash from 'lodash';
// import { Creators as Actions } from '../actions';
// import { Roles } from 'app/core/config/constants';

// import config from 'brand/config';
// import common from 'app/common';
// import components from '../components';

// const {
//   StoreHeader,
//   StoreStepbar,
//   StoreCardFront,
//   StoreCardBack,
//   AssignLicense
// } = components;

// const {
//   CentreAdmin,
//   CentreTutor,
//   CentreLearner,
//   SuperAdmin,
//   SiteAdmin,
//   Member
// } = Roles;

// const {
//   util: {
//     helpers: { extractUserRole }
//   }
// } = common;

// const { UIFlipper, ContentModal, Footer, UIExplorerNav } = common.components;

// class SelectQualification extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       centreRoles: [CentreTutor, CentreAdmin],
//       adminRoles: [SiteAdmin, SuperAdmin],
//       learnerRoles: [CentreLearner, Member],
//       allowAssignQualification: false,
//       searchQuery: ''
//     };

//     this.openAssignLicenseModal = this.openAssignLicenseModal.bind(this);
//     this.closeAssignLicenseModal = this.closeAssignLicenseModal.bind(this);
//   }

//   componentWillMount() {
//     const {
//       user,
//       getAllQualificationsInStoreAttempt,
//       cleanSelectedCentreMembers
//     } = this.props;

//     const { centreRoles } = this.state;

//     const role = extractUserRole(user);

//     cleanSelectedCentreMembers();

//     if (centreRoles.indexOf(role) > -1) {
//       this.setState({
//         allowAssignQualification: true
//       });
//     }
//   }

//   componentDidMount() {
//     const { user, getAllQualificationsInStoreAttempt } = this.props;
//     getAllQualificationsInStoreAttempt(null);
//   }

//   openAssignLicenseModal() {
//     this.assignLicenseModal.open();
//   }

//   closeAssignLicenseModal() {
//     this.assignLicenseModal.close();
//   }

//   render() {
//     const {
//       attemptingGetQualificationsInStore,
//       qualifications,
//       addToCart
//     } = this.props;
//     const { allowAssignQualification, searchQuery } = this.state;

//     let filteredItems = qualifications;

//     if (searchQuery) {
//       const phrase = searchQuery.trim().toLowerCase();
//       filteredItems = qualifications.filter(
//         item => item.title.toLowerCase().indexOf(phrase) >= 0
//       );
//     }

//     return (
//       <div className="select-course">
//         <StoreHeader
//           title="Store"
//           subtitle={`Welcome to the ${config.title} Store`}
//           showBackButton={false}
//           showCheckoutButton={true}
//           showUploadFileButton={false}
//           showBasketButton={true}
//         />
//         <UIExplorerNav>
//           <StoreStepbar
//             steps={['Select Course', 'Basket', 'Checkout']}
//             onSearch={e => this.setState({ searchQuery: e })}
//           />
//         </UIExplorerNav>
//         <div className="store-card-view-container p-t-20 p-b-20">
//           <div className="container">
//             <div className="columns store-cards is-multiline is-paddingless is-marginless">
//               {filteredItems &&
//                 filteredItems.map((item, i) => (
//                   <div
//                     key={i}
//                     className="column store-card is-3-widescreen is-3-desktop is-6-tablet is-12-mobile"
//                   >
//                     <UIFlipper
//                       front={
//                         <StoreCardFront
//                           qualification={item}
//                           addToCart={addToCart}
//                           allowAssignQualification={allowAssignQualification}
//                           openAssignLicenseModal={this.openAssignLicenseModal}
//                         />
//                       }
//                       back={
//                         <StoreCardBack
//                           qualification={item}
//                           addToCart={addToCart}
//                         />
//                       }
//                     />
//                   </div>
//                 ))}
//             </div>
//           </div>
//         </div>

//         <Footer />

//         <ContentModal
//           className="assign-license-modal"
//           ref={e => {
//             this.assignLicenseModal = e;
//           }}
//         >
//           <AssignLicense />
//         </ContentModal>
//       </div>
//     );
//   }
// }

// SelectQualification.propTypes = {
//   qualifications: PropTypes.array
// };

// SelectQualification.defaultProps = {
//   qualifications: []
// };

// const mapStateToProps = ({ store, profile: { user } }) => ({
//   user,
//   attemptingGetQualificationsInStore: store.attemptingGetQualificationsInStore,
//   qualifications: store.qualifications
// });

// const mapDispatchToProps = dispatch => ({
//   addToCart: qualification_id => {
//     dispatch(Actions.addToCart(qualification_id, 1));
//     browserHistory.push('/store/basket');
//   },
//   getAllQualificationsInStoreAttempt: params =>
//     dispatch(Actions.getAllQualificationsInStoreAttempt(params)),
//   cleanSelectedCentreMembers: () =>
//     dispatch(Actions.cleanSelectedCentreMembers())
// });

// export default connect(
//   mapStateToProps,
//   mapDispatchToProps
// )(SelectQualification);
