import React, { Component } from 'react';
import { connect } from 'react-redux';

import common from 'app/common';

const {
  components: { CloudinaryMedia }
} = common;

import ExImage from 'images/bg-upload.png';
import ImageMidwifery from 'images/midwifery.png';
import ImageProfilePicture from 'images/profile-picture.png';

class CvPreviewModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isExperience: true
    };

    this.toggleExperience = this.toggleExperience.bind(this);
  }

  toggleExperience() {
    this.setState({
      isExperience: !this.state.isExperience
    });
  }

  render() {
    const { profile, bio, coverPhotos, badges, photos } = this.props;
    const { isExperience } = this.state;

    return (
      <div className="cv-preview">
        <h1>CV Preview</h1>

        <div className="main-media">
          {/* <img src={ImageMidwifery} alt="" /> */}
          {coverPhotos && coverPhotos.length > 0 && (
            <CloudinaryMedia
              fileId={coverPhotos[0].cloudinary_file_id}
              mediaType="image"
              transformations={{
                // width: 120,
                // height: 120,
                // crop: 'thumb',
                gravity: 'face'
              }}
            />
          )}
          <div className="avatar">
            <div className="picture">
              {/* <img src={ImageProfilePicture} alt="" /> */}
              {profile && profile.cloudinary_file_id && (
                <CloudinaryMedia
                  fileId={profile.cloudinary_file_id}
                  mediaType="image"
                  transformations={{
                    // width: 120,
                    // height: 120,
                    // crop: 'thumb',
                    gravity: 'face'
                  }}
                />
              )}
            </div>
            <p>Watch Video</p>
          </div>
        </div>

        <div className="content-section">
          <div className="columns">
            <div className="column is-6 is-offset-3 m-t-10 m-b-20">
              <div className="name">
                {profile && `${profile.first_name} ${profile.last_name}`}
              </div>
              <div className="sector m-t-10">
                {/* Health and Social Care | Level 2 */}
                {profile &&
                  profile.current_qualification &&
                  `${profile.current_qualification.title} | Level ${
                    profile.current_qualification.level
                  }`}
              </div>
            </div>
            <div className="column is-3 m-t-10">
              <p className="m-t-30">
                {profile &&
                  profile.date_of_birth &&
                  `DOB: ${profile.date_of_birth}`}
              </p>
              <p className="m-t-15">
                {profile &&
                  profile.address_id &&
                  `Based in: ${profile.address_id}`}
              </p>
            </div>
          </div>

          <hr className="m-0 p-0" />

          <div className="columns flex-direction-column p-l-20 p-r-20">
            <div className="column is-12 p-t-30">
              <p className="p1">Personal Statement</p>
            </div>
            <div className="column is-12">
              <p className="p2">
                {profile &&
                  profile.personal_statement &&
                  profile.personal_statement}
              </p>
            </div>
          </div>

          <hr className="m-l-30 m-r-30" />

          <div className="columns flex-direction-column p-l-20 p-r-20">
            <div className="column is-12 section-title">
              <div id="collapsible-panel-experience" defaultExpanded>
                <div>
                  <div className="p-b-30">Experience</div>
                  <div componentClass="a">
                    <i className="fa fa-angle-down" />
                    <i className="fa fa-angle-up" />
                  </div>
                </div>
                <div>
                  <div>
                    {bio &&
                      bio.experience &&
                      bio.experience.map((exp, index) => (
                        <div
                          id="collapsible-panel-experience-1"
                          className="experience-panel"
                          defaultExpanded
                          key={`experience-cv-${index}`}
                        >
                          <div>
                            <div>
                              <div className="columns">
                                <div className="column is-1">
                                  {exp.cloudinary_file_id ? (
                                    <CloudinaryMedia
                                      fileId={exp.cloudinary_file_id}
                                      mediaType="image"
                                      className="c-avatar"
                                      transformations={{
                                        // width: 120,
                                        // height: 120,
                                        // crop: 'thumb',
                                        gravity: 'face'
                                      }}
                                    />
                                  ) : (
                                    <img
                                      className="c-avatar"
                                      src={ExImage}
                                      alt=""
                                    />
                                  )}
                                </div>
                                <div className="column is-11">
                                  <p className="p3">{exp.title}:</p>
                                  <p className="p4">{exp.location}</p>
                                  <p className="p5">
                                    ({exp.from_date}-
                                    {exp.to_date ? exp.to_date : 'Present'})
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div componentClass="a" className="toggle-child">
                              <i className="fa fa-angle-down" />
                              <i className="fa fa-angle-up" />
                            </div>
                          </div>
                          <div>
                            <div>
                              <p className="p4 content">{exp.description}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <hr className="m-l-30 m-r-30" />

          <div className="columns flex-direction-column p-l-20 p-r-20">
            <div className="column is-12 section-title">
              <div id="collapsible-panel-education" defaultExpanded>
                <div>
                  <div className="p-b-30">Education</div>
                  <div componentClass="a">
                    <i className="fa fa-angle-down" />
                    <i className="fa fa-angle-up" />
                  </div>
                </div>
                <div>
                  <div>
                    {bio &&
                      bio.education &&
                      bio.education.map((edc, index) => (
                        <div
                          id="collapsible-panel-education-1"
                          className="education-panel"
                          defaultExpanded
                          key={`education-cv-${index}`}
                        >
                          <div>
                            <div>
                              <div className="columns">
                                <div className="column is-1">
                                  {edc.cloudinary_file_id ? (
                                    <CloudinaryMedia
                                      fileId={edc.cloudinary_file_id}
                                      mediaType="image"
                                      className="c-avatar"
                                      transformations={{
                                        // width: 120,
                                        // height: 120,
                                        // crop: 'thumb',
                                        gravity: 'face'
                                      }}
                                    />
                                  ) : (
                                    <img
                                      className="c-avatar"
                                      src={ExImage}
                                      alt=""
                                    />
                                  )}
                                </div>
                                <div className="column is-11">
                                  <p className="p3">{edc.title}</p>
                                  <p className="p4">{edc.location}</p>
                                  <p className="p5">
                                    ({edc.from_date}-
                                    {edc.to_date ? edc.to_date : 'Present'})
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div componentClass="a" className="toggle-child">
                              <i className="fa fa-angle-down" />
                              <i className="fa fa-angle-up" />
                            </div>
                          </div>
                          <div>
                            <div>
                              <p className="p4 content">{edc.description}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <hr className="m-l-30 m-r-30" />

          {/* <div className="columns flex-direction-column p-l-20 p-r-20">
            <div className="column is-12 section-title">
              <Panel id="collapsible-panel-reference" defaultExpanded>
                <Panel.Heading>
                  <Panel.Title className="p-b-30">My References</Panel.Title>
                  <Panel.Toggle componentClass="a">
                    <i className="fa fa-angle-down" />
                    <i className="fa fa-angle-up" />
                  </Panel.Toggle>
                </Panel.Heading>
                <Panel.Collapse>
                  <Panel.Body>
                    <Panel
                      id="collapsible-panel-reference-1"
                      className="reference-panel"
                      defaultExpanded
                    >
                      <Panel.Heading>
                        <Panel.Title>
                          <div className="columns">
                            <div className="column is-2">
                              <img className="r-avatar" src={ExImage} alt="" />
                            </div>
                            <div className="column is-10">
                              <p className="p3">Augusto Silvino</p>
                              <p className="p6">Tutor</p>
                              <p className="p7">
                                <span className="fa fa-play-circle-o p-r-10" />{' '}
                                Play Video
                              </p>
                            </div>
                          </div>
                        </Panel.Title>
                        <Panel.Toggle
                          componentClass="a"
                          className="toggle-child"
                        >
                          <i className="fa fa-angle-down" />
                          <i className="fa fa-angle-up" />
                        </Panel.Toggle>
                      </Panel.Heading>
                      <Panel.Collapse>
                        <Panel.Body>
                          <p className="p4 content">
                            Anim pariatur cliche reprehenderit, enim eiusmod
                            high life accusamus terry richardson ad squid. Nihil
                            anim keffiyeh helvetica, craft beer labore wes
                            anderson cred nesciunt sapiente ea proident.
                          </p>
                        </Panel.Body>
                      </Panel.Collapse>
                    </Panel>

                    <Panel
                      id="collapsible-panel-reference-2"
                      className="reference-panel"
                      defaultExpanded
                    >
                      <Panel.Heading>
                        <Panel.Title>
                          <div className="columns">
                            <div className="column is-2">
                              <img className="r-avatar" src={ExImage} alt="" />
                            </div>
                            <div className="column is-10">
                              <p className="p3">Augusto Silvino</p>
                              <p className="p6">Tutor</p>
                            </div>
                          </div>
                        </Panel.Title>
                        <Panel.Toggle
                          componentClass="a"
                          className="toggle-child"
                        >
                          <i className="fa fa-angle-down" />
                          <i className="fa fa-angle-up" />
                        </Panel.Toggle>
                      </Panel.Heading>
                      <Panel.Collapse>
                        <Panel.Body>
                          <p className="p4 content">
                            Anim pariatur cliche reprehenderit, enim eiusmod
                            high life accusamus terry richardson ad squid. Nihil
                            anim keffiyeh helvetica, craft beer labore wes
                            anderson cred nesciunt sapiente ea proident.
                          </p>
                        </Panel.Body>
                      </Panel.Collapse>
                    </Panel>
                  </Panel.Body>
                </Panel.Collapse>
              </Panel>
            </div>
          </div>

          <hr className="m-l-30 m-r-30" /> */}

          <div className="columns flex-direction-column p-l-20 p-r-20">
            <div className="column is-12 section-title">
              <div id="collapsible-panel-digital-badges" defaultExpanded>
                <div>
                  <div className="p-b-30">My Digital Badges</div>
                  <div componentClass="a">
                    <i className="fa fa-angle-down" />
                    <i className="fa fa-angle-up" />
                  </div>
                </div>
                <div>
                  <div>
                    <div className="columns is-multiline">
                      {badges &&
                        badges.digital_badges &&
                        badges.digital_badges.map(badge => (
                          <div
                            className="column is-6"
                            key={`badge-${badge.digital_badge_id}`}
                          >
                            <div className="columns">
                              <div className="column is-4">
                                {badge.cloudinary_file_id ? (
                                  <CloudinaryMedia
                                    fileId={badge.cloudinary_file_id}
                                    mediaType="image"
                                    className="b-avatar"
                                    transformations={{
                                      // width: 120,
                                      // height: 120,
                                      // crop: 'thumb',
                                      gravity: 'face'
                                    }}
                                  />
                                ) : (
                                  <img
                                    className="b-avatar"
                                    src={ExImage}
                                    alt=""
                                  />
                                )}
                              </div>
                              <div className="column is-8">
                                <p className="p3 p-t-20">{badge.title}</p>
                                <p className="p4 p-t-20">{`Awarded ${
                                  badge.created
                                }`}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <hr className="m-l-30 m-r-30" />

          <div className="columns flex-direction-column p-l-20 p-r-20 p-b-50">
            <div className="column is-12 section-title">
              <div id="collapsible-panel-media" defaultExpanded>
                <div>
                  <div className="p-b-30">My Media</div>
                  <div componentClass="a">
                    <i className="fa fa-angle-down" />
                    <i className="fa fa-angle-up" />
                  </div>
                </div>
                <div>
                  <div>
                    <div className="columns is-multiline is-fullwidth">
                      {photos &&
                        photos.map(photo => (
                          <div className="column is-3">
                            <CloudinaryMedia
                              fileId={photo.cloudinary_file_id}
                              mediaType="image"
                              className="m-avatar"
                              transformations={{
                                // width: 120,
                                // height: 120,
                                // crop: 'thumb',
                                gravity: 'face'
                              }}
                            />
                            {/* <img className="m-avatar" src={ExImage} alt="" /> */}
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({
  profileBio: { profile, bio, photos, coverPhotos, videos, badges }
}) => ({
  profile,
  bio,
  photos,
  coverPhotos,
  videos,
  badges
});

export default connect(mapStateToProps)(CvPreviewModal);
