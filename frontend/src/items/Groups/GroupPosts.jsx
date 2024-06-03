import { useState, useRef, useEffect } from 'react';
import { GetGroupPostComments } from '../../connections/getGroupPostComments';
import { SendNewGroupComment } from '../../connections/newGroupCommentConnection';
import { useOutletContext, Link } from 'react-router-dom';

import styles from './GroupPosts.module.css';

const backendUrl =
  import.meta.env.VITE_APP_BACKEND_PICTURE_URL || 'http://localhost:8080';

const GroupPosts = (props) => {
  const [showComments, setShowComments] = useState(false);
  const [groupPostComments, setGroupPostComments] = useState([]);
  const [selectedPost, setSelectedPost] = useState('');
  const [commentInput, setCommentInput] = useState('');
  const [inputError, setInputError] = useState(false);
  const [currentCommentId, setCurrentCommentId] = useState('');
  const [inputErrorText, setInputErrorText] = useState('');
  const newCommentPicRef = useRef(null);

  const [, logout, , , ,] = useOutletContext();

  useEffect(() => {
    setShowComments(false);
  }, [props.selectedGroup]);

  const handleGroupPostComment = (postId) => {
    setCurrentCommentId(postId);
    const formData = new FormData();
    formData.append('groupPostId', postId);
    GetGroupPostComments(formData).then((data) => {
      if (data?.server) {
        setInputError(true);
        setInputErrorText(data.error);
      } else if (data.login !== 'success') {
        logout();
      } else {
        setGroupPostComments(data.groupComments);
      }
    });
    setSelectedPost(postId);
    setShowComments(true);
  };

  const handleNewComment = () => {
    if (commentInput.length < 1) {
      setInputError(true);
      setInputErrorText('Comment can not be empty!');
      return;
    }

    const fileInput = newCommentPicRef.current;
    const file = fileInput?.files[0];
    if (file) {
      if (!(file.type.startsWith('image/') || file.type.endsWith('gif'))) {
        setInputError(true);
        setInputErrorText('Picture file must be a jpg or gif');
        return;
      }
    }
    const formData = new FormData();
    formData.append('content', commentInput);
    formData.append('picture', file);
    formData.append('group', props.selectedGroup.Id);
    formData.append('groupPost', selectedPost);
    SendNewGroupComment(formData).then((data) => {
      if (data?.server) {
        setInputError(true);
        setInputErrorText(data.error);
      } else if (data.login !== 'success') {
        logout();
      } else {
        handleGroupPostComment(currentCommentId);
      }
    });
    setCommentInput('');
    newCommentPicRef.current.value = null;
  };

  const handleCommentInput = (e) => {
    setCommentInput(e.target.value);
    setInputError(false);
    setInputErrorText('');
  };

  return (
    <div className={styles.postsOverlay}>
      {showComments && (
        <div className={styles.commentMenu}>
          <button
            className={styles.commentButton}
            onClick={() => setShowComments(false)}
          >
            Back
          </button>
          <button className={styles.commentButton} onClick={handleNewComment}>
            Add Comment
          </button>
          <div className={styles.commentInputs}>
            <input
              type='text'
              name='comment'
              value={commentInput}
              className={styles.commentInput}
              onChange={handleCommentInput}
            />
            <input
              type='file'
              name='postPic'
              accept='.jpg, .jpeg, .gif'
              id='file'
              className={styles.commentPic}
              ref={newCommentPicRef}
            />
          </div>
          {inputError ? inputErrorText : ''}
        </div>
      )}
      {!showComments ? (
        props.groupPosts.map((eachPost, index) => (
          <div className={styles.postContainer} key={index}>
            <div className={styles.post}>
              <div className={styles.topPart}>
                {eachPost.Avatar ? (
                  <Link to={`/profile/${eachPost.UserId}`}>
                    <img
                      className={styles.avatarImg}
                      src={`${backendUrl}/avatar/${eachPost.Avatar}`}
                      alt='Avatar'
                    />
                  </Link>
                ) : (
                  ''
                )}
                <div>
                  <p>
                    Published by{' '}
                    <Link
                      style={{ color: 'inherit', textDecoration: 'none' }}
                      to={`/profile/${eachPost.UserId}`}
                    >
                      {eachPost.Username !== ''
                        ? eachPost.Username
                        : eachPost.Email}
                    </Link>
                  </p>
                  <p>
                    at {new Date(eachPost.Date).toLocaleTimeString()} on{' '}
                    {new Intl.DateTimeFormat('en-GB').format(
                      new Date(eachPost.Date)
                    )}
                  </p>
                </div>
              </div>

              <div className={styles.mainContent}>
                <div className={styles.leftSide}></div>
                <div className={styles.rightSide}>
                  <p className={styles.title}>{eachPost.Title}</p>
                  {eachPost.Picture ? (
                    <img
                      className={styles.postsImg}
                      src={`${backendUrl}/avatar/${eachPost.Picture}`}
                      alt='PostPicure'
                    ></img>
                  ) : (
                    ''
                  )}
                  <p className={styles.content}>{eachPost.Content}</p>
                  <div
                    className={styles.commentsButton}
                    onClick={() => handleGroupPostComment(eachPost.PostID)}
                  >
                    View Comments
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))
      ) : groupPostComments ? (
        groupPostComments.map((comment, i) => (
          <div key={i} className={styles.commentContainer}>
            <p className={styles.commentContent}>{comment.Content}</p>
            {comment.Picture ? (
              <img
                className={styles.commentImg}
                src={`${backendUrl}/avatar/${comment.Picture}`}
                alt='CommentPicure'
              ></img>
            ) : (
              ''
            )}
          </div>
        ))
      ) : (
        <p>No comments yet!</p>
      )}

      <div
        onClick={() => props.newGroupPostHandler()}
        className={styles.newGroupPost}
      >
        New Group Post
      </div>
    </div>
  );
};

export default GroupPosts;
