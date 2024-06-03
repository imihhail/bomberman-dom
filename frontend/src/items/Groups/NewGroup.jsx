import { useEffect, useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';

import { SendNewGroup } from '../../connections/newGroupConnection.js';
import { GetStatus } from '../../connections/statusConnection.js';

import styles from './NewGroup.module.css';

const NewGroup = ({ setGroups, setSelectedGroup, Groupinfo, toggleNewGroup }) => {
  const [newPostOpen, setNewPostOpen] = useState(false);
  const [newGroupTitle, setNewGroupTitle] = useState('');
  const [newGroupDescription, setNewGroupDescription] = useState('');
  const [inputError, setInputError] = useState(true);
  const [inputErrorText, setInputErrorText] = useState('');

  const [, logout, , ,] = useOutletContext();

  const navigate = useNavigate();

  useEffect(() => {
    GetStatus().then((data) => {
      if (data?.server) {
        console.log(data.error);
      } else if (data.login !== 'success') {
        logout();
      }
    });
  }, [navigate]);

  const validateNewGroupTitleInput = (e) => setNewGroupTitle(e.target.value);
  const validateNewGroupDescriptionInput = (e) =>
    setNewGroupDescription(e.target.value);

  const switchNewPostOpen = () => {
    setNewPostOpen(!newPostOpen);
    toggleNewGroup()
    setInputErrorText('');
  };

  const createNewGroup = () => {
    if (newGroupDescription.length < 1 || newGroupTitle.length < 1) {
      setInputError(true);
      setInputErrorText('Title or description can not be empty!');
      return;
    }

    const formData = new FormData();
    formData.append('title', newGroupTitle);
    formData.append('description', newGroupDescription);

    //Send new group to server, then append new group to the current grouplist, then set selected group to new group.
    SendNewGroup(formData).then((data) => {
      setGroups((prevGroup) => [data.SendNewGroup, ...prevGroup]);
      setSelectedGroup(data.SendNewGroup);
      Groupinfo(data.SendNewGroup);
    });

    setNewGroupDescription('');
    switchNewPostOpen();
  };

  return (
    <div className={styles.newPost}>
      {newPostOpen ? (
        <div className={styles.openNewPost}>
          <span>Title</span>
          <input type='text' id='title' onChange={validateNewGroupTitleInput} />
          <span>Description</span>
          <input
            type='text'
            id='content'
            onChange={validateNewGroupDescriptionInput}
          />
          {inputError ? (
            <span className={styles.errorMsg}>{inputErrorText}</span>
          ) : (
            ''
          )}

          <div className={styles.openNewPostOptions}>
            <span className={styles.openNewPostSubmit} onClick={createNewGroup}>
              Submit
            </span>
            <span
              className={styles.openNewPostCancel}
              onClick={switchNewPostOpen}
            >
              Cancel
            </span>
          </div>
        </div>
      ) : (
        <span className={styles.closedNewPost} onClick={switchNewPostOpen}>
          Create Group
        </span>
      )}
    </div>
  );
};
export default NewGroup;
