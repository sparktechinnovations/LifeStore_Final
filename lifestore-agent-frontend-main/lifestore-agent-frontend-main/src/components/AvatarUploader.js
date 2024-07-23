/* eslint-disable no-undef */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import './NewAvatar.css';

AvatarUploader.propTypes = {
  isEdit: PropTypes.bool,
  onFileChange:PropTypes.func,
profilePic:PropTypes.string
};

function AvatarUploader({ isEdit,onFileChange,profilePic }) {
  const inputRef = useRef(null);


  const handleCameraClick = () => {
    inputRef.current.click();
  };
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (onFileChange) {
      onFileChange(file);
    }
  };

  return (
    <div>
      <div className="MuiBox-root css-m6sgpe" role="presentation">
        <div className="MuiBox-root css-1t5p1px">
          <div className="avatar-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {/* Image */}
            <span className="component-image MuiBox-root css-fnjgej">
              <span className="component-image-wrapper lazy-load-image-background blur lazy-load-image-loaded" style={{ color: 'transparent', display: 'inline-block' }}>
                <img className="MuiBox-root css-3j6ntj avatar-image" alt="avatar" src={profilePic || 'https://api-prod-minimal-v510.vercel.app/assets/images/avatar/avatar_2.jpg'} />
              </span>
            </span>

            {/* Camera Icon */}
            {isEdit && (
              <span className="camera-icon" style={{ position: 'absolute', bottom: 0, right: 20 }} onClick={handleCameraClick}>
                <CameraAltIcon />
              </span>
            )}

            {/* Hidden file input */}
            <input
              type="file"
              ref={inputRef}
              style={{ display: 'none' }}
              onChange={handleFileChange}
            accept='.jpg,.JPEG,.png,.JFIF'
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default AvatarUploader;
