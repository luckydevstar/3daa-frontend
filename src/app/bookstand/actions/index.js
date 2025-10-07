import { createActions } from 'reduxsauce';

export const { Types, Creators } = createActions({
  // Sector qualifications
  getSectorQualificationsAttempt: ['sectorId'],
  getSectorQualificationsSuccess: ['qualifications'],
  getSectorQualificationsFailure: ['errorCode'],
  getSectorQualificationAttempt: ['qualificationId'],
  getSectorQualificationSuccess: ['qualification'],
  getSectorQualificationFailure: ['errorCode'],
  // Centre (tutor) qualifications
  getCentreTutorQualificationsAttempt: ['centreId', 'sectorId'],
  getCentreTutorQualificationsSuccess: ['qualifications'],
  getCentreTutorQualificationsFailure: ['errorCode'],
  getCentreTutorQualificationAttempt: ['centreId', 'qualificationId'],
  getCentreTutorQualificationSuccess: ['qualification'],
  getCentreTutorQualificationFailure: ['errorCode'],
  // Assess learner
  getAssessLearnerAttempt: ['memberId'],
  getAssessLearnerSuccess: ['member'],
  getAssessLearnerFailure: ['errorCode'],
  // Learner qualifications
  getLearnerQualificationsAttempt: ['memberId', 'sectorId'],
  getLearnerQualificationsSuccess: ['qualifications'],
  getLearnerQualificationsFailure: ['errorCode'],
  getLearnerQualificationAttempt: ['qualificationId'],
  getLearnerQualificationSuccess: ['qualification'],
  getLearnerQualificationFailure: ['errorCode'],
  // Filter
  setBookstandActiveLevel: ['level'],
  setBookstandSearchQuery: ['query']
});
