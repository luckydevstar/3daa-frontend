import React from 'react';
import BodyTutor from './dashboard-body-tutor';
import BodyAdmin from './dashboard-body-admin';
import { Roles } from 'app/core/config/constants';
import { cond, always, T, equals } from 'ramda';

const DashboardBody = props => {
  const { centreSeats, centreLearners, centreQualifications, role } = props;

  const { CentreAdmin, CentreTutor, SuperAdmin, SiteAdmin } = Roles;

  const userBody = cond([
    [
      equals(CentreTutor),
      always(<BodyTutor {...{ centreLearners, centreQualifications }} />)
    ],
    [equals(SiteAdmin), always(null)],
    [equals(SuperAdmin), always(null)],
    [
      equals(CentreAdmin),
      always(<BodyAdmin {...{ centreSeats, centreQualifications }} />)
    ],
    [T, always(null)]
  ])(role);

  return (
    <div className="dashboard-body">
      <section className="content-section">
        <div className="container">
          {userBody}
        </div>
      </section>
    </div>
  );
};

export default DashboardBody;
