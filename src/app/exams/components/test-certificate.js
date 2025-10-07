import React, { Component } from 'react';
import PropTypes from 'prop-types';

import TestResults from './test-results';

import CertificateSvg from 'images/slta-certificate.svg';
import Scplh from 'images/qualifications/qualification-scplh.svg';
import SignPng from 'images/sign.png';

class TestCertificate extends Component {
  constructor(props) {
    super(props);

    this.state = {
      resultVisible: false
    };

    this.showResults = this.showResults.bind(this);
    this.hideResults = this.hideResults.bind(this);
  }

  showResults() {
    this.setState({
      resultVisible: true
    });
  }

  hideResults() {
    this.setState({
      resultVisible: false
    });
  }

  render() {
    const { resultVisible } = this.state;

    return (
      <div className="test-certificate">
        <div className="certificate-body">
          <img alt="" className="bg" src={CertificateSvg} />
          <img alt="" className="centred qualification-img" src={Scplh} />
          <span className="centred results">Results</span>
          <span className="centred congratulations">
            Congratulations {name}!
          </span>
          <span className="centred welldone">
            Well done! That is a great score you’ve earned your SCPLH
          </span>
          <a
            className="centred result-link is-link is-primary"
            onClick={this.showResults}
          >
            Click here to see your results
          </a>
          <span className="centred instructions">
            You’ve been awarded your digital badge and your certificate will be
            issued shortly
          </span>
          <img alt="" className="sign" src={SignPng} />
          <span className="signee">M. Smithers HEAD OF SLTA</span>
        </div>
        {resultVisible && <TestResults hideResults={this.hideResults} />}
      </div>
    );
  }
}

TestCertificate.propTypes = {
  name: PropTypes.string
};

TestCertificate.defaultProps = {
  name: 'Louise'
};

export default TestCertificate;
