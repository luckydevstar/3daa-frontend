import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Field, reduxForm, change, initialize } from 'redux-form';
import * as Papa from 'papaparse';
import XLSX from 'xlsx';
import classNames from 'classnames';
import * as lodash from 'lodash';

import { Label, Text } from 'app/intl';
import userUtil from 'app/user/util/';
import unitsUtil from 'app/units/util/';
import common from 'app/common';
import { Roles } from 'app/core/config/constants';
import ENDPOINT from 'app/core/config/endpoints';
import API from 'app/core/services/api';

import { Creators as QualificationActions } from 'app/qualifications/actions';
import { Creators as QualificationStoreActions } from 'app/store/actions';
import { Creators as CommunityActions } from '../../actions';

import CommunityInviteList from '../invite/community-invite-list';
import CommuntyInviteSelectedItems from '../invite/community-invite-selected-items';
import CommuntyInviteAddedItems from '../invite/community-invite-added-items';

import Isvg from 'react-inlinesvg';

import IconEmailNotification from 'images/icon_email_notification.svg';

const {
  util: {
    helpers: {
      createCloudinaryUrl,
      extractUserRole,
      extractUserCentre,
      humanReadableRole,
      UserAccess
    },
    notify: { notifyError }
  },
  components: { Navigation, UITabs }
} = common;

const {
  CentreAdmin,
  CentreTutor,
  CentreLearner,
  SuperAdmin,
  SiteAdmin
} = Roles;

const {
  Form: { field, select, dropzone },
  UILoading,
  UISelectDropdown
} = common.components;

const FormField = field;
const { FormUtil } = userUtil;

const FORM_NAME = 'communityModalInvite';
const errorMesage = "Data doesn't exist";

