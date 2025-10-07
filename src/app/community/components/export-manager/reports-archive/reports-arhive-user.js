import React from 'react';

const ReportsArchiveUser = () => (
  <div className="community-export-manager-archive__user">
    <div className="community-export-manager-archive__user__head">
      <div className="community-export-manager-archive__user__head__info">
        <div className="community-export-manager-archive__user__info__avatar">
          <img src="/assets/images/icon_femaie.png" alt="avatar" />
        </div>
        <div className="community-export-manager-archive__user__info__name">
          John Smith
        </div>
      </div>
      <div className="community-export-manager-archive__user__file">
        <button>Download</button>
        <div>
          File type <span>CSV</span>
        </div>
      </div>
    </div>
    <div className="community-export-manager-archive__user__info__container">
      <div className="community-export-manager-archive__user__info">
        <div className="community-export-manager-archive__user__info__title m-b-20">
          Report date range
        </div>
        <div className="community-export-manager-archive__user__info__description m-b-40">
          Sun 11 Jun 2021 - Mon 12 Jun 2021
        </div>
        <div className="community-export-manager-archive__user__info__title m-b-10">
          Qualification(s) in the report
        </div>
        <div className="community-export-manager-archive__user__info__description m-b-15">
          Level 1 Award <br />
          Keeping Self Safe Online
        </div>
        <div className="community-export-manager-archive__user__info__description">
          LARA Unit Ref: <br />
          603/6644/8a
        </div>
      </div>
    </div>
  </div>
);

export default ReportsArchiveUser;
