import React, { useState } from 'react';
import cx from 'classnames';

import ReportsArchiveUser from './reports-arhive-user';

const tableItems = [
  { id: 1 },
  { id: 2 },
  { id: 3 },
  { id: 4 },
  { id: 5 },
  { id: 6 }
];

function ExportManagerArchive() {
  const [activeUser, setActiveUser] = useState(tableItems[3]);
  return (
    <div className="community-export-manager-archive">
      <div className="container">
        <div className="community-export-manager-archive__header">
          <img src="/assets/images/logo.png" alt="" />
          <div className="community-export-manager-archive__header__path">
            {`Reports Activity > Archive Reports`}
          </div>
        </div>
        <div className="community-export-manager-archive__table-container">
          <div className="community-export-manager-archive__table">
            <table>
              <thead>
                <td>
                  <div className="community-export-manager-archive__table__thead__item">
                    <span>Date Created</span>
                    <i className="fa fa-angle-down" />
                  </div>
                </td>
                <td>
                  <div className="community-export-manager-archive__table__thead__item">
                    <span>Created by</span>
                    <i className="fa fa-angle-down" />
                  </div>
                </td>
                <td>
                  <div className="community-export-manager-archive__table__thead__item">
                    <span>Type</span>
                    <i className="fa fa-angle-down" />
                  </div>
                </td>
                <td>
                  <div className="community-export-manager-archive__table__thead__item">
                    <span>Status</span>
                    <i className="fa fa-angle-down" />
                  </div>
                </td>
              </thead>
              <tbody>
                {tableItems.map(item => (
                  <tr
                    className={cx({
                      active: activeUser.id === item.id
                    })}
                    onClick={() => {
                      setActiveUser(item);
                    }}
                  >
                    <td>
                      <div>
                        DD-MM-YYYY <br />
                        HH:MM:SS
                      </div>
                    </td>
                    <td>
                      <div>John Smith</div>
                    </td>
                    <td>
                      <div>All learners</div>
                    </td>
                    <td>
                      <div>100% Complete</div>
                    </td>
                    {activeUser.id === item.id && (
                      <img
                        className="community-export-manager-archive__table__tbody__item__triangle"
                        src="/assets/images/export-manager-table-triangle.png"
                        alt=""
                      />
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <ReportsArchiveUser />
        </div>
      </div>
    </div>
  );
}

export default ExportManagerArchive;
