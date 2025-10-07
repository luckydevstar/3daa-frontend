import React from 'react';
import { FieldArray } from 'redux-form';

const Overview = ({ isTutor }) => (
  <div className="group-overview-container p-30">
    <h3>Confirm group members</h3>
    <div className="columns">
      {!isTutor && (
        <div className="column">
          <h4>Tutors</h4>
          <FieldArray
            name="tutors"
            component={({ fields }) => (
              <div>
                {fields.length
                  ? fields.getAll().map(__ => (
                      <div key={__.member_id} className="seat">
                        {__.screen_name}
                      </div>
                    ))
                  : '0 tutors selected'}
              </div>
            )}
          />
        </div>
      )}
      <div className="column">
        <h4>Learners</h4>
        <FieldArray
          name="learners"
          component={({ fields }) => (
            <div>
              {fields.length
                ? fields.getAll().map(__ => (
                    <div key={__.member_id} className="seat">
                      {__.screen_name}
                    </div>
                  ))
                : '0 learners selected'}
            </div>
          )}
        />
      </div>
      {/* <div className="column">
        <h4>Seats</h4>
        <FieldArray
          name="seats"
          component={({ fields }) => (
            <div>
              {fields.length
                ? fields.getAll().map(__ => (
                    <div key={__.registration_number} className="seat">
                      {__.registration_number}
                    </div>
                  ))
                : '0 seats selected'}
            </div>
          )}
        />
      </div> */}
    </div>
  </div>
);

export default Overview;
