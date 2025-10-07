import React from 'react';
import { Link } from 'react-router';
import Isvg from 'react-inlinesvg';
import IconPerson from 'images/icon_profile_person.svg';

const DashboardBusinessCardAwards = ({ mockData }) => (
  <div className="dashboard-business-awards">
    <div className="card p-20">
      <div className="columns">
        <div className="column is-3 has-text-centered">
          <img src={mockData.awards[0].image} />
        </div>
        <div className="column is-2 is-color-primary">17</div>
        <div className="column is-7">{mockData.awards[0].title}</div>
      </div>

      {/* <div className="columns">
        <div className="column is-3 has-text-centered">
          <img src={mockData.awards[1].image} />
        </div>
        <div className="column is-2 is-color-primary">05</div>
        <div className="column is-7">
          {mockData.awards[1].title}
        </div>
      </div> */}

      <div className="columns">
        <div className="column is-3 has-text-centered">
          <Isvg className="small" src={IconPerson} />
        </div>
        <div className="column is-2 is-color-primary">22</div>
        <div className="column is-7">Members of Staff</div>
      </div>

      <div className="m-t-20 m-b-20">
        <Link
          className="button is-primary is-outlined is-fullwidth"
          to="/community/learners"
        >
          Add Staff
        </Link>
      </div>
    </div>
  </div>
);

export default DashboardBusinessCardAwards;
