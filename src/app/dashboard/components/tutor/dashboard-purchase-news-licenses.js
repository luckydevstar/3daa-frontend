import React from 'react';
import Isvg from 'react-inlinesvg';
import { Link } from 'react-router';
import QualificationSCPLH from 'images/qualifications/qualification-scplh.svg';

import Quantity from 'app/store/components/quantity';

const DashboardPurchaseNewsLicenses = ({ items, setItemCount, mockData }) => (
  <div className="dashboard-business">
    <div className="dashboard-business-store">
      <div className="card">
        <div className="qualification-info p-25">
          <div className="columns">
            <div className="column is-5">
              <img src={mockData.qualification_badge} />
            </div>
            <div className="column is-7 info">
              {items[0] && (
                <div className="price">£{items[0].price.toFixed(2)}</div>
              )}
              <div className="per">Per Person</div>
            </div>
          </div>
          <div className="name">Purchase a new Full registration</div>
        </div>
        <div className="buy-info p-25">
          <div className="columns m-t-20">
            <div className="column">
              {items[0] && (
                <Quantity
                  quantity={items[0].count}
                  onUpdate={v => setItemCount(0, v)}
                  showLabel={false}
                />
              )}
            </div>
            {items[0] && (
              <h3 className="column price">
                £{(items[0].price * items[0].count).toFixed(2)}
              </h3>
            )}
          </div>

          <div className="m-t-20">
            <Link
              className="button is-primary is-outlined is-fullwidth"
              to={`/store/course/1`}
            >
              Quick Buy
            </Link>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default DashboardPurchaseNewsLicenses;
