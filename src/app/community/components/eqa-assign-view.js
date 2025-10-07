import React, { Component } from 'react';
import classNames from 'classnames';
import Isvg from 'react-inlinesvg';

import common from 'app/common';
import { Text } from 'app/intl';
import CloudinaryMedia from '../../common/components/cloudinary-media/index';
import CommunityUsers from '../containers/community-users';
import SwitchLayoutView from '../components/community-switch-layout';
import EQAInvitationModal from './eqa-invitation-modal';

const {
  components: { Footer, SelectedItemList, UISearch }
} = common;

import IconMan from 'images/icon_male_profile.svg';
import IconWoMen from 'images/icon_female_profile.svg';

class EqaAssignView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalEQAInvitation: false,
      selectedMembers: [],
      activeLayout: 'list',
      pageNumber: 1,
      searchTerm: null,
      isSearchOpen: false
    };
    this.isAssignEQAToCentre = false;
    this.isAssignCentreToEQA = false;
    this.onAssignEQAConfirm = this.onAssignEQAConfirm.bind(this);
    this.onSelectItem = this.onSelectItem.bind(this);
    this.handleLayoutChange = this.handleLayoutChange.bind(this);
    this.onCommunitySearch = this.onCommunitySearch.bind(this);
    this.openSearch = this.openSearch.bind(this);
    this.closeSearch = this.closeSearch.bind(this);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (
      this.props.assigningEQA &&
      !nextProps.assigningEQA &&
      nextProps.assignEQAStatus
    ) {
      this.setState({ modalEQAInvitation: true });
    }
    if (nextProps.eqaMember) {
      const centres = (nextProps.eqaMember.centres || []).filter(centre => {
        return !this.state.selectedMembers.find(
          member => member.centre_id === centre.centre_id
        );
      });
      this.setState({
        selectedMembers: [...centres, ...this.state.selectedMembers].map(
          centre => ({
            ...centre,
            screen_name: centre.screen_name || centre.centre_name
          })
        )
      });
    }
  }

  onAssignEQAConfirm() {
    const { onAssignEQAConfirm, itemData } = this.props;
    const { member_id, centre_id } = itemData;

    let memberIds = [];
    let centreIds = [];
    this.state.selectedMembers.map(item => {
      if (item.centre_id) {
        centreIds.push(item.centre_id);
      } else if (item.member_id) {
        memberIds.push(item.member_id);
      }
    });

    if (this.isAssignEQAToCentre) {
      onAssignEQAConfirm(null, centre_id, memberIds);
    } else if (this.isAssignCentreToEQA) {
      onAssignEQAConfirm(member_id, null, centreIds);
    }
  }

  onSelectItem(e, userData) {
    const { selectedMembers } = this.state;
    const isSelected = selectedMembers.find(
      member => member.centre_id === userData.centre_id
    );
    if (isSelected)
      this.setState({
        selectedMembers: selectedMembers.filter(
          member => member.centre_id !== userData.centre_id
        )
      });
    else
      this.setState({
        selectedMembers: [...selectedMembers, userData]
      });
  }

  handleLayoutChange(view) {
    this.setState({ activeLayout: view });
  }

  onCommunitySearch(term) {
    this.setState({
      pageNumber: 1,
      searchTerm: term
    });
  }
  openSearch() {
    this.setState({ isSearchOpen: true });
  }
  closeSearch() {
    this.setState({ isSearchOpen: false });
  }
  render() {
    const {
      activeLayout,
      pageNumber,
      searchTerm,
      isSearchOpen,
      selectedMembers
    } = this.state;
    const {
      onAssignCancel,
      routeRole,
      activeSection,
      itemData,
      setCentreID,
      goToPage,
      users
    } = this.props;
    const {
      member_id,
      centre_id,
      centre_roles,
      centre_name,
      screen_name,
      uk_mobile_number,
      website,
      media,
      title,
      gender,
      cloudinary_file_id,
      address_line_1,
      number_of_learners,
      last_qa_visit,
      eqa,
      total_centre_learners,
      centres_per_sector
    } = itemData;

    if (routeRole === 'CENTRE_ADMIN_ROLE') {
      this.isAssignEQAToCentre = true;
    } else if (routeRole === 'CENTRE_EQA_ROLE') {
      this.isAssignCentreToEQA = true;
    }

    let construction, engineering;
    try {
      let sectorsArray = Object.values(centres_per_sector.sectors);
      construction = sectorsArray[0].centres;
      engineering = sectorsArray[1].centres;
    } catch (e) {}

    return (
      <div>
        <div className="assign-centre-header">
          <button
            className="back button is-primary is-outlined column flex-none"
            onClick={onAssignCancel}
          >
            <i className="fa fa-angle-left" />
          </button>
          <div className="black-title-wrp">
            <div className="back-title">
              {this.isAssignEQAToCentre === true
                ? 'Assign a Centre'
                : 'Assign an EQA'}
            </div>
            <div className="back-sub-title">Back</div>
          </div>
          <button
            disabled={this.state.selectedMembers.length === 0}
            onClick={this.onAssignEQAConfirm}
            className={classNames(
              'button',
              'is-medium',
              'is-primary',
              'eqa-confirm-button',
              {
                'is-loading': this.state.modalEQAInvitation
              }
            )}
          >
            <Text iKey="Confirm" />
          </button>
        </div>
        <section className="content-section navigation-section eqa-search">
          <div
            className={classNames('search-container', {
              'search-container--open': isSearchOpen
            })}
          >
            <UISearch
              onSearch={e => this.onCommunitySearch(e)}
              placeholder="Search"
              onFocus={this.openSearch}
              onBlur={this.closeSearch}
            />
            {isSearchOpen && (
              <i
                onClick={this.closeSearch}
                className="fa fa-times search-icon"
              />
            )}
            {!isSearchOpen && <i className="fa fa-search search-icon" />}
            {/* {!isSearchOpen && (
              <div onClick={this.openSearch} className="search-blocker" />
            )} */}
          </div>
          <div className="gray-line" />
        </section>
        <div className="assign-content">
          <div className="user-view">
            <div className="user-photo">
              {cloudinary_file_id ? (
                <CloudinaryMedia
                  fileId={
                    cloudinary_file_id
                      ? cloudinary_file_id
                      : 'testing/torlkhjafnvzadhzokhn'
                  }
                  mediaType="image"
                  className="user-photo"
                  transformations={{
                    width: 200,
                    height: 200,
                    crop: 'thumb',
                    gravity: 'face'
                  }}
                />
              ) : (
                <div className="no-photo">
                  {gender == 1 ? (
                    <Isvg src={IconMan} />
                  ) : (
                    <Isvg src={IconWoMen} />
                  )}
                </div>
              )}
            </div>
            <div className="user-name">{screen_name}</div>
            {this.isAssignEQAToCentre ? (
              <div>
                <div className="sub-content">
                  <span className="sub-title">Address</span>
                  <span className="sub-title">{address_line_1}</span>
                </div>
                <hr />
                <div className="sub-content">
                  <span className="sub-title">Contact</span>
                  <span className="sub-title">{uk_mobile_number}</span>
                </div>
                <hr />
                <div className="sub-content">
                  <span className="sub-title">Website</span>
                  <span className="sub-title">{website}</span>
                </div>
                <hr />
                <div className="sub-content">
                  <span className="sub-title">Students</span>
                  <span className="sub-title">{number_of_learners}</span>
                </div>
                <hr />
                <div className="sub-content">
                  <span className="sub-title">Last QA visit</span>
                  <span className="sub-title">{last_qa_visit}</span>
                </div>
                <hr />
                <div className="sub-content">
                  <span className="sub-title">EQA Assigned</span>
                  <span className="sub-title">{eqa && eqa.screen_name}</span>
                </div>
              </div>
            ) : (
              <div>
                <div className="sub-title">
                  External Quality Assurance Officer
                </div>
                <div className="sub-title m-t-20">
                  Registration Number: YF083f40
                </div>
                <div className="sub-content m-t-20 m-b-10">
                  <span className="sub-title">Assigned Centres</span>
                  <span className="sub-title">
                    {selectedMembers && selectedMembers.length}
                  </span>
                </div>
                {selectedMembers.map(user => (
                  <div className="sub-content m-b-10" key={user.centre_id}>
                    <span className="sub-text">{user.centre_name}</span>
                  </div>
                ))}
                <hr />
                <div className="sub-content">
                  <span className="sub-title">Assigned Students</span>
                  <span className="sub-title">Learners</span>
                </div>
                <div className="sub-content m-t-20">
                  <span className="sub-title">
                    Total Leaners within Centres
                  </span>
                  <span className="sub-title">{total_centre_learners}</span>
                </div>
              </div>
            )}
          </div>
          <div
            className={classNames('users-container', {
              'users-container--padding': activeLayout !== 'list'
            })}
          >
            <SwitchLayoutView
              {...{
                handleLayoutChange: this.handleLayoutChange,
                selectedUsers: this.state.selectedMembers.length,
                activeLayout,
                userType: 'centreSeats' // To remove online filter
              }}
            />
            {selectedMembers.length > 0 && (
              <div className="selected-item-list-wrp">
                <SelectedItemList
                  items={selectedMembers}
                  showAvatar={false}
                  showPdfIcon={false}
                  showTtrainingIcon={false}
                  onClose={e => this.onSelectItem(null, e)}
                />
              </div>
            )}
            <div className="list-container community-explorer">
              <CommunityUsers
                onChange={this.onSelectItem}
                {...{
                  centre_id,
                  member_id,
                  itemsPerPage: 8,
                  routeRole,
                  activeSection,
                  activeLayout,
                  pageNumber,
                  searchTerm,
                  setCentreID,
                  goToPage,
                  userType: this.isAssignEQAToCentre ? 'eqa' : 'centre-eqa',
                  showCheckbox: true,
                  selectedItems: selectedMembers,
                  users: [],
                  isAssignEQAToCentre: this.isAssignEQAToCentre,
                  isAssignCentreToEQA: this.isAssignCentreToEQA
                }}
              />
            </div>
            {/* EQA Invitation confirm */}
            <EQAInvitationModal
              isOpen={this.state.modalEQAInvitation}
              onClose={() => this.setState({ modalEQAInvitation: false })}
            >
              <div className="modal-content">
                <div className="modal-content__title">Done!</div>
                <div className="modal-content__text semibold">EQA assigned</div>
                <div className="modal-content__divider" />
                <div className="modal-content__btn">
                  <button
                    onClick={() => this.setState({ modalEQAInvitation: false })}
                    className="button is-medium is-primary"
                  >
                    <Text iKey="Close" />
                  </button>
                </div>
              </div>
            </EQAInvitationModal>
          </div>
        </div>
        {/* <div className="eqa-footer-container">
          <div className="confirm-button">
            <button
              disabled={this.state.selectedMembers.length === 0}
              onClick={this.onAssignEQAConfirm}
              className={classNames('button', 'is-medium', 'is-primary', {
                'is-loading': this.state.modalEQAInvitation
              })}
            >
              <Text iKey="Confirm" />
            </button>
          </div>
          <Footer className="eqa-footer" />
        </div> */}
        <Footer className="eqa-footer" />
      </div>
    );
  }
}

export default EqaAssignView;
