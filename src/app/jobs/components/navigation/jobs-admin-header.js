import React from 'react';
import { Link } from 'react-router';

const AdminHeader = () =>
  <section className="content-section hero smaller jobs-admin-header">
    <div className="hero-body">
      <div className="container">
        <div className="columns">
          <div className="column is-three-quarters">
            <h1 className="title">Your Jobs</h1>
            <h2 className="subtitle">Search and view applicants</h2>
          </div>
          <div className="column btns">
            <Link to={`/jobs/admin/new`}>
              <button className="button is-primary is-outlined">
                Add New Job
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  </section>;

export default AdminHeader;
