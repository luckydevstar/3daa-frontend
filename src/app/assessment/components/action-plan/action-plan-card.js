import React, { Component } from 'react';
import PropTypes from 'prop-types';
import common from 'app/common';
import classNames from 'classnames';
import Isvg from 'react-inlinesvg';
import IconBook from 'images/icon-book.svg';
import IconDate from 'images/icon-date.svg';
import IconFilm from 'images/icon-film.svg';
import IconPencil from 'images/icon_pencil.svg';
import IconShare from 'images/icon-share.svg';

class ActionPlanCard extends Component {
  render() {
    const { item, isActive } = this.props;
    return (
      <div className="action-plan-card">
        <div className="card-header">
          <div className="col col-4">
            <div className="col position-relative border-right">
              <Isvg className="small" src={IconFilm} />
              <span className="badge">3</span>
            </div>
            <div className="col position-relative border-right">
              <Isvg className="small" src={IconBook} />
              <span className="badge">2</span>
            </div>
            <div className="col position-relative">
              <Isvg className="small" src={IconShare} />
              <span className="badge">29</span>
            </div>
          </div>

          <div className="col col-4 text-right">
            <Isvg className="small" src={IconDate} />
            <span> Due 5 days</span>
          </div>
        </div>

        <div className="card-body p-2 position-relative">
          <div className="edit-btn position-absolute">
            <Isvg className="small" src={IconPencil} />
          </div>

          <div className="row py-2">
            <div className="col d-flex flex-row align-items-center justify-content-center">
              <span className="circle p-1 active">
                <i className="fas fa-circle" />
              </span>
              <span className="circle p-1 active">
                <i className="fas fa-circle" />
              </span>
              <span className="circle p-1 active">
                <i className="fas fa-circle" />
              </span>
              <span className="circle p-1 active">
                <i className="fas fa-circle" />
              </span>
              <span className="circle p-1 active">
                <i className="fas fa-circle" />
              </span>
              <span className="circle p-1 active">
                <i className="fas fa-circle" />
              </span>
              <span className="circle p-1">
                <i className="fas fa-circle" />
              </span>
              <span className="circle p-1">
                <i className="fas fa-circle" />
              </span>
              <span className="circle p-1">
                <i className="fas fa-circle" />
              </span>
              <span className="circle p-1">
                <i className="fas fa-circle" />
              </span>
              <span className="pl-3">COMPLETED BY 60%</span>
            </div>
          </div>

          <div className="row justify-content-center">
            <div className="col col-6 border-bottom" />
          </div>

          <div className="row py-4 justify-content-center">
            <div className="col text-center">
              <h5>Lesson Preparation - Red Wines</h5>
              <p className="px-3">
                On friday we are going to go through the different types of red
                wine available. Before then I'd like you to familiarise...
              </p>
            </div>
          </div>

          <div className="row justify-content-center">
            <div className="col col-6 border-bottom" />
          </div>

          <div className="row mt-3 justify-content-center">
            <button type="button" className="btn btn-outline py-2 px-4">
              VIEW
            </button>
          </div>
        </div>
      </div>
    );
  }
}

ActionPlanCard.propTypes = {
  item: PropTypes.object.isRequired,
  isActive: PropTypes.bool
};

ActionPlanCard.defaultProps = {
  item: {},
  isActive: false
};

export default ActionPlanCard;
