import GroupForm, { FORM_NAME } from './form';
import React from 'react';
import { equals, map, filter, find, propEq, path, isEmpty } from 'ramda';
import { connect } from 'react-redux';
import { getFormValues, arrayRemoveAll, touch } from 'redux-form';
import { bindActionCreators } from 'redux';
import { Roles } from 'app/core/config/constants';
import { Creators } from './actions';

const { CentreLearner, CentreTutor } = Roles;

const extractLearners = members =>
  filter(propEq('centre_roles', [CentreLearner]), members);
const extractTutors = members =>
  filter(propEq('centre_roles', [CentreTutor]), members);

class GroupModal extends React.Component {
  constructor(props) {
    super(props);
    const { group, groupToEdit, user, selectedQualificationId } = props;
    const { centres } = user;
    const centre = centres[0];
    const roles = centre.roles;
    const isTutor = roles.find(role => role === CentreTutor);
    const groupData = group && group.members ? group : groupToEdit;
    const sectionData = [
      { title: 'Group info', description: 'Basic group info' },
      {
        title: 'Tutors',
        description: 'Add tutors to the group',
        userType: CentreTutor
      },
      {
        title: 'Learners',
        description: 'Add learners to the group',
        userType: CentreLearner
      },
      // { title: 'Seats', description: 'Add seats to the group', userType: '' },
      { title: 'Overview', description: 'Overview' }
    ];
    let state;
    // If updating group
    if (groupData) {
      state = {
        group: {
          ...groupData,
          learners: groupData.members ? extractLearners(groupData.members) : [],
          tutors: groupData.members ? extractTutors(groupData.members) : [],
          seats: []
        }
      };
      // If creating new group
    } else {
      state = {
        group: {
          group_id: null,
          qualification_id: selectedQualificationId,
          qualification_title: null,
          title: '',
          cloudinary_file_id: null,
          learners: [],
          tutors: [],
          seats: []
        }
      };
    }

    this.state = {
      activeIndex: 0,
      imagePreview: '',
      selectedQualificationId,
      sectionData: isTutor
        ? sectionData.filter(item => item.userType !== CentreTutor)
        : sectionData,
      isTutor,
      ...state
    };

    this.next = this.next.bind(this);
    this.prev = this.prev.bind(this);
    this.getSectionNavButton = this.getSectionNavButton.bind(this);
    this.getSearchResults = this.getSearchResults.bind(this);
    this.setImagePreview = this.setImagePreview.bind(this);
    this.saveGroup = this.saveGroup.bind(this);
    this.setShowSelected = this.setShowSelected.bind(this);
    this.getSectionHeader = this.getSectionHeader.bind(this);
    this.onQualificationChange = this.onQualificationChange.bind(this);
    this.onSectionChange = this.onSectionChange.bind(this);
  }

