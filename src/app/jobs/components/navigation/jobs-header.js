import React from 'react';
import { Text } from 'app/intl';
import common from 'app/common';

const { UISelectDropdown } = common.components;

const Header = () =>
  <section className="content-section hero smaller jobs-header">
    <div className="hero-body">
      <div className="container">
        <div className="columns">
          <div className="column is-10">
            <h1 className="title">
              <Text iKey="find_a_job" />
            </h1>
            <h2 className="subtitle">
              <Text iKey="search_and_apply_for_new_roles" />
            </h2>
          </div>
          <div className="column is-2 sector_select_button">
            <UISelectDropdown
              dropdownList={[
                { key: '1', name: 'Art & Design' },
                { key: '2', name: 'Business Administration' },
                { key: '3', name: 'Construction' },
                { key: '4', name: 'Custermer Service' }
              ]}
            />
          </div>
        </div>
      </div>
    </div>
  </section>;

export default Header;
