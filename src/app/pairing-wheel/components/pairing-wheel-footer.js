import React from 'react';

const PairingWheelFooter = () => (
  <div className="pairing-footer">
    <button className="button m-r-20 pairing-footer__delete">
      Delete wheel
    </button>
    <button className="button m-r-20">Cancel</button>
    <button className="button is-default m-r-20 pairing-footer__save">
      Save Changes
    </button>
    <button className="button is-success pairing-footer__publish" disabled>
      Publish
    </button>
  </div>
);

export default PairingWheelFooter;
