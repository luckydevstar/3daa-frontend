import React, { useState } from 'react';

import ProfileMediaDocumentsList from './profile-media-documents-list';
import ProfileMediaDocumentsPreview from './profile-media-documents-preview';
import ProfileMediaAddModal from '../../../containers/profile-media-add-modal';

const documents = [
  {
    id: 1,
    title: 'Title of the document 1',
    description: 'Short description of the document thats been uploaded.',
    format: 'xls'
  },
  {
    id: 2,
    title: 'Title of the document 2',
    description: 'Short description of the document thats been uploaded.',
    format: 'pdf'
  },
  {
    id: 3,
    title: 'Title of the document 3',
    description: 'Short description of the document thats been uploaded.',
    format: 'docx'
  }
];

function ProfileMediaDocuments({ addDocumentModal, closeAddDocumentModal }) {
  const [selectedDocument, setSelectedDocument] = useState(documents[0]);

  return (
    <div className="profile-media-documents">
      <ProfileMediaDocumentsList
        {...{
          documents,
          selectedDocument,
          setSelectedDocument
        }}
      />
      <ProfileMediaDocumentsPreview
        {...{
          selectedDocument
        }}
      />
      <ProfileMediaAddModal
        {...{
          isOpen: addDocumentModal,
          onClose: closeAddDocumentModal
        }}
        isDocument
      />
    </div>
  );
}

export default ProfileMediaDocuments;
