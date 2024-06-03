import { useEffect, useState, useRef } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';

import { SendNewGroupPost } from '../../connections/newGroupPostConnection';
import { GetStatus } from '../../connections/statusConnection.js';

import styles from './NewGroupPost.module.css';

const NewGroupPost = (props) => {
  // const [newGroupPostOpen, setNewGroupPostOpen] = useState(true);
  const [newGroupPostTitle, setNewGroupPostTitle] = useState('');
  const [newGroupPostContent, setNewGroupPostContent] = useState('');
  const newGroupPostPicRef = useRef(null);

  const [authError, setAuthError] = useState('');
  const [inputError, setInputError] = useState(true);
  const [userId, setUserId] = useState('');
  const [inputErrorText, setInputErrorText] = useState('');
  const [, logout, sendJsonMessage] = useOutletContext();

  const navigate = useNavigate();

  useEffect(() => {
    GetStatus().then((data) => {
      if (data?.server) {
        setInputError(true);
        setInputErrorText(data.error);
      } else if (data.login == 'success') {
        setUserId(data['userid']);
      } else {
        logout();
      }
    });
  }, [navigate]);

  const validateNewGroupPostTitleInput = (e) => {
    setNewGroupPostTitle(e.target.value);
  };

  const validateNewGroupPostContentInput = (e) => {
    setNewGroupPostContent(e.target.value);
  };

  const switchNewGroupPostOpen = () => {
    // setNewGroupPostOpen(!newGroupPostOpen);
    props.newGroupPostHandler();
    setInputErrorText('');
  };

  const submitNewGroupPost = () => {
    if (newGroupPostContent.length < 1 || newGroupPostTitle.length < 1) {
      setInputError(true);
      setInputErrorText('Title or Content can not be empty!');
      return;
    }

    const fileInput = newGroupPostPicRef.current;
    const file = fileInput?.files[0];
    if (file) {
      if (!(file.type.startsWith('image/') || file.type.endsWith('gif'))) {
        setAuthError('Avatar file must be a jpg or gif');
        console.error('Invalid file type. Please select an image or GIF.');
        return;
      }
    }

    const formData = new FormData();
    formData.append('title', newGroupPostTitle);
    formData.append('content', newGroupPostContent);
    formData.append('group', props.selectedGroup.Id);
    formData.append('picture', file);

    SendNewGroupPost(formData).then(() => {
      sendJsonMessage({
        type: 'newGroupPost',
        fromuserid: userId,
        GroupId: props.selectedGroup.Id,
      });
      props.newGroupPostHandler();
    });

    setNewGroupPostTitle('');
    setNewGroupPostContent('');
    switchNewGroupPostOpen();
  };

  return (
    <div className={styles.newGroupPost}>
      <span>Title</span>
      <input
        type='text'
        id='title'
        onChange={validateNewGroupPostTitleInput}
        value={newGroupPostTitle}
      />
      <span>Content</span>
      <input
        type='text'
        id='content'
        onChange={validateNewGroupPostContentInput}
        value={newGroupPostContent}
      />
      {inputError ? (
        <span className={styles.errorMsg}>{inputErrorText}</span>
      ) : (
        ''
      )}
      <label className={styles.pictureCountainer}>
        <input
          type='file'
          name='postPic'
          accept='.jpg, .jpeg, .gif'
          id='file'
          ref={newGroupPostPicRef}
        />
      </label>
      {authError}
      <div className={styles.openNewPostOptions}>
        <span className={styles.openNewPostSubmit} onClick={submitNewGroupPost}>
          Submit
        </span>
        <span
          className={styles.openNewPostCancel}
          onClick={props.newGroupPostHandler}
        >
          Cancel
        </span>
      </div>
    </div>
  );
};

export default NewGroupPost;
