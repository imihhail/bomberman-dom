import { useEffect, useState, useRef } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';

import { SendNewPost } from '../../connections/newPostConnection';
import { GetStatus } from '../../connections/statusConnection.js';

import styles from './NewPost.module.css';

const NewPost = ({ setAllPosts }) => {
  const [newPostOpen, setNewPostOpen] = useState(false);
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostPrivacy, setNewPostPrivacy] = useState('1');
  const newPostPicRef = useRef(null);

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

  const validateNewPostTitleInput = (e) => {
    setNewPostTitle(e.target.value);
  };

  const validateNewPostContentInput = (e) => {
    setNewPostContent(e.target.value);
  };

  const validateNewPostPrivacyInput = (e) => {
    setNewPostPrivacy(e.target.value);
  };

  const switchNewPostOpen = () => {
    setNewPostOpen(!newPostOpen);
    setInputErrorText('');
  };

  const submitNewPost = () => {
    if (newPostContent.length < 1 || newPostTitle.length < 1) {
      setInputError(true);
      setInputErrorText('Title or Content can not be empty!');
      return;
    }

    const fileInput = newPostPicRef.current;
    const file = fileInput?.files[0];
    if (file) {
      if (!(file.type.startsWith('image/') || file.type.endsWith('gif'))) {
        setAuthError('Avatar file must be a jpg or gif');
        console.error('Invalid file type. Please select an image or GIF.');
        return;
      }
    }

    const formData = new FormData();
    formData.append('title', newPostTitle);
    formData.append('content', newPostContent);
    formData.append('privacy', newPostPrivacy);
    formData.append('picture', file);

    SendNewPost(formData).then((data) => {
      sendJsonMessage({
        type: 'newPost',
        fromuserid: userId,
      });
      setAllPosts((prevPosts) => [data.SendnewPost, ...prevPosts]);
    });

    setNewPostTitle('');
    setNewPostContent('');
    setNewPostPrivacy('1');
    switchNewPostOpen();
  };

  return (
    <div className={styles.newPost}>
      {newPostOpen ? (
        <div className={styles.openNewPost}>
          <span>Title</span>
          <input type='text' id='title' onChange={validateNewPostTitleInput} />
          <span>Content</span>
          <input
            type='text'
            id='content'
            onChange={validateNewPostContentInput}
          />
          {inputError ? (
            <span className={styles.errorMsg}>{inputErrorText}</span>
          ) : (
            ''
          )}
          <div className={styles.privacySelection}>
            <div>
              <input
                type='radio'
                id='public'
                name='privacy'
                value='1'
                checked={newPostPrivacy === '1' || newPostPrivacy === '1'}
                onChange={validateNewPostPrivacyInput}
              />
              <span>Public</span>
            </div>
            <div>
              <input
                type='radio'
                id='private'
                name='privacy'
                value='2'
                checked={newPostPrivacy === '2'}
                onChange={validateNewPostPrivacyInput}
              />
              <span>Private</span>
            </div>
            <div>
              <input
                type='radio'
                id='almost_private'
                name='privacy'
                value='3'
                checked={newPostPrivacy === '3'}
                onChange={validateNewPostPrivacyInput}
              />
              <span>Almost Private</span>
            </div>
          </div>
          <span>Add Img/Gif</span>
          <label className={styles.pictureCountainer}>
            <input
              type='file'
              name='postPic'
              accept='.jpg, .jpeg, .gif'
              id='file'
              ref={newPostPicRef}
            />
          </label>
          {authError}
          <div className={styles.openNewPostOptions}>
            <span className={styles.openNewPostSubmit} onClick={submitNewPost}>
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
          New Post
        </span>
      )}
    </div>
  );
};

export default NewPost;
