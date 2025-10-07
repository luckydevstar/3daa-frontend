import { createActions } from 'reduxsauce';

export const { Types, Creators } = createActions({
  getMemberAttempt: ['id'],
  getMemberSuccess: ['response'],
  getMemberFailure: ['errorCode'],

  getMemberBioAttempt: ['id'],
  getMemberBioSuccess: ['response'],
  getMemberBioFailure: ['errorCode'],

  getMemberCommunityAttempt: ['id'],
  getMemberCommunitySuccess: ['response'],
  getMemberCommunityFailure: ['errorCode'],

  getMemberMutualConnectionsAttempt: ['id'],
  getMemberMutualConnectionsSuccess: ['response'],
  getMemberMutualConnectionsFailure: ['errorCode'],

  getMemberPhotosAttempt: ['id'],
  getMemberPhotosSuccess: ['response'],
  getMemberPhotosFailure: ['errorCode'],

  getMemberVideosAttempt: ['id'],
  getMemberVideosSuccess: ['response'],
  getMemberVideosFailure: ['errorCode'],

  getMemberMediaAttempt: ['member_id', 'is_new_media'],
  getMemberMediaSuccess: ['media'],
  getMemberMediaFailure: ['errorCode'],

  getMemberReferenceAttempt: ['id'],
  getMemberReferenceSuccess: ['response'],
  getMemberReferenceFailure: ['errorCode'],

  postMemberBioAttempt: ['member_id', 'form'],
  postMemberBioSuccess: ['response'],
  postMemberBioFailure: ['errorCode'],

  postMemberPhotoAttempt: ['data'],
  postMemberPhotoSuccess: ['response'],
  postMemberPhotoFailure: ['errorCode'],

  postMemberVideoAttempt: ['data'],
  postMemberVideoSuccess: ['response'],
  postMemberVideoFailure: ['errorCode'],

  editMemberBioAttempt: ['member_id', 'member_bio_id', 'form'],
  editMemberBioSuccess: ['response'],
  editMemberBioFailure: ['errorCode'],

  editMemberPhotoAttempt: ['member_id', 'media_id', 'form'],
  editMemberPhotoSuccess: ['response'],
  editMemberPhotoFailure: ['errorCode'],

  editMemberVideoAttempt: ['member_id', 'media_id', 'form'],
  editMemberVideoSuccess: ['response'],
  editMemberVideoFailure: ['errorCode'],

  deleteMemberBioAttempt: ['member_id', 'member_bio_id'],
  deleteMemberBioSuccess: ['response'],
  deleteMemberBioFailure: ['errorCode'],

  deleteMemberPhotoAttempt: ['member_id', 'media_id'],
  deleteMemberPhotoSuccess: ['response'],
  deleteMemberPhotoFailure: ['errorCode'],

  deleteMemberVideoAttempt: ['member_id', 'media_id'],
  deleteMemberVideoSuccess: ['response'],
  deleteMemberVideoFailure: ['errorCode'],

  toggleAddPhoto: [],
  toggleAddVideo: [],
  viewMedia: ['media'],

  toggleNewBio: ['bioType'],
  toggleEditBio: ['bio'],

  updateLocalProfile: ['profile'],
  toggleEditStatement: [],

  getMemberBadgeAttempt: ['id'],
  getMemberBadgeSuccess: ['response'],
  getMemberBadgeFailure: ['errorCode'],

  getMemberCvAttempt: ['id'],
  getMemberCvSuccess: ['response'],
  getMemberCvFailure: ['errorCode'],

  deleteMemberMediaAttempt: ['member_id', 'media_id'],
  deleteMemberMediaSuccess: [],
  deleteMemberMediaFailure: ['errorCode'],

  openUpdateMediaModal: [],
  closeUpdateMediaModal: []
});