class CommunityModalInvite extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user_type: null,

      steps: [
        {
          title: 'Add a USER',
          subTitle: 'Please select the type of USER you want to add'
        },
        {
          title: 'Add a Centre',
          subTitle: 'Please select how you want to add the Centre'
        },
        {
          title: 'Add a Centre',
          subTitle:
            'Please check that this is all correct before adding the Centre(s)'
        },
        {
          title: 'Your Centres has been added',
          subTitle: 'Notifications have been sent to the Centre(s)'
        }
      ],
      currentStep: 0,

      tabs: {
        CENTRE_ADMIN_ROLE: ['Invite a New Centre'],
        SITE_ADMIN_ROLE: ['Invite a New Admin', 'Add Admin from file'],
        CENTRE_TUTOR_ROLE: ['Invite a New Tutor'],
        CENTRE_LEARNER_ROLE: [
          'Search for a Learner',
          'Invite a New Learner',
          'Add Learners from file'
        ]
      },

      activeTab: 0,
      anohterButtonText: '',
      centres: [],
      members: [],

      filteredLearners: [],
      filteredMembers: [],
      filteredCentres: [],
      filteredQualifications: [],

      formFields: [],
      searchTerm: '',
      addedInvites: [],
      file: null,
      numberOfInvites: 0,

      selectedLearners: [],
      selectedCentres: [],
      selectedQualifications: [],

      attemptingInvite: false
    };

    this.renderQuery = this.renderQuery.bind(this);
    this.handleTabChange = this.handleTabChange.bind(this);
    this.handleSearchChange = this.handleSearchChange.bind(this);
    this.handleInvitesFile = this.handleInvitesFile.bind(this);
    this.updateData = this.updateData.bind(this);

    this.renderInputForm = this.renderInputForm.bind(this);
    this.renderFileInput = this.renderFileInput.bind(this);

    this.renderAddedInviteNum = this.renderAddedInviteNum.bind(this);
    this.renderList = this.renderList.bind(this);
    this.renderSelectedItems = this.renderSelectedItems.bind(this);
    this.onSelectedItem = this.onSelectedItem.bind(this);

    (this.addInviteValues = this.addInviteValues.bind(this)),
      (this.onAddInvites = this.onAddInvites.bind(this)),
      (this.onSetUserType = this.onSetUserType.bind(this)),
      (this.onSkip = this.onSkip.bind(this));
    this.onBack = this.onBack.bind(this);
    this.onNext = this.onNext.bind(this);
    this.isInValidNext = this.isInValidNext.bind(this);
    this.isInValidAnother = this.isInValidAnother.bind(this);

    this.isVisibleAnotherButton = this.isVisibleAnotherButton.bind(this);

    this.sendInvite = this.sendInvite.bind(this);
    this.createCentre = this.createCentre.bind(this);
  }

  UNSAFE_componentWillMount() {
    const {
      user,
      routeRole,
      learners,
      members,
      centres,
      qualifications,
      getAllCentresAttempt,
      getAllQualificationsInStoreAttempt
    } = this.props;

    const userRole = extractUserRole(user);
    const userCentre = extractUserCentre(user);

    if ([CentreAdmin, SuperAdmin, SiteAdmin].indexOf(userRole) >= 0) {
      getAllCentresAttempt(null, userRole);
    }

    getAllQualificationsInStoreAttempt(null);

    this.setState({
      currentStep: routeRole && routeRole != SuperAdmin ? 1 : 0,
      filteredLearners: learners,
      centres: centres,
      members: members,
      filteredQualifications: qualifications
    });

    if (routeRole && routeRole != SuperAdmin) this.onSetUserType(routeRole);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const {
      attemptingInvite,
      centres,
      members,
      qualifications,
      closeModal
    } = nextProps;
    const { currentStep, user_type } = this.state;

    if (
      this.props.attemptingInvite &&
      !attemptingInvite &&
      user_type === CentreAdmin
    ) {
      closeModal();
    }
    if (
      this.state.attemptingInvite != attemptingInvite &&
      user_type !== CentreAdmin
    ) {
      this.setState({
        attemptingInvite: attemptingInvite,
        currentStep: attemptingInvite ? currentStep : currentStep + 1
      });
    }

    if (this.state.centres != centres) {
      this.setState({ centres: centres, filteredCentres: centres });
    }

    if (this.state.members != members) {
      this.setState({ members: members, filteredMembers: members });
    }

    if (this.state.qualifications != qualifications) {
      this.setState({ filteredQualifications: qualifications });
    }
  }

  renderQuery(whatFor) {
    const { user_type, currentStep, activeTab } = this.state;
    let label = '';
    let visibleSkip = false;

    if (!user_type) return;

    switch (whatFor) {
      case 'learner':
        if ([CentreLearner, CentreTutor].indexOf(user_type) < 0) return null;
        if (currentStep != 1 || activeTab != 0) return null;
        label = 'Name';
        break;
      case 'centre':
        if ([CentreLearner, CentreTutor].indexOf(user_type) < 0) return null;
        if (currentStep != 2 || activeTab != 0) return null;
        label = 'Add a Centre';
        break;
      case 'qualification':
        if ([CentreLearner].indexOf(user_type) < 0) return null;
        if (currentStep != 3 || activeTab != 0) return null;
        label = 'Choose a Qualifications';
        visibleSkip = true;
        break;
      default:
        return null;
    }

    return (
      <div className="p-15">
        <div className="query-label p-l-5">
          <label> {label} </label>
        </div>
        <div className="columns">
          <div className="column">
            <Field
              name="searchQuery"
              type="text"
              component={FormField}
              placeholder="Type to Search..."
              onKeyUp={e => {
                this.handleSearchChange(e);
              }}
            />
          </div>
          {visibleSkip && (
            <div className="skip-btn column">
              <a onClick={e => this.onSkip()}>Skip</a>
            </div>
          )}
        </div>
      </div>
    );
  }

  handleTabChange(newTab) {
    this.setState({
      activeTab: newTab
    });
  }

  handleInvitesFile(files) {
    this.setState({
      file: files[0]
    });

    if (files[0] && files[0].type.indexOf('csv') >= 0) {
      Papa.parse(files[0], {
        complete: this.updateData,
        header: true
      });
    } else {
      // console.log(XLSX.readFile(files[0]))
      // console.log(XLSX.utils.sheet_to_json(files[0]))
    }
  }

  updateData(result) {
    const { currentStep, addedInvites } = this.state;
    const data = result.data;

    if (data && data.length > 0) {
      let newInvites = [];
      const keys = lodash.keys(data[0]);

      data.forEach(item => {
        let newInvite = {};
        keys.forEach(key => {
          newInvite[key] = item[key];
        });
        newInvites.push(newInvite);
      });

      this.setState({
        numberOfInvites: data.length,
        addedInvites: [...addedInvites, ...newInvites]
        // currentStep: currentStep + 1
      });
    }
  }

  renderTabs(activeTab, tabs, change, translate) {
    return (
      <div className="is-flex" style={{ justifyContent: 'center' }}>
        {tabs.map((tab, i) => (
          <button
            key={'tab' + i}
            type="button"
            className={classNames('button', {
              'is-primary': i == activeTab,
              'is-outlined': i != activeTab
            })}
            style={{ margin: '0 5px' }}
            onClick={e => change(i)}
          >
            {tab}
          </button>
        ))}
      </div>
    );
  }

  renderInputForm() {
    const { user_type, currentStep, activeTab, formFields } = this.state;

    if (!user_type) return;

    switch (user_type) {
      case CentreAdmin:
      case SiteAdmin:
        if ([1, 2].indexOf(currentStep) < 0 || activeTab != 0) return null;
        break;
      case CentreTutor:
        if (currentStep != 1) return null;
        break;
      case CentreLearner:
        if (currentStep != 1 || activeTab != 1) return null;
        break;
    }

    return (
      <div className="p-15" style={{ maxWidth: '480px', margin: 'auto' }}>
        {formFields.map((field, index) => {
          return (
            <div key={'filed' + index}>
              <div className="p-5">
                <label> {field.label} </label>
              </div>
              <div>
                <Field
                  name={field.name}
                  type="text"
                  component={FormField}
                  placeholder={field.placeholder}
                />
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  renderFileInput() {
    const {
      user_type,
      currentStep,
      activeTab,
      file,
      numberOfInvites
    } = this.state;

    if (!user_type) return;

    switch (user_type) {
      case CentreAdmin:
      case SiteAdmin:
        if (currentStep != 1 || activeTab != 1) return null;
        break;
      case CentreTutor:
      case CentreLearner:
        if (currentStep != 1 || activeTab != 2) return null;
        break;
    }

    const templateURL = `${API.baseURL()}${
      ENDPOINT.SYSTEM_DOWNLOAD_INVITE_TEMPLATE
    }?role=${user_type}&type=file`;

    return (
      <div className="columns m-t-30">
        <div className="column has-text-centered step2 create-file-section">
          <div>
            <div className="section-title">
              Create a file with list of users
            </div>
          </div>
          <div className="description-1">
            <div>File should be in excel format. It should include 3</div>
            <div>columns, in this order:</div>
          </div>
          <div />
          <div className="m-b-15 description-2">
            <div>Name of Centre, Centre Number,</div>
            <div>email address of the Header of Centre</div>
          </div>
          <div>
            <a
              href={templateURL}
              download
              className={`button is-primary is-outlined`}
            >
              or download our template
            </a>
          </div>
        </div>
        <div className="column step2 uploading-list-section">
          <div>
            <div className="section-title">Uploading your list of users</div>
          </div>
          <div>Your list of learners will be uploaded shortly.</div>
          <div className="m-b-15">Please wait for this to complete.</div>
          <div className="fileUploader">
            <label
              className="fileUploader__body fileUploader--labelOnly button is-primary is-outlined"
              htmlFor="invitesFile"
            >
              Upload your Excel or CSV File
              <input
                type="file"
                name="invitesFile"
                accept=".csv, text/csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                onChange={({ target: { files } }) =>
                  this.handleInvitesFile(files)
                }
              />
            </label>
          </div>
          <div className="columns is-marginless space-between p-t-15">
            {file && (
              <div className="column is-paddingless">
                {'List of Learners(' + file.type + ' ' + file.size + 'KB)'}
              </div>
            )}
            {numberOfInvites > 0 && (
              <div className="column is-paddingless has-text-right">
                {numberOfInvites + ' Learners detected'}
              </div>
            )}
          </div>
          <div />
        </div>
      </div>
    );
  }

  renderSelectedItems(whatFor) {
    const {
      user_type,
      steps,
      currentStep,
      activeTab,
      addedInvites,
      selectedLearners,
      selectedCentres,
      selectedQualifications
    } = this.state;

    let label = '';
    let selectedItems = [];

    if (!user_type) return;

    switch (whatFor) {
      case 'invites':
        if ([CentreLearner, CentreTutor].indexOf(user_type) < 0) return null;
        if (activeTab == 1 && currentStep < 2) return null;

        if ([CentreLearner].indexOf(user_type) >= 0) {
          label = 'Learners Selected';
        } else if ([CentreTutor].indexOf(user_type) >= 0) {
          label = 'Tutor Selected';
        }

        if (activeTab == 0) {
          selectedItems = selectedLearners;
        } else {
          selectedItems = addedInvites;
        }

        break;
      case 'centre':
        if ([CentreLearner, CentreTutor].indexOf(user_type) < 0) return null;
        if (currentStep < 2) return null;
        label = 'Centres Selected';
        selectedItems = selectedCentres;
        break;
      case 'qualification':
        if ([CentreLearner, CentreTutor].indexOf(user_type) < 0) return null;
        if (currentStep < 3) return null;
        label = 'Qualifications Selected';
        selectedItems = selectedQualifications;
        break;
    }

    if (selectedItems.length < 1 || currentStep == steps.length - 1)
      return null;

    return (
      <div className="p-15">
        <div className="m-b-15">{label}</div>
        <div className="m-l-20">
          <CommuntyInviteSelectedItems
            whatFor={whatFor}
            items={selectedItems}
            onClose={e => this.onSelectedItem(null, whatFor, e)}
          />
        </div>
      </div>
    );
  }

  renderAddedInviteNum(whatFor) {
    const { addedInvites } = this.state;

    switch (whatFor) {
      case 'invites':
        return (
          <div className="m-b-10">
            <a className="subtitle">{'Invites Added ' + addedInvites.length}</a>
          </div>
        );
    }
    return null;
  }

  renderList(whatFor) {
    const {
      user_type,
      currentStep,
      steps,
      activeTab,
      formFields,
      addedInvites,
      selectedLearners,
      selectedCentres,
      selectedQualifications,
      filteredLearners,
      filteredCentres,
      filteredQualifications,
      anohterButtonText,
      searchTerm
    } = this.state;

    let items = [];
    let selectedItems = [];

    if (!user_type) return;

    switch (whatFor) {
      case 'invites':
        if ([CentreAdmin, SiteAdmin].indexOf(user_type) >= 0) {
          if (
            [1, 2, steps.length - 2].indexOf(currentStep) < 0 ||
            activeTab != 0
          )
            return null;
        } else if ([CentreLearner, CentreTutor].indexOf(user_type) >= 0) {
          if ([1].indexOf(currentStep) < 0 || activeTab != 1) return null;
        }
        items = addedInvites;
        selectedItems = [];
        break;

      case 'learner':
        if ([CentreLearner, CentreTutor].indexOf(user_type) < 0) return null;
        if (currentStep != 1 || activeTab != 0) return null;
        items = filteredLearners;
        selectedItems = selectedLearners;
        break;

      case 'centre':
        if ([CentreLearner, CentreTutor].indexOf(user_type) < 0) return null;
        if (currentStep != 2) return null;
        items = filteredCentres;
        selectedItems = selectedCentres;
        break;

      case 'qualification':
        if ([CentreLearner].indexOf(user_type) < 0) return null;
        if (currentStep != 3) return null;
        items = filteredQualifications;
        selectedItems = selectedQualifications;
        break;
    }

    if (items.length < 1) return null;

    return (
      <div
        className="body"
        style={{ overflowY: 'auto', height: '250px', maxHeight: '250px' }}
      >
        {this.isVisibleAnotherButton() && (
          <div
            className="is-flex m-b-15"
            style={{ maxWidth: '450px', margin: 'auto' }}
          >
            <div className="">
              <button
                type="button"
                disabled={this.isInValidAnother()}
                className={`button is-primary btn-sed m-r-15`}
                onClick={e => this.onAddInvites(false)}
              >
                {anohterButtonText}
              </button>
            </div>
            <div className="" style={{ minWidth: '265px' }}>
              <Field
                name="searchInviteList"
                type="text"
                component={FormField}
                placeholder="Type to Search..."
                onKeyUp={e => {
                  this.setState({ searchTerm: e.target.value });
                }}
              />
            </div>
          </div>
        )}

        {whatFor == 'invites' ? (
          <CommuntyInviteAddedItems
            userType={user_type}
            whatFor={whatFor}
            items={items}
            searchQuery={searchTerm}
            onClose={item => this.onSelectedItem(null, whatFor, item)}
          />
        ) : (
          <CommunityInviteList
            userType={user_type}
            whatFor={whatFor}
            items={items}
            selectedItems={selectedItems}
            onChange={(e, item) => this.onSelectedItem(e, whatFor, item)}
          />
        )}
      </div>
    );
  }

  handleSearchChange(e) {
    const phrase = e.target.value;
    const { currentStep, centres } = this.state;

    const { learners, qualifications } = this.props;

    if (phrase) {
      switch (currentStep) {
        case 1:
          this.setState({
            filteredLearners: learners.filter(
              l => l.profile_name.indexOf(phrase) >= 0
            )
          });
          break;
        case 2:
          this.setState({
            filteredCentres: lodash.filter(
              centres,
              l => l.centre_name.indexOf(phrase) >= 0
            )
          });
          break;
        case 3:
          this.setState({
            filteredQualifications: qualifications.filter(
              q => q.title.indexOf(phrase) >= 0
            )
          });
      }
    }
  }

  onSelectedItem(e, whatFor, item) {
    switch (whatFor) {
      case 'invites':
      case 'learner':
        if (item.first_name || item.name) {
          this.setState({
            addedInvites: this.state.addedInvites.filter(i => i != item)
          });
        } else {
          if (this.state.selectedLearners.indexOf(item) >= 0)
            this.setState({
              selectedLearners: this.state.selectedLearners.filter(
                i => i != item
              )
            });
          else
            this.setState({
              selectedLearners: [...this.state.selectedLearners, item]
            });
        }
        break;

      case 'centre':
        if (this.state.selectedCentres.indexOf(item) >= 0)
          this.setState({
            selectedCentres: this.state.selectedCentres.filter(i => i != item)
          });
        else
          this.setState({
            selectedCentres: [...this.state.selectedCentres, item]
          });
        break;

      case 'qualification':
        if (this.state.selectedQualifications.indexOf(item) >= 0)
          this.setState({
            selectedQualifications: this.state.selectedQualifications.filter(
              i => i != item
            )
          });
        else
          this.setState({
            selectedQualifications: [...this.state.selectedQualifications, item]
          });
        break;
    }
  }

  addInviteValues() {
    const { communityModalInviteForm, initializeForm } = this.props;
    const { addedInvites, formFields, currentStep } = this.state;

    let newInvite = {};
    let blankInvite = {};

    if (lodash.size(lodash.get(communityModalInviteForm, 'values', {})) == 0)
      return addedInvites;

    formFields.forEach(field => {
      newInvite[field.name] = communityModalInviteForm.values[field.name];
    });
    initializeForm(blankInvite);
    return [...addedInvites, newInvite];
  }

  onAddInvites(nextStep = false) {
    const { currentStep } = this.state;
    this.setState({
      addedInvites: this.addInviteValues(),
      currentStep: nextStep ? currentStep + 1 : currentStep
    });
  }

  onSetUserType(e) {
    let anohterButtonText = '';
    let fields = [];
    let steps = [];

    switch (e) {
      case CentreAdmin:
        anohterButtonText = 'Add Another Centre';
        (steps = [
          {
            title: 'Add a USER',
            subTitle: 'Please select the type of USER you want to add'
          },
          {
            title: 'Add a Centre',
            subTitle: 'Please select how you want to add the Centre'
          },
          {
            title: 'Add a Centre',
            subTitle:
              'Please check that this is all correct before adding the Centre(s)'
          },
          {
            title: 'Your Centres has been added',
            subTitle: 'Notifications have been sent to the Centre(s)'
          }
        ]),
          (fields[0] = {
            name: 'centre_name',
            label: 'Name of Centre',
            placeholder: 'Type Name of Centre'
          });
        fields[1] = {
          name: 'centre_number',
          label: 'Centre Number',
          placeholder: 'Type Number of Centre'
        };
        fields[2] = {
          name: 'email',
          label: 'Email Address',
          placeholder: 'Type Email Address'
        };
        fields[3] = {
          name: 'contact_email',
          label: 'Contact Email Address',
          placeholder: 'Type Contact Email Address'
        };
        fields[4] = {
          name: 'first_name',
          label: 'First Name',
          placeholder: 'Type First Name'
        };
        fields[5] = {
          name: 'password',
          label: 'Password',
          placeholder: 'Type Password'
        };
        break;
      case SiteAdmin:
        anohterButtonText = 'Add Another Admin';

        (steps = [
          {
            title: 'Add a USER',
            subTitle: 'Please select the type of USER you want to add'
          },
          {
            title: 'Add a User',
            subTitle: 'Please select how you want to add'
          },
          {
            title: 'Add a User',
            subTitle: 'Please check that this is all correct before adding'
          },
          {
            title: 'Your Admin has been added',
            subTitle: 'Notifications have been sent to the Admin(s)'
          }
        ]),
          (fields[0] = {
            name: 'admin_name',
            label: 'Name of Admin',
            placeholder: 'Type Name of Admin'
          });
        fields[1] = {
          name: 'email',
          label: 'Email Address',
          placeholder: 'Type Email Address'
        };
        break;

      case CentreTutor:
        anohterButtonText = 'Add Another Tutor';

        steps = [
          {
            title: 'Add a USER',
            subTitle: 'Please select the type of USER you want to add'
          },
          {
            title: 'Add a Tutor',
            subTitle: 'Please select the type of Learner you want to add'
          },
          {
            title: 'Add a Tutor',
            subTitle: 'Please add a centre to the Tutor you want to add'
          },
          {
            title: 'Add a Tutor',
            subTitle:
              'Please check that this is all correct before adding the Tutor(s)'
          },
          {
            title: 'Your Tutor(s) has been added',
            subTitle: 'Notifications have been sent to the Tutor(s)'
          }
        ];

      case CentreLearner:
        if (!anohterButtonText) {
          anohterButtonText = 'Add Another Learner';
        }

        if (steps.length == 0) {
          steps = [
            {
              title: 'Add a USER',
              subTitle: 'Please select the type of USER you want to add'
            },
            {
              title: 'Add a Learner',
              subTitle: 'Please select the type of Learner you want to add'
            },
            {
              title: 'Add a Learner',
              subTitle: 'Please add a centre to the Learner you want to add too'
            },
            {
              title: 'Add a Learner',
              subTitle:
                'Please add a Qualification to the Learner or Skip and do this later'
            },
            {
              title: 'Add a Learner',
              subTitle:
                'Please check that this is all correct before adding the Learner'
            },
            {
              title: 'Your Learner has been added',
              subTitle:
                'Notifications have been sent to the Learner and the Centre'
            }
          ];
        }

        fields[0] = {
          name: 'first_name',
          label: 'First Name',
          placeholder: 'Type First Name'
        };
        fields[1] = {
          name: 'last_name',
          label: 'Last Name',
          placeholder: 'Type Last Name'
        };
        fields[2] = {
          name: 'email',
          label: 'Email Address',
          placeholder: 'Type Email Address'
        };
        break;
    }

    this.setState({
      user_type: e,
      steps: steps,
      formFields: fields,
      anohterButtonText: anohterButtonText
    });
  }

  onSave() {
    const { file } = this.state;
  }

  onBack() {
    const { currentStep } = this.state;
    this.setState({ currentStep: Math.max(0, currentStep - 1) });
  }

  onNext(e) {
    const {
      currentStep,
      steps,
      activeTab,
      addedInvites,
      user_type,
      selectedCentres,
      selectedLearners
    } = this.state;
    const { communityModalInviteForm } = this.props;

    if (currentStep == steps.length - 2) {
      switch (user_type) {
        case CentreAdmin:
        case SiteAdmin:
          let invites = this.addInviteValues();
          this.setState({ addedInvites: invites });
          this.sendInvite(invites);
          break;

        case CentreTutor:
        case CentreLearner:
          invites = this.addInviteValues();
          this.setState({ addedInvites: invites });
          if (lodash.get(selectedCentres, 'length', 0) < 1) {
            return;
          }

          if (lodash.get(addedInvites, 'length', 0) > 0) {
            this.sendInvite([addedInvites, selectedCentres]);
          } else if (lodash.get(selectedLearners, 'length', 0) > 0) {
            this.sendInvite([selectedLearners, selectedCentres]);
          }
          break;
      }
    } else if (currentStep == 1) {
      switch (user_type) {
        case CentreAdmin:
        case SiteAdmin:
          if (
            activeTab == 0 &&
            communityModalInviteForm &&
            communityModalInviteForm.values &&
            communityModalInviteForm.values['email'] &&
            !addedInvites.find(
              i => i.email == communityModalInviteForm.values['email']
            )
          ) {
            this.onAddInvites(true);
            return;
          }
          break;
        case CentreTutor:
        case CentreLearner:
          if (
            activeTab == 1 &&
            communityModalInviteForm &&
            communityModalInviteForm.values &&
            communityModalInviteForm.values['email'] &&
            !addedInvites.find(
              i => i.email == communityModalInviteForm.values['email']
            )
          ) {
            this.onAddInvites(true);
            return;
          }
          break;
      }

      this.setState({
        currentStep: currentStep + 1
      });
    } else {
      if (currentStep == steps.length - 1) {
        this.setState({
          currentStep: 0,
          addedInvites: [],
          file: null,
          numberOfInvites: 0,
          selectedCentres: [],
          selectedLearners: [],
          selectedQualifications: []
        });
      } else {
        this.setState({
          currentStep: currentStep + 1
        });
      }
    }
  }

  onSkip() {
    const { currentStep, steps, activeTab } = this.state;
    this.setState({
      currentStep: currentStep + 1
    });
  }

  isVisibleAnotherButton() {
    const { user_type, currentStep, activeTab } = this.state;

    switch (user_type) {
      case CentreAdmin:
      case SiteAdmin:
        return [1, 2].indexOf(currentStep) >= 0 && activeTab == 0;
      case CentreTutor:
      case CentreLearner:
        return currentStep == 1 && activeTab == 1;
    }
    return false;
  }

  isInValidAnother() {
    const { communityModalInviteForm } = this.props;
    const { user_type, formFields } = this.state;

    if (!communityModalInviteForm || !communityModalInviteForm.values)
      return true;

    for (let i = 0; i < formFields.length; i++) {
      if (!communityModalInviteForm.values[formFields[i].name]) return true;
    }
    return false;
  }

  isInValidNext() {
    const {
      currentStep,
      activeTab,
      user_type,
      addedInvites,
      file,
      selectedLearners,
      selectedCentres,
      selectedQualifications
    } = this.state;

    switch (currentStep) {
      case 0:
        return !user_type;

      case 1:
        switch (user_type) {
          case CentreAdmin:
          case SiteAdmin:
            if (activeTab == 0)
              return addedInvites.length == 0 && this.isInValidAnother();
            else return !file;
          case CentreTutor:
            return addedInvites.length == 0 && this.isInValidAnother();
          case CentreLearner:
            if (activeTab == 0) return selectedLearners.length == 0;
            else if (activeTab == 1)
              return addedInvites.length == 0 && this.isInValidAnother();
            else return false;
        }
        return false;

      case 2:
        switch (user_type) {
          case CentreAdmin:
          case SiteAdmin:
            return false;

          case CentreTutor:
          case CentreLearner:
            return selectedCentres.length == 0;
        }
        return false;

      case 3:
        switch (user_type) {
          case CentreAdmin:
          case SiteAdmin:
            return false;

          case CentreTutor:
            return false;

          case CentreLearner:
            return selectedQualifications.length == 0;
        }
        return false;
      default:
        return;
    }
  }

  // Send user registration invites
  sendInvite(values) {
    const {
      routes,
      routeRole,
      communityPostAdminInviteAttempt,
      communityPostCentreInviteAttempt,
      communityPostMemberInviteAttempt
    } = this.props;
    const { user_type } = this.state;
    const { path } = lodash.last(routes);

    let email = [];
    let centre_name = [];
    let centre_number = [];

    if (!lodash.get(values, 'length')) return;

    if (user_type === CentreAdmin) {
      values.forEach(value => {
        email.push(value.email);
        centre_name.push(value.centre_name);
        centre_number.push(value.centre_number);
      });
      communityPostCentreInviteAttempt({ email, centre_name, centre_number });
    } else if (
      lodash.indexOf([SiteAdmin, 'SUPER_ADMIN_ROLE'], user_type) >= 0
    ) {
      values.forEach(value => {
        email.push(value.email);
        centre_name.push(value.admin_name);
      });
      communityPostAdminInviteAttempt({
        email,
        name: centre_name,
        role: routeRole,
        system: 0
      });
    } else if (lodash.indexOf([CentreTutor, CentreLearner], user_type) >= 0) {
      const members = values[0];
      const centres = values[1];
      const first_name = [];
      const last_name = [];
      const email = [];
      const member_id = [];
      const centre_id = [];
      const centre_role = user_type;

      members.forEach(member => {
        if (member.first_name) {
          first_name.push(member.first_name);
          last_name.push(member.last_name);
          email.push(member.email);
        }

        if (member.member_id) member_id.push(member.member_id);
      });

      centres.forEach(centre => {
        centre_id.push(centre.centre_id);
      });

      const data = { centre_role, centre_id };

      if (first_name.length > 0) {
        data['first_name'] = first_name;
        data['last_name'] = last_name;
        data['email'] = email;
      } else {
        data['member_id'] = member_id;
      }
      communityPostMemberInviteAttempt(data);
    }
  }

  createCentre() {
    const { createCentre, communityModalInviteForm, closeModal } = this.props;
    createCentre(communityModalInviteForm.values);
  }

  render() {
    const { user_types, attemptingInvite, handleSubmit } = this.props;

    const {
      user_type,
      steps,
      currentStep,
      tabs,
      activeTab,
      anohterButtonText
    } = this.state;

    const currentTabs = user_type ? tabs[user_type] : [];

    return (
      <div className="community-modal-invite">
        <form onSubmit={e => e.preventDefault()}>
          <div className="title">
            {steps[Math.min(currentStep, steps.length - 1)].title}
          </div>

          <div className="sub-title">{steps[currentStep].subTitle}</div>

          {currentStep == 0 && (
            <div
              style={{
                minHeight: '150px',
                margin: '40px auto 0 auto',
                maxWidth: '480px'
              }}
            >
              <div className="query-label p-5">
                <label> Select the TYPE of USER </label>
              </div>
              <div className="columns">
                <div className="column">
                  <UISelectDropdown
                    dropdownList={user_types}
                    defaultTxt="Select one..."
                    defaultKey={user_type}
                    onChange={e => this.onSetUserType(e)}
                  />
                </div>
              </div>
            </div>
          )}

          {currentStep > 0 && currentStep < steps.length - 1 && (
            <div className="m-t-20">
              {this.renderTabs(activeTab, currentTabs, this.handleTabChange)}
            </div>
          )}

          {/* Invite User Form */}
          {this.renderInputForm()}

          {/* Add from File */}
          {this.renderFileInput()}

          {this.renderQuery(user_type === CentreTutor ? 'tutor' : 'learner')}

          {/* Learner or Tutor Selected */}
          {this.renderSelectedItems('invites')}

          {this.renderQuery('centre')}

          {/* Centre Selected */}
          {this.renderSelectedItems('centre')}

          {this.renderQuery('qualification')}

          {/* Qualification Selected */}
          {this.renderSelectedItems('qualification')}

          <div className="m-l-15 m-r-15">
            {/* Add Learners from File */}

            {activeTab == 2 && currentStep > 2 && (
              <div className="uploaded-result has-text-centered">
                <p>You have uploaded</p>
                <p>345 Learners in this Batch</p>
                <i className="fa fa-trash-o" style={{ cursor: 'pointer' }} />
              </div>
            )}
          </div>

          {currentStep < steps.length - 1 && (
            <div className="is-flex m-t-15 m-b-15">
              {currentStep > 0 && (
                <div className="column is-paddingless back-btn">
                  <div className="m-t-10">
                    <a onClick={e => this.onBack()}>
                      <i className="fa fa-angle-left" />
                      <span>&nbsp;&nbsp;Back</span>
                    </a>
                  </div>
                </div>
              )}

              {this.renderAddedInviteNum()}

              {user_type !== CentreAdmin && (
                <div className="column is-paddingless has-text-right">
                  <button
                    type="button"
                    disabled={this.isInValidNext() || attemptingInvite}
                    className={`button is-primary ${attemptingInvite &&
                      'is-loading'}`}
                    onClick={e => this.onNext(e)}
                  >
                    Next
                  </button>
                </div>
              )}
              {user_type === CentreAdmin && (
                <button
                  type="button"
                  className={`button is-primary ${attemptingInvite &&
                    'is-loading'}`}
                  onClick={this.createCentre}
                >
                  Create Centre
                </button>
              )}
            </div>
          )}

          {this.renderList('invites')}

          {this.renderList('learner')}

          {this.renderList('centre')}

          {this.renderList('qualification')}

          {currentStep == steps.length - 1 && (
            <div className="m-t-25 m-b-15 has-text-centered">
              <div className="m-b-25">
                <Isvg src={IconEmailNotification} />
              </div>
              <div className="m-b-25">
                Emails and Notifications have been sent
              </div>
              <div>
                <button
                  type="button"
                  className={`button is-primary btn-sed`}
                  onClick={e => this.onNext(e)}
                >
                  {anohterButtonText}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    );
  }
}

const validate = (values, props) => {
  const errors = {};
  return errors;
};

const CommunityModalInviteForm = reduxForm({
  form: FORM_NAME,
  validate
})(CommunityModalInvite);

CommunityModalInviteForm.defaultProps = {
  user_types: [
    { key: CentreAdmin, name: 'Centre' },
    { key: SiteAdmin, name: 'Admin' },
    { key: CentreTutor, name: 'Tutor' },
    { key: CentreLearner, name: 'Leaner' },
    { key: 'CENTRE_STAFF_ROLE', name: 'Staff' },
    { key: 'CENTRE_MANAGER_ROLE', name: 'Manager' }
  ],
  learners: [],

  centres: [],

  qualifications: [
    {
      id: 1,
      title: 'Qualification Title',
      reference: '123',
      level: null,
      sector: null,
      specification: null
    },
    {
      id: 2,
      title: 'Qualification Title',
      reference: '123',
      level: null,
      sector: null,
      specification: null
    }
  ]
};

CommunityModalInviteForm.propTypes = {};

const mapStateToProps = state => ({
  user: lodash.get(state, 'profile.user'),
  members: lodash.get(state, 'community.users', []),
  communityModalInviteForm: lodash.get(state, 'form.communityModalInvite'),
  centres: lodash.get(state, 'community.centres', []),
  attemptingGetQualificationsInStore: lodash.get(
    state,
    'store.attemptingGetQualificationsInStore'
  ),
  attemptingInvite: lodash.get(state, 'community.attemptingInvite'),
  gettingAllCentres: lodash.get(state, 'community.gettingAllCentres'),
  qualifications: lodash.get(state, 'store.qualifications', [])
});

const mapDispatchToProps = dispatch => ({
  changeFieldValue: (field_name, value) => {
    dispatch(change(FORM_NAME, field_name, value));
  },

  initializeForm: data => {
    dispatch(initialize(FORM_NAME, data));
  },

  getAllCentresAttempt: (params, userRole) =>
    dispatch(CommunityActions.communityGetAllCentresAttempt(params, userRole)),
  getAllQualificationsInStoreAttempt: params =>
    dispatch(
      QualificationStoreActions.getAllQualificationsInStoreAttempt(params)
    ),
  communityPostAdminInviteAttempt: params =>
    dispatch(CommunityActions.communityPostAdminInviteAttempt(params)),
  communityPostCentreInviteAttempt: params =>
    dispatch(CommunityActions.communityPostCentreInviteAttempt(params)),
  communityPostMemberInviteAttempt: params =>
    dispatch(CommunityActions.communityPostMemberInviteAttempt(params)),
  createCentre: params => dispatch(CommunityActions.createCentreAttempt(params))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CommunityModalInviteForm);
