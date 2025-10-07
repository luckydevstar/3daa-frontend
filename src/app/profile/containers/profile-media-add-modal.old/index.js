import React, { useState } from 'react';
import { path, includes, cond, always, equals, T } from 'ramda';

import ProfileMediaAddModalStep1 from './step1';
import ProfileMediaAddModalStep2 from './step2';

function ProfileMediaAddModal({ profile, postMemberPhoto, postMemberVideo }) {
  const [activeStep, setActiveStep] = useState(0);
  const [mediaFile, setMediaFile] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [isShowReel, setIsShowReel] = useState(false);

  const onDrop = e => {
    e.preventDefault();
    const dataTransferFirst = e.dataTransfer.items && e.dataTransfer.items[0];
    const file = dataTransferFirst && dataTransferFirst.getAsFile();
    console.log(file);
    setMediaFile(file);
  };

  const onDragOver = e => {
    e.preventDefault();
  };

  const changeFile = e => {
    const file = e.target.files[0];
    setMediaFile(file);
  };

  const handleUpload = () => {
    const data = {
      member_id: profile.member_id,
      payload: {
        title,
        description,
        is_public: isPrivate ? 0 : 1,
        showreel: isShowReel ? 1 : 0,
        file: mediaFile
      }
    };
    postMemberPhoto(data);
  };

  const isImage = mediaFile && includes('image', path(['type'], mediaFile));
  const isVideo = mediaFile && includes('video', path(['type'], mediaFile));

  return (
    <div className="profile-media-add-modal">
      {cond([
        [
          equals(0),
          always(
            <ProfileMediaAddModalStep1
              {...{
                mediaFile,
                isImage,
                isVideo,
                changeFile,
                onDrop,
                onDragOver,
                onNext: () => {
                  setActiveStep(1);
                }
              }}
            />
          )
        ],
        [
          equals(1),
          always(
            <ProfileMediaAddModalStep2
              {...{
                title,
                description,
                isPrivate,
                isShowReel,
                setTitle,
                setDescription,
                setIsPrivate,
                setIsShowReel,
                onUpload: handleUpload,
                onBack: () => {
                  setActiveStep(0);
                }
              }}
            />
          )
        ],
        [T, always(null)]
      ])(activeStep)}
    </div>
  );
}

export default ProfileMediaAddModal;
