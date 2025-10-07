import React, { useState } from 'react';
import GoogleMapReact from 'google-map-react';
import cx from 'classnames';

const CommunityCardItemBackCentre = ({ itemData }) => {
  const [opened, setOpened] = useState(false);

  const { centre_name, uk_mobile_number, number_of_learners } = itemData;
  return (
    <div className="community-card-item-back">
      <div className="community-card-item-back__map">
        <GoogleMapReact
          bootstrapURLKeys={{
            key: 'AIzaSyBpUgQiH-C1JHPtX4uYesIUqjvPgou9d80'
          }}
          center={{
            lat: 51.508529,
            lng: -0.1404444
          }}
          defaultZoom={11}
          options={{
            disableDefaultUI: true,
            draggable: false,
            maxZoom: 11,
            minZoom: 11
          }}
        />
      </div>
      <div className="community-card-item-back__content">
        <div className="community-card-item-back__content__name">
          {centre_name}
        </div>
        <div className="community-card-item-back__content__phone">
          {uk_mobile_number}
        </div>
        <div className="community-card-item-back__content__tag">Centre</div>
      </div>
      <div
        className={cx('community-card-item-back__info', {
          'community-card-item-back__info--open': opened
        })}
      >
        <div
          className="community-card-item-back__info__toggle"
          onClick={() => setOpened(!opened)}
        >
          <i className="fa fa-chevron-up" />
        </div>
        <div className="community-card-item-back__info__row">
          <div>Address</div>
          <div>
            <div>Strand</div>
            <div>London, WC2R 2LS</div>
          </div>
        </div>
        <div className="community-card-item-back__info__row">
          <div>Contact</div>
          <div>Edward Byme</div>
        </div>
        <div className="community-card-item-back__info__row">
          <div>Website</div>
          <div>www.kcl.ac.uk</div>
        </div>
        <div className="community-card-item-back__info__row">
          <div>Learners</div>
          <div>{number_of_learners}</div>
        </div>
        <div className="community-card-item-back__info__row">
          <div>EQA Assigned</div>
          <div>Mary Whitehouse</div>
        </div>
      </div>
    </div>
  );
};

export default CommunityCardItemBackCentre;
