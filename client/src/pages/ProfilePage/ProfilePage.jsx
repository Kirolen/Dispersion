import React, { useState, useRef, useEffect } from 'react';
import styles from './ProfilePage.module.css';
import { getUserInfo, updateUserInfo } from '../../api/userService';
import makeToast from '../../Toaster/Toaster';
import { deleteFile, uploadFiles } from '../../api/fileService';

const defaultAvatar = 'https://i.pravatar.cc/150';

const ProfilePage = () => {
  const fileInputRef = useRef(null);

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    first_name: 'John',
    last_name: 'Doe',
    email: 'john@example.com',
    bio: 'A passionate learner',
    password: '',
    confirmPassword: '',
    avatar: ''
  });

  const [originalFormData, setOriginalFormData] = useState({});
  const [userAvatarFile, setUserAvatarFile] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await getUserInfo();
        const user = response.data;

        const userData = {
          first_name: user.first_name || '',
          last_name: user.last_name || '',
          email: user.email || '',
          bio: user.bio || '',
          avatar: user.avatar || '',
          password: '',
          confirmPassword: ''
        };

        setFormData(userData);
        setOriginalFormData(userData);
      } catch (error) {
        console.error('Error fetching user info:', error.message);
      }
    };

    fetchUserData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUserAvatarFile(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          avatar: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCancelEdit = () => {
    setFormData(originalFormData);
    setUserAvatarFile(null);
    setIsEditing(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newUserData = formData;
    if (userAvatarFile) {
      const fileURL = await uploadFiles(userAvatarFile, "avatars")

      if (originalFormData.avatar.trim()) await deleteFile(originalFormData.avatar)
      if (fileURL) {
        newUserData.avatar = fileURL[0].url;
      }
    }

    try {
      const response = await updateUserInfo(newUserData);
      if (response.success) {
        setOriginalFormData(newUserData);
        setIsEditing(false);
        makeToast("success", "User info updated successfully");
      }
    } catch (error) {
      makeToast("error", `Error during update info: ${error.message}`);
    }
  };

  return (
    <div className={styles.profileContainer}>
      <div className={styles.profileHeader}>
        <h1>Profile Settings</h1>
        <div className={styles.headerActions}>
          <button
            className={styles.editButton}
            onClick={() => {
              if (isEditing) {
                handleCancelEdit();
              } else {
                setIsEditing(true);
              }
            }}
          >
            {isEditing ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>
      </div>

      <div className={styles.profileContent}>
        <div className={styles.avatarSection}>
          <div
            className={styles.avatarContainer}
            onClick={isEditing ? handleImageClick : undefined}
            style={{ cursor: isEditing ? 'pointer' : 'default' }}
          >
            <img
              src={userAvatarFile || formData.avatar.trim() ? formData.avatar : defaultAvatar}
              alt="Profile"
              className={styles.avatar}
            />
            {isEditing && <div className={styles.avatarOverlay}>Change Photo</div>}
          </div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageChange}
            accept="image/*"
            style={{ display: 'none' }}
          />
        </div>

        <form onSubmit={handleSubmit} className={styles.profileForm} autoComplete="on">
          <div className={styles.formGroup}>
            <label>First Name</label>
            <input
              type="text"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              disabled={!isEditing}
            />
          </div>

          <div className={styles.formGroup}>
            <label>Last Name</label>
            <input
              type="text"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              disabled={!isEditing}
            />
          </div>

          <div className={styles.formGroup}>

            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              disabled={!isEditing}
              autoComplete="username"
            />
          </div>

          <div className={styles.formGroup}>
            <label>Bio</label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              disabled={!isEditing}
              rows="4"
            />
          </div>

          {isEditing && (
            <>
              <input
                type="text"
                name="fakeUsername"
                autoComplete="username"
                style={{ display: "none" }}
                value={formData.email}
                readOnly
                tabIndex={-1}
              />

              <div className={styles.formGroup}>
                <label>New Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Leave blank to keep current password"
                  autoComplete="new-password"
                />
              </div>

              <div className={styles.formGroup}>
                <label>Confirm New Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm new password"
                  autoComplete="new-password"
                />
              </div>

              <button type="submit" className={styles.saveButton}>
                Save Changes
              </button>
            </>
          )}
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
