import React, { useEffect, useState, useRef } from 'react';
import { connect } from 'react-redux';

import common from 'app/common';
import { Creators } from '../actions';
import UserConflictHeader from '../components/user-conflict-header';
import UserConflictNavigation from '../components/user-conflict-navigation';
import UserConflictFilter from '../components/user-conflict-filters';
import UserConflictTable from '../components/user-conflict-table';
import UserConflictUpdateModal from '../components/user-conflict-update-modal';
import UserConflictDeleteModal from '../components/user-conflict-delete-modal';

const USERS_PER_PAGE = 10;

const { Pagination, ContentModal, UILoading } = common.components;

function UserConflictList({
  user,
  users,
  usersTotal,
  userUpdateLoading,
  usersLoading,
  userUpdatePopup,
  getUserConflictList,
  updateUserConflictEmail,
  closeUserConclictUpdateEmailModal,
  deleteUserConflict
}) {
  const [activeUser, setActiveUser] = useState();
  const [email, setEmail] = useState('');
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState('');
  const deleteModalRef = useRef();
  const deleteUserRef = useRef();

  const removeActiveUser = () => {
    setActiveUser(null);
  };

  const handleSetActiveUser = user => {
    if (activeUser && activeUser.member_id === user.member_id) {
      removeActiveUser();
    } else {
      setActiveUser(user);
    }
  };

  const updateEmail = () => {
    updateUserConflictEmail({ email }, activeUser.member_id);
  };

  const addUserToDelete = user => {
    deleteUserRef.current = user;
    deleteModalRef.current.open();
  };

  const deleteUser = () => {
    deleteUserConflict(deleteUserRef.current.member_id);
    deleteModalRef.current.close();
    deleteUserRef.current = null;
  };

  const changeSearch = searchValue => {
    setSearch(searchValue);
  };

  const changePage = pageValue => {
    getUserConflictList({
      offset: pageValue * USERS_PER_PAGE,
      search
    });
    setPage(pageValue);
  };

  useEffect(() => {
    getUserConflictList();
  }, []);

  useEffect(() => {
    getUserConflictList({
      offset: 0,
      search
    });
    setPage(0);
  }, [search]);

  return (
    <div className="user-conflict-container">
      <UserConflictHeader />
      <UserConflictNavigation setSearch={changeSearch} />
      {/* <UserConflictFilter /> */}
      <div className="container">
        <div className="user-conflict__total">
          Total Conflicts: {usersTotal}
        </div>
      </div>
      {usersLoading && <UILoading marginTop="100px" marginBottom="100px" />}
      {!usersLoading && (
        <UserConflictTable
          {...{
            user,
            users,
            activeUser,
            email,
            userUpdateLoading,
            setEmail,
            removeActiveUser,
            addUserToDelete,
            setActiveUser: handleSetActiveUser,
            updateEmail,
            deleteUserConflict
          }}
        />
      )}
      {userUpdatePopup && (
        <UserConflictUpdateModal
          onClose={closeUserConclictUpdateEmailModal}
          email={email}
        />
      )}
      <ContentModal ref={deleteModalRef}>
        <UserConflictDeleteModal
          onClose={deleteModalRef.current && deleteModalRef.current.close}
          onDelete={deleteUser}
        />
      </ContentModal>
      <Pagination
        itemsLength={usersTotal}
        itemsPerPage={USERS_PER_PAGE}
        maxPagesDisplayed={3}
        initialPage={page}
        onPageChange={changePage}
      />
    </div>
  );
}

const mapStateToProps = state => ({
  ...state.userConflict,
  user: state.profile.user
});

const mapDispatchToProps = dispatch => ({
  getUserConflictList: params =>
    dispatch(Creators.getUserConflictListAttempt(params)),
  updateUserConflictEmail: (params, member_id) =>
    dispatch(Creators.updateUserConflictEmailAttempt(params, member_id)),
  closeUserConclictUpdateEmailModal: () =>
    dispatch(Creators.closeUserConclictUpdateEmailModal()),
  deleteUserConflict: member_id =>
    dispatch(Creators.deleteUserConflictAttempt(member_id))
});

export default connect(mapStateToProps, mapDispatchToProps)(UserConflictList);
