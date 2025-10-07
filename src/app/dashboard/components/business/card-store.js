import React from 'react';
import Isvg from 'react-inlinesvg';
import { Link } from 'react-router';
import { path } from 'ramda';
import QualificationSCPLH from 'images/qualifications/qualification-scplh.svg';

import Quantity from '../../../store/components/quantity';

const DashboardBusinessCardStore = ({
  items,
  setItemCount,
  mockData,
  qualifications,
  addToCart
}) => {
  const qualification =
    qualifications && qualifications.length > 0 && qualifications[0];
  const title = path(['title'], qualification);
  return (
    <div className="dashboard-business-store">
      <div className="card">
        <div className="qualification-info p-25">
          <div className="columns">
            <div className="column is-5">
              <img
                src={path(
                  ['digital_badge', 'cloudinary_file_id'],
                  qualification
                )}
              />
            </div>
            <div className="column is-7 info">
              {items[0] && (
                <div className="price">£{items[0].price.toFixed(2)}</div>
              )}
              <div className="per">Per Person</div>
            </div>
          </div>
          {title && <div className="name">{title}</div>}
        </div>
        <div className="buy-info p-25">
          <div className="columns m-t-20">
            <div className="column is-6">
              {items[0] && (
                <Quantity
                  quantity={items[0].count}
                  onUpdate={v => setItemCount(0, v)}
                  showLabel={false}
                />
              )}
            </div>
            {items[0] && (
              <div className="column is-6 price">
                £{(items[0].price * items[0].count).toFixed(2)}
              </div>
            )}
          </div>

          <div className="m-t-20">
            <a href="https://skillsandeducationgroupawards.co.uk/qualification/level-1-award-in-keeping-self-safe-online/">
              <button
                className="button is-primary is-outlined is-fullwidth"
                // onClick={() => {
                //   addToCart(qualification.qualification_id);
                // }}
              >
                Quick Buy
              </button>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardBusinessCardStore;
