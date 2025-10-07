import React from 'react';

const CustomerPublishModal = ({ closeCustomerPublishModal }) =>
  <div className="customer-publish">
    <h2 className="p-t-20">Ready to Publish</h2>
    <p className="p-t-20">Your new Brand is ready to Publish</p>
    <p className="p-30">
      This will now be handed off to the development team to be processed please
      double check that you have included everything supplied by the client
      before publishing.
    </p>
    <div className="btns">
      <button
        className="button is-primary m-t-30"
        onClick={() => closeCustomerPublishModal()}
      >
        Confirm and Publish
      </button>
    </div>
  </div>;

export default CustomerPublishModal;
