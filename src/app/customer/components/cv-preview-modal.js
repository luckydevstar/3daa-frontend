import React, { Component } from 'react';

import ExImage from 'images/avatar_example.png';
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
    const { profile } = this.props;
    console.log('###', profile);
    const { isExperience } = this.state;

    return (
      <div className="cv-preview">
        <h1>CV Preview</h1>

        <div className="main-media">
          <img src={ImageMidwifery} alt="" />
          <div className="avatar">
            <div className="picture">
              <img src={ImageProfilePicture} alt="" />
            </div>
            <p>Watch Video</p>
          </div>
        </div>

        <div className="content-section">
          <div className="columns">
            <div className="column is-6 is-offset-3 m-t-10 m-b-20">
              <div className="name">Louise Smith</div>
              <div className="sector m-t-10">
                Health and Social Care | Level 2
              </div>
            </div>
            <div className="column is-3 m-t-10">
              <p className="m-t-30">DOB: 15/09 1982</p>
              <p className="m-t-15">Based in: London SW3</p>
            </div>
          </div>

          <hr className="m-0 p-0" />

          <div className="columns flex-direction-column p-l-20 p-r-20">
            <div className="column is-12 p-t-30">
              <p className="p1">Personal Statement</p>
            </div>
            <div className="column is-12">
              <p className="p2">
                From studying for my GCSE’s it has always been an ambition of
                mine to study a course that I love and believe in. I have a
                creative flare and enjoy all things that involve digital design
                through the web and applications ever since early secondary
                school. My work experience taught me a lot about the computer
                industry especially the processes that are involved in designing
                and implementing a web site. I also worked as part of the
                full-time design team and produced work that was used in a final
                product of a brief from a client. Working part-time on a weekend
                at PC World has taught me many skills. These include teamwork,
                communication and working to defined time scales. Through this,
                I have developed my skills in listening and responding with
                product combinations specifically for a customer’s needs, a
                skill that helps build my design proposals and briefs. It is
                also a skill I hope to bring with me through my studies. I have
                learnt to adapt well to different types of design and studied
                two digital graphics units and also an animation unit. I have
                really enjoyed the graphics unit with achieving distinctions
                with my creativity and flare but have studied film and media
                whilst being in the college business. It has made a huge impact
                to me but I know what would be best suited for me. With my
                creative mind, I wish to branch into that area of graphic and
                animation design.
              </p>
            </div>
          </div>

          <hr className="m-l-30 m-r-30" />

          <div className="columns flex-direction-column p-l-20 p-r-20">
            <div className="column is-12 section-title">
              <div id="collapsible-panel-experience">
                <div>
                  <div className="p-b-30">Experience</div>
                  <div componentClass="a">
                    <i className="fa fa-angle-down" />
                    <i className="fa fa-angle-up" />
                  </div>
                </div>
                <div>
                  <div>
                    <div
                      id="collapsible-panel-experience-1"
                      className="experience-panel"
                      defaultExpanded
                    >
                      <div>
                        <div>
                          <div className="columns">
                            <div className="column is-1">
                              <img className="c-avatar" src={ExImage} alt="" />
                            </div>
                            <div className="column is-11">
                              <p className="p3">KRL Printing:</p>
                              <p className="p4">Junior Designer</p>
                              <p className="p5">(August 2015-Present)</p>
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
                          <p className="p4 content">
                            Anim pariatur cliche reprehenderit, enim eiusmod
                            high life accusamus terry richardson ad squid. Nihil
                            anim keffiyeh helvetica, craft beer labore wes
                            anderson cred nesciunt sapiente ea proident.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div
                      id="collapsible-panel-experience-2"
                      className="experience-panel"
                      defaultExpanded
                    >
                      <div>
                        <div>
                          <div className="columns">
                            <div className="column is-1">
                              <img className="c-avatar" src={ExImage} alt="" />
                            </div>
                            <div className="column is-11">
                              <p className="p3">PC World:</p>
                              <p className="p4">Sales Assistant</p>
                              <p className="p5">(February 2014-June 2015)</p>
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
                          <p className="p4 content">
                            Anim pariatur cliche reprehenderit, enim eiusmod
                            high life accusamus terry richardson ad squid. Nihil
                            anim keffiyeh helvetica, craft beer labore wes
                            anderson cred nesciunt sapiente ea proident.
                          </p>
                        </div>
                      </div>
                    </div>
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
                    <div
                      id="collapsible-panel-education-1"
                      className="education-panel"
                      defaultExpanded
                    >
                      <div>
                        <div>
                          <div className="columns">
                            <div className="column is-1">
                              <img className="c-avatar" src={ExImage} alt="" />
                            </div>
                            <div className="column is-11">
                              <p className="p3">
                                South and City Collage, Birmingham
                              </p>
                              <p className="p4">
                                Advanced Apprenticeship in Creative & Digital
                                Media Level 3
                              </p>
                              <p className="p5">(June 2014-June 2016)</p>
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
                          <p className="p4 content">
                            Anim pariatur cliche reprehenderit, enim eiusmod
                            high life accusamus terry richardson ad squid. Nihil
                            anim keffiyeh helvetica, craft beer labore wes
                            anderson cred nesciunt sapiente ea proident.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div
                      id="collapsible-panel-education-2"
                      className="education-panel"
                      defaultExpanded
                    >
                      <div>
                        <div>
                          <div className="columns">
                            <div className="column is-1">
                              <img className="c-avatar" src={ExImage} alt="" />
                            </div>
                            <div className="column is-11">
                              <p className="p3">West Nottinghamshire College</p>
                              <p className="p4">
                                NQF Diploma in Creative Media Production
                                (Interactive Media) Level 2
                              </p>
                              <p className="p5">(February 2014-June 2015)</p>
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
                          <p className="p4 content">
                            Anim pariatur cliche reprehenderit, enim eiusmod
                            high life accusamus terry richardson ad squid. Nihil
                            anim keffiyeh helvetica, craft beer labore wes
                            anderson cred nesciunt sapiente ea proident.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <hr className="m-l-30 m-r-30" />

          <div className="columns flex-direction-column p-l-20 p-r-20">
            <div className="column is-12 section-title">
              <div id="collapsible-panel-reference" defaultExpanded>
                <div>
                  <div className="p-b-30">My References</div>
                  <div componentClass="a">
                    <i className="fa fa-angle-down" />
                    <i className="fa fa-angle-up" />
                  </div>
                </div>
                <div>
                  <div>
                    <div
                      id="collapsible-panel-reference-1"
                      className="reference-panel"
                      defaultExpanded
                    >
                      <div>
                        <div>
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
                        </div>
                        <div componentClass="a" className="toggle-child">
                          <i className="fa fa-angle-down" />
                          <i className="fa fa-angle-up" />
                        </div>
                      </div>
                      <div>
                        <div>
                          <p className="p4 content">
                            Anim pariatur cliche reprehenderit, enim eiusmod
                            high life accusamus terry richardson ad squid. Nihil
                            anim keffiyeh helvetica, craft beer labore wes
                            anderson cred nesciunt sapiente ea proident.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div
                      id="collapsible-panel-reference-2"
                      className="reference-panel"
                      defaultExpanded
                    >
                      <div>
                        <div>
                          <div className="columns">
                            <div className="column is-2">
                              <img className="r-avatar" src={ExImage} alt="" />
                            </div>
                            <div className="column is-10">
                              <p className="p3">Augusto Silvino</p>
                              <p className="p6">Tutor</p>
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
                          <p className="p4 content">
                            Anim pariatur cliche reprehenderit, enim eiusmod
                            high life accusamus terry richardson ad squid. Nihil
                            anim keffiyeh helvetica, craft beer labore wes
                            anderson cred nesciunt sapiente ea proident.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <hr className="m-l-30 m-r-30" />

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
                      <div className="column is-6">
                        <div className="columns">
                          <div className="column is-4">
                            <img className="b-avatar" src={ExImage} alt="" />
                          </div>
                          <div className="column is-8">
                            <p className="p3">
                              Research Methodology for Health and Social Care
                            </p>
                            <p className="p4">Awarded 13 / 07 / 2016</p>
                          </div>
                        </div>
                      </div>

                      <div className="column is-6">
                        <div className="columns">
                          <div className="column is-4">
                            <img className="b-avatar" src={ExImage} alt="" />
                          </div>
                          <div className="column is-8">
                            <p className="p3">
                              Research Methodology for Health and Social Care
                            </p>
                            <p className="p4">Awarded 13 / 07 / 2016</p>
                          </div>
                        </div>
                      </div>

                      <div className="column is-6">
                        <div className="columns">
                          <div className="column is-4">
                            <img className="b-avatar" src={ExImage} alt="" />
                          </div>
                          <div className="column is-8">
                            <p className="p3">
                              Research Methodology for Health and Social Care
                            </p>
                            <p className="p4">Awarded 13 / 07 / 2016</p>
                          </div>
                        </div>
                      </div>
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
                      <div className="column is-3">
                        <img className="m-avatar" src={ExImage} alt="" />
                      </div>
                      <div className="column is-3">
                        <img className="m-avatar" src={ExImage} alt="" />
                      </div>
                      <div className="column is-3">
                        <img className="m-avatar" src={ExImage} alt="" />
                      </div>
                      <div className="column is-3">
                        <img className="m-avatar" src={ExImage} alt="" />
                      </div>
                      <div className="column is-3">
                        <img className="m-avatar" src={ExImage} alt="" />
                      </div>
                      <div className="column is-3">
                        <img className="m-avatar" src={ExImage} alt="" />
                      </div>
                      <div className="column is-3">
                        <img className="m-avatar" src={ExImage} alt="" />
                      </div>
                      <div className="column is-3">
                        <img className="m-avatar" src={ExImage} alt="" />
                      </div>
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

export default CvPreviewModal;