  componentDidMount() {
    this.props.getGroupQualificationsAttempt();
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.uiCloseModal) {
      this.props.closeModal();
      this.props.onSave();
    }
    // Touch qualification field to display error
    if (
      !equals(this.props.qualifications, nextProps.qualifications) &&
      isEmpty(nextProps.qualifications)
    ) {
      this.props.touch(FORM_NAME, 'qualification_id');
    }
  }

  UNSAFE_componentWillUpdate(nextProps) {
    const { group } = this.props;
    const { group: nextGroup } = nextProps;
    if (nextGroup && nextGroup !== group) {
      this.setState({
        group: {
          ...nextGroup,
          learners: nextGroup.members ? extractLearners(nextGroup.members) : [],
          tutors: nextGroup.members ? extractTutors(nextGroup.members) : [],
          seats: []
        }
      });
    }
  }

  componentWillUnmount() {
    this.props.setCloseModal();
  }

  onQualificationChange(e) {
    const {
      groupValues: { learners, seats }
    } = this.props;
    if (!isEmpty(learners) || !isEmpty(seats)) {
      const message =
        'Changing the qualification now will reset your learners and seats. Are you sure you want to continue?';
      if (confirm(message)) {
        this.props.arrayRemoveAll(FORM_NAME, 'learners');
        this.props.arrayRemoveAll(FORM_NAME, 'seats');
        this.setState(
          {
            activeIndex: 2
          },
          this.onSectionChange
        );
      } else {
        e.preventDefault();
      }
    }
    // TODO if users/seats already fetched but nothing selected need to re-fetch users
    // else {
    //   this.setState(
    //     {
    //       activeIndex: 2
    //     },
    //     this.onSectionChange
    //   );
    // }
  }

  onSectionChange() {
    const { activeIndex, sectionData } = this.state;

    this.props.resetGroupModalSearch();

    // Fetch users on section change
    const { userType } = sectionData[activeIndex];
    if (userType !== undefined) {
      this.getSearchResults('', userType);
    }
  }

  getSearchResults(searchTerm, userType) {
    const {
      groupValues: { qualification_id }
    } = this.props;
    this.props.searchForGroupMembersAttempt(
      searchTerm,
      userType,
      qualification_id
    );
  }

  getSectionNavButton() {
    const { activeIndex, isTutor } = this.state;
    const { uiSaving, form } = this.props;
    const buttonProps = {};
    let label = '';
    if ((isTutor && activeIndex < 2) || (!isTutor && activeIndex < 3)) {
      label = 'Next';
      buttonProps.onClick = this.next;
      buttonProps.className = 'button is-primary';
    } else {
      label = 'Save';
      buttonProps.onClick = this.saveGroup;
      buttonProps.className = `button is-primary ${
        uiSaving ? 'is-loading' : ''
      }`;
    }
    // Redux-form selectors don't work properly
    buttonProps.disabled = form && !!form.syncErrors;
    return {
      props: buttonProps,
      label
    };
  }

  getSectionHeader() {
    const { sectionData, activeIndex } = this.state;
    const { title, description } = sectionData[activeIndex];
    return {
      title,
      description
    };
  }

  setShowSelected(flag) {
    this.props.setShowSelected(flag);
  }

  setImagePreview(imagePreview) {
    this.setState({
      imagePreview
    });
  }

  next() {
    const { activeIndex } = this.state;
    this.setState(
      {
        activeIndex: activeIndex + 1
      },
      this.onSectionChange
    );
  }

  prev(formProps) {
    const { activeIndex } = this.state;
    this.setState(
      {
        activeIndex: activeIndex > 1 ? activeIndex - 1 : 1
      },
      this.onSectionChange
    );
  }

  // Transform group data into payload
  saveGroup() {
    const { group_id } = this.state.group;
    const {
      groupValues: {
        title,
        tutors,
        learners,
        seats,
        cloudinary_file_id,
        qualification_id
      },
      user
    } = this.props;
    const newTutors = [user, ...tutors];
    // Assign cloudinary file ID
    let imageFile = null;
    if (
      cloudinary_file_id &&
      typeof cloudinary_file_id !== 'string' &&
      cloudinary_file_id.length
    ) {
      imageFile = cloudinary_file_id[0] || null;
    } else if (cloudinary_file_id && cloudinary_file_id.length) {
      imageFile = cloudinary_file_id;
    }

    // tutors & learners -> members
    // seats -> learners
    const payload = {
      qualification_id,
      group_id,
      title,
      cloudinary_file_id: imageFile,
      members: [
        ...map(__ => __.member_id, newTutors),
        ...map(__ => __.member_id, learners)
      ],
      learners: map(__ => __.registration_number, seats)
    };
    this.props.saveGroupAttempt(payload);
  }

  render() {
    const {
      activeIndex,
      group,
      imagePreview,
      sectionData,
      isTutor
    } = this.state;
    const {
      next,
      prev,
      getSectionNavButton,
      getSearchResults,
      getSectionHeader,
      setImagePreview,
      setShowSelected,
      onQualificationChange
    } = this;
    const {
      title,
      searchResults,
      uiSearching,
      searchTerm,
      closeModal,
      qualifications,
      sectorTitle,
      uiShowSelected,
      uiGettingQualifications
    } = this.props;
    const {
      group_id,
      qualification_id,
      qualification_title,
      cloudinary_file_id
    } = group;
    return (
      <div className="create-group-modal">
        <GroupForm
          {...{
            initialValues: group,
            navButton: getSectionNavButton(),
            header: getSectionHeader(),
            group_id,
            qualification_id,
            qualification_title,
            sectionData,
            cloudinary_file_id,
            getSearchResults,
            setImagePreview,
            searchResults,
            imagePreview,
            uiSearching,
            uiShowSelected,
            uiGettingQualifications,
            activeIndex,
            searchTerm,
            closeModal,
            next,
            prev,
            setShowSelected,
            qualifications,
            sectorTitle,
            onQualificationChange,
            isTutor,
            title
          }}
        />
      </div>
    );
  }
}

const mapDispatchToProps = dispatch =>
  bindActionCreators({ ...Creators, arrayRemoveAll, touch }, dispatch);

const mapStateToProps = state => ({
  user: path(['profile', 'user'])(state),
  form: path(['form', FORM_NAME])(state),
  groupValues: getFormValues(FORM_NAME)(state),
  uiSaving: path(['modalGroup', 'uiSaving'])(state),
  uiSearching: path(['modalGroup', 'uiSearching'])(state),
  uiShowSelected: path(['modalGroup', 'uiShowSelected'])(state),
  uiCloseModal: path(['modalGroup', 'uiCloseModal'])(state),
  uiGettingQualifications: path(['modalGroup', 'uiGettingQualifications'])(
    state
  ),
  searchResults: path(['modalGroup', 'searchResults'])(state),
  searchTerm: path(['modalGroup', 'searchTerm'])(state),
  qualifications: path(['modalGroup', 'qualifications'])(state),
  sectorTitle: path(['persisted', 'sector', 'title'])(state),
  groupToEdit: path(['community', 'groupToEdit'])(state)
});

GroupModal.defaultProps = {
  onSave: () => {}
};

export default connect(mapStateToProps, mapDispatchToProps)(GroupModal);
