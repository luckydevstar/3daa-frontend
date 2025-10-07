import React from 'react';

const JobsAdminCardFront = ({ name, avatarUrl }) => (
  <div className="jobs-admin-card front">
    <div className="media">
      <img src={avatarUrl} alt="video or img" />

      <div className="avatar">
        <img src={avatarUrl} alt="video or img" />
      </div>
    </div>
    <div className="member-infos">
      <p className="name">{name}</p>
      <p>Registration Number: YF083f40</p>
      <p className="dob">Date of Birth: 01/01/1970</p>
    </div>
  </div>
);

export default JobsAdminCardFront;
