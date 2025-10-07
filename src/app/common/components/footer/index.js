import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Link } from 'react-router';
import { Text } from 'app/intl';

import config from 'brand/config';

const Footer = ({ className }) => (
  <section className={classNames('content-section', 'footer', className)}>
    <footer role="contentinfo">
      <div className="container">
        <nav className="is-primary">
          <ul>
            <li>
              {!config.termsUrl && (
                <Link to="/terms-and-use">
                  <Text iKey="terms_and_conditions" />
                </Link>
              )}
              {config.termsUrl && (
                <a href={config.termsUrl} target="_blank">
                  <Text iKey="terms_and_conditions" />
                </a>
              )}
            </li>
            <li>
              <a
                href={
                  config.privacyUrl ||
                  'https://www.skillsandeducationgroup.co.uk/protecting-your-privacy/'
                }
                target="_blank"
              >
                <Text iKey="privacy_policy" />
              </a>
            </li>
            {/* <li>
              <Link to="/cookie">
                <Text iKey="cookie_policy" />
              </Link>
            </li> */}
          </ul>
        </nav>
        <div className="copyright">
          <Text
            iKey="copyright_all_rights_reserved"
            vals={['businessTitle']}
            translateValue
          />
        </div>
      </div>
    </footer>
  </section>
);

Footer.propTypes = {
  className: PropTypes.string
};
Footer.defaultProps = {
  className: ''
};

export default Footer;
