import React from 'react';
import cx from 'classnames';
import UserConflictActiveUser from './user-conflict-active-user';

const UserConflictTableTr = ({
  user,
  active,
  activeUser,
  setActiveUser,
  addUserToDelete
}) => (
  <tr
    className={cx({
      active
    })}
  >
    <td>
      <div className="user-conflict__table__td-inner">
        {user.join_date || ''}
      </div>
    </td>
    <td>
      <div className="user-conflict__table__td-inner">{user.email}</div>
    </td>
    <td>
      <div className="user-conflict__table__td-inner">
        {user.registration_number || ''}
      </div>
    </td>
    <td>
      <div className="user-conflict__table__td-inner">
        {`${user.first_name || ''} ${user.last_name || ''}`}
      </div>
    </td>
    <td>
      <div
        className={cx(
          'user-conflict__table__td-inner',
          'user-conflict__table__td-inner-edit',
          {
            'user-conflict__table__td-inner--centered': activeUser
          }
        )}
        onClick={setActiveUser}
      >
        {!activeUser && <span>Edit Credentials</span>}
        <img src="/assets/images/edit.svg" />
      </div>
    </td>
    <td>
      <div
        className={cx(
          'user-conflict__table__td-inner',
          'user-conflict__table__td-inner--delete',
          {
            'user-conflict__table__td-inner--centered': activeUser
          }
        )}
        onClick={addUserToDelete}
      >
        {!activeUser && <span>Permanently Delete</span>}
        <img src="/assets/images/trash.svg" />
      </div>
    </td>
  </tr>
);

const UserConflictTable = ({
  user,
  users,
  activeUser,
  email,
  userUpdateLoading,
  setEmail,
  removeActiveUser,
  addUserToDelete,
  setActiveUser,
  setUpdatedModal,
  updateEmail,
  deleteUserConflict
}) => (
  <div className="container">
    <div className="user-conflict__table">
      <table>
        <thead>
          <tr>
            <th>
              <div>
                Date
                <i className="fa fa-angle-down" aria-hidden="true" />
              </div>
            </th>
            <th>
              <div>
                Email
                <i className="fa fa-angle-down" aria-hidden="true" />
              </div>
            </th>
            <th>
              <div>
                ULN
                <i className="fa fa-angle-down" aria-hidden="true" />
              </div>
            </th>
            <th>
              <div>
                User Name
                <i className="fa fa-angle-down" aria-hidden="true" />
              </div>
            </th>
            <th colSpan="2" />
          </tr>
        </thead>
        <tbody>
          {users.map(userConflict => (
            <UserConflictTableTr
              key={userConflict.member_id}
              user={userConflict}
              activeUser={activeUser}
              active={
                activeUser && activeUser.member_id === userConflict.member_id
              }
              addUserToDelete={() => {
                addUserToDelete(userConflict);
              }}
              deleteUserConflict={() => {
                deleteUserConflict(userConflict.member_id);
              }}
              setActiveUser={() => {
                setActiveUser(userConflict);
              }}
            />
          ))}
        </tbody>
      </table>
      {activeUser && (
        <UserConflictActiveUser
          {...{
            amendedName: user.screen_name,
            user: activeUser,
            email,
            userUpdateLoading,
            setEmail,
            removeActiveUser,
            setUpdatedModal,
            updateEmail
          }}
        />
      )}
    </div>
  </div>
);

export default UserConflictTable;
