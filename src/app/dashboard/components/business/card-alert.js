import React from 'react';

const DashboardBusinessCardAlert = ({ mockData, centreProfile }) => (
  <div className="dashboard-business-alert">
    <div className="card p-40" style={{ textAlign: 'left' }}>
      <h1 className="title" style={{ fontSize: '28px', color: '#4A4A4A' }}>
        {centreProfile.screen_name}{' '}
      </h1>
      <h2
        className="opensans-regular"
        style={{ fontSize: '18px', marginBottom: '5px' }}
      >
        {`${centreProfile.centre_contact_first_name} ${centreProfile.centre_contact_last_name}`}
      </h2>
      <p className="p-t-30">
        {centreProfile.contact_number}
        <br />
        {/* {mockData.w_info} */}
      </p>
      <p className="p-t-30 p-b-10">
        {`${centreProfile.address_line_1} ${centreProfile.address_line_2} ${centreProfile.postcode} ${centreProfile.city} ${centreProfile.country}`}
      </p>

      {centreProfile && centreProfile.facebook_url && (
        <p className="p-t-10">
          <a href={centreProfile.facebook_url} target="_blank">
            <div style={{ width: '30px', display: 'inline-block' }}>
              <i
                className="fa fa-facebook m-r-10"
                style={{ fontSize: '22px' }}
              />
            </div>
            <span style={{ display: 'inline-block' }}>Facebook</span>
          </a>
        </p>
      )}
      {centreProfile && centreProfile.twitter_url && (
        <p className="p-t-10">
          <a href={centreProfile.twitter_url} target="_blank">
            <div style={{ width: '30px', display: 'inline-block' }}>
              <i
                className="fa fa-twitter m-r-10"
                style={{ fontSize: '22px' }}
              />
            </div>
            <span style={{ display: 'inline-block' }}>Twitter</span>
          </a>
        </p>
      )}

      {centreProfile && centreProfile.linkedin_url && (
        <p className="p-t-10">
          <a href={centreProfile.linkedin_url} target="_blank">
            <div style={{ width: '30px', display: 'inline-block' }}>
              <i
                className="fa fa-linkedin m-r-10"
                style={{ fontSize: '22px' }}
              />
            </div>
            <span style={{ display: 'inline-block' }}>Linkedin</span>
          </a>
        </p>
      )}

      {centreProfile && centreProfile.opening_hours && (
        <p className="p-t-20">
          Opening Hours
          <br />
          {centreProfile.opening_hours}
        </p>
      )}
    </div>
    <div className="alert-logo">
      <img src={centreProfile.logo} />
    </div>
  </div>
);

export default DashboardBusinessCardAlert;
