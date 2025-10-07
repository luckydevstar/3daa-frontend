import React, { Component } from 'react';
import { Link, browserHistory } from 'react-router';
import classNames from 'classnames';
import { connect } from 'react-redux';
import * as lodash from 'lodash';

import CloudinaryMedia from '../cloudinary-media';
import { Roles } from 'app/core/config/constants';
import { Text } from 'app/intl';
import { createCloudinaryUrl, getPhotoUrl } from '../../util/helpers';

import MemberProgressBadge from './member-progress-badge';

import Isvg from 'react-inlinesvg';

import IconMan from 'images/icon_male_profile.svg';
import IconWoMen from 'images/icon_female_profile.svg';

const getImage = img =>
  createCloudinaryUrl(img, 'image', {
    width: '70',
    height: '70'
  });
class MemberListItem extends Component {
  constructor(props) {
    super(props);

    this.state = {
      detailView: false
    };
  }

  onDetailView() {
    this.setState({ detailView: !this.state.detailView });
  }

  render() {
    const {
      member,
      checked,
      showChat,
      showRemove,
      showProfile,
      openChat,
      onCheckBoxChange,
      onRemove
    } = this.props;

    const { detailView } = this.state;

    const member_id = lodash.get(member, 'member_id');
    const screen_name = lodash.get(member, 'screen_name');
    const cloudinary_file_id = lodash.get(member, 'cloudinary_file_id') || '';
    const gender = lodash.get(member, 'gender');
    const registration_number = lodash.get(member, 'registration_number');
    const media = lodash.get(member, ['media', '0']);
    const personal_statement = lodash.get(member, 'personal_statement');
    const latest_digital_badge =
      lodash.get(member, 'latest_digital_badge') || {};
    const current_qualification = lodash.get(member, 'current_qualification');
    const short_title = lodash.get(current_qualification, 'short_title');
    const level = lodash.get(current_qualification, 'level');

    console.log(member);

    const profilePhotoUrl = getPhotoUrl({ gender, cloudinary_file_id });
    let mediaUrl = '';
    let mediaType = 'image';
    const digital_badge = createCloudinaryUrl(
      lodash.get(latest_digital_badge, 'cloudinary_file_id') || '',
      'image'
    );

    if (media) {
      mediaType = media.type == 'video' ? 'video' : 'image';
      mediaUrl = createCloudinaryUrl(media.cloudinary_file_id, mediaType);
    }

    return (
      <tr className="member-list-item">
        <td>
          <table>
            <tbody>
              <tr>
                <td>
                  <div className="columns">
                    <div className="column no-grow">
                      <label className="custom radio">
                        <input
                          type="checkbox"
                          value={member_id}
                          checked={checked}
                          onChange={e => onCheckBoxChange(e)}
                        />
                        <span className="ui" />
                      </label>
                    </div>
                    <div className="column no-grow">
                      {cloudinary_file_id ? (
                        <div
                          className={classNames('image')}
                          style={{
                            backgroundImage: cloudinary_file_id
                              ? `url(${profilePhotoUrl})`
                              : ''
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
                    <div className="column name">
                      <div>
                        <div>{screen_name}</div>
                        <div>
                          <Text iKey="registration_number" /> {member_id}
                        </div>
                      </div>
                    </div>
                  </div>
                </td>

                <td>
                  <div className="columns text-center">
                    {showChat && (
                      <div className="column action" onClick={e => openChat(e)}>
                        <div className="action-message" />
                        <div className="action-title">
                          <Text iKey="message" />
                        </div>
                      </div>
                    )}

                    {showProfile && (
                      <div className="column action">
                        {detailView ? (
                          <span
                            onClick={() => this.onDetailView()}
                            style={{ cursor: 'pointer' }}
                          >
                            <i
                              className="fa fa-angle-up"
                              style={{ fontSize: '22px' }}
                            />
                          </span>
                        ) : (
                          <a onClick={() => this.onDetailView()}>
                            <div className="action-profile">
                              {/*gender == 1 ? <Isvg src={IconMan} /> : <Isvg src={IconWoMen} />*/}
                            </div>
                            <div className="action-title">
                              <Text iKey="profile" />
                            </div>
                          </a>
                        )}
                      </div>
                    )}

                    {showRemove && (
                      <div className="column action" onClick={e => onRemove(e)}>
                        <div className="action-remove" />
                        <div className="action-title">
                          <Text iKey="remove_user" />
                        </div>
                      </div>
                    )}
                  </div>
                </td>
              </tr>

              {detailView && (
                <tr>
                  <td colSpan="100" style={{ padding: '0 0 0 80px' }}>
                    <div className="profile-section">
                      <div
                        className="profile-section-header"
                        style={{
                          backgroundImage: mediaUrl ? `url(${mediaUrl})` : ''
                        }}
                      >
                        <div className="detail-profile-image">
                          {cloudinary_file_id ? (
                            <div
                              className={classNames('image')}
                              style={{
                                backgroundImage: cloudinary_file_id
                                  ? `url(${profilePhotoUrl})`
                                  : ''
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
                        <div className="profile-name">
                          <div className="profile-screen-name">
                            {screen_name}
                          </div>
                          <div className="qualification-name">
                            <span>{short_title}</span> &nbsp;
                            <span>{`Level ${level}`}</span> &nbsp;
                          </div>
                        </div>
                        <div className="select-button">
                          <button
                            className="button is-medium is-primary"
                            onClick={e => onCheckBoxChange(e)}
                          >
                            <span>Select</span>
                          </button>
                        </div>
                      </div>
                      <div
                        className=""
                        style={{
                          minHeight: '100px',
                          marginLeft: '-80px',
                          padding: '15px',
                          position: 'relative',
                          fontSize: '18px'
                        }}
                      >
                        <div style={{ padding: '0 0 0 234px' }}>
                          <span>DOB: </span>
                          <span>
                            {lodash.get(member, 'date_of_birth') || ''}
                          </span>
                          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                          <span>
                            Based in: {lodash.get(member, 'town_city') || ''}
                          </span>
                        </div>
                      </div>

                      <hr />

                      <div className="personal-statement">
                        <div className="timeline__title-row">
                          <h3 className="timeline__title section-title semibold">
                            Personal statement
                          </h3>
                          <p>{personal_statement}</p>
                        </div>
                      </div>

                      <hr />

                      <div className="personal-statement">
                        <div className="timeline__title-row">
                          <h3 className="timeline__title section-title semibold">
                            Latest Archivement
                          </h3>
                          <div
                            className="is-flex"
                            style={{ padding: '15px 0' }}
                          >
                            <div
                              className={classNames('image')}
                              style={{
                                backgroundImage: digital_badge
                                  ? `url(${digital_badge})`
                                  : ''
                              }}
                            />
                            <div style={{ padding: '5px 15px' }}>
                              {lodash.get(latest_digital_badge, 'title') || ''}
                            </div>
                          </div>
                          <hr />
                          <p className="p-t-15">
                            {lodash.get(latest_digital_badge, 'description') ||
                              ''}
                          </p>
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </td>
      </tr>
    );
  }
}

export default connect()(MemberListItem);

// <MemberProgressBadge
//   {...{
//     cloudinary_file_id,
//     profilePhotoId: profilePhotoUrl,
//     canSeeOthersProgress: true,
//     progress_percentage: 0,
//     isLearner: false,
//     gender,
//     dimensions: 214,
//     visibleNoPhoto: false
//   }}
// />

// <div className="profile-section">
//       <h3 className="profile-title">My CV</h3>

//       {profile &&
//         <Statement
//           {...{
//             hasEditPermissions,
//             editingStatement,
//             toggleEditStatement,
//             personal_statement:
//               profile.personal_statement &&
//                 profile.personal_statement.toString(),
//             onStatementSave: data => {
//               toggleEditStatement();
//               return onStatementSave({
//                 member_id: profile.member_id,
//                 form: data
//               });
//             }
//           }}
//         />}

//       <Timeline
//         {...{
//           hasEditPermissions,
//           bio,
//           toggleNewBio,
//           toggleEditBio,
//           onBioDelete
//         }}
//       />

//       <ContentModalNew isOpened={!!addingBio} onClose={toggleNewBio}>
//         <BioForm
//           {...{
//             action: 'add',
//             type: addingBio.type,
//             postingMemberBio,
//             onCancel: toggleNewBio,
//             onSave: form => onBioAdd({ member_id: profile.member_id, form })
//           }}
//         />
//       </ContentModalNew>

//       <ContentModalNew isOpened={!!editingBio} onClose={toggleEditBio}>
//         <BioForm
//           {...{
//             action: 'edit',
//             type: editingBio.type,
//             bio: editingBio,
//             editingMemberBio,
//             onCancel: toggleEditBio,
//             onSave: form =>
//               onBioEdit({ member_id: profile.member_id, member_bio_id, form })
//           }}
//         />
//       </ContentModalNew>
//     </div>
