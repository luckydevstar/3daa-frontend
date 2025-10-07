import React from 'react';
import PNGQualificationScplh from 'images/qualifications/qualification-scplh.png';

const BookTestConfirm = () =>
  <div className="book-test-confirm">
    <img src={PNGQualificationScplh} alt="" />
    <h1>Click to confirm the booking</h1>
    <div className="actions">
      <button className="button is-primary">Confirm</button>
    </div>
  </div>;

export default BookTestConfirm;
