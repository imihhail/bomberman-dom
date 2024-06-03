import { useEffect, useState } from 'react';
import {
  useOutletContext,
  useLocation,
  Link,
  useNavigate,
} from 'react-router-dom';

const backendUrl =
  import.meta.env.VITE_APP_BACKEND_PICTURE_URL || 'http://localhost:8080';

import { GetProfile } from '../../connections/profileConnection.js';
import { SendNewPrivacy } from '../../connections/newPrivacyConnection.js';
// import { GetAllComments } from '../../connections/commentsConnection.js';
// import NewComment from '../Comments/NewComment.jsx';

import styles from './Profile.module.css';

const Profile = () => {
  const [userProfile, setUserProfile] = useState('');
  const [following, setFollowing] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [privacy, setPrivacy] = useState('');
  const [privacyButton, setPrivacyButton] = useState('');
  const [modal, logout, sendJsonMessage] = useOutletContext();
  const location = useLocation();
  const [ownProfile, setOwnProfile] = useState(false);
  const [alreadyFollowing, setAlreadyFollowing] = useState(false);
  const currentUser = location.pathname.substring(9);
  const navigate = useNavigate();

  useEffect(() => {
    modal(true);

    const formData = new FormData();
    formData.append('userId', currentUser);

    GetProfile(formData).then((data) => {
      if (data.login === 'success') {
        if (data.ownProfile && currentUser.length > 0) {
          navigate('/profile', { replace: true });
        }
        // profile info
        setUserProfile(data.profile);
        setFollowing(data.following);
        setFollowers(data.followers);
        setOwnProfile(data.ownProfile);
        setAlreadyFollowing(data.alreadyFollowing);
        // profile related posts
        setPosts(data.posts);
        if (currentUser.length === 0) {
          setPrivacy(data.profile.Privacy);
          setPrivacyButton('1');
        } else {
          setPrivacyButton('2');
        }
        modal(false);
      } else {
        logout();
      }
    });
  }, [modal, currentUser]);
  // Privacy settings change
  const handlePrivacyChange = () => {
    let newPrivacy = privacy === '1' ? '2' : '1';
    setPrivacy(newPrivacy);
    if (newPrivacy !== '1' && newPrivacy !== '2') {
      return;
    }
    const formData = new FormData();
    formData.append('privacy', newPrivacy);
    SendNewPrivacy(formData).then((data) => setPrivacy(data.SendNewPrivacy));
  };

  const followUser = (followUserId, e) => {
    sendJsonMessage({
      type: 'followUser',
      touser: followUserId,
    });
    const formData = new FormData();
    formData.append('userId', currentUser);

    GetProfile(formData).then((data) => {
      console.log("follow: ", data);
      if (data.login === 'success') {
        setFollowers(data.followers);
        setFollowing(data.following);
        setAlreadyFollowing(data.alreadyFollowing);
        setUserProfile(data.profile);
        setPosts(data.posts);
      }
    });
    if (userProfile.Privacy === '-1') {
      e.target.style.opacity = '0.4'; // rändom stiil et näha kas toimib
      e.target.style.cursor = 'default';
    }
  };

  const unfollowUser = (userId) => {
    const formData = new FormData();
    formData.append('userId', currentUser);
    formData.append('unFollowId', userId);

    GetProfile(formData).then((data) => {
      if (data.login === 'success') {
        setFollowers(data.followers);
        setFollowing(data.following);
        setAlreadyFollowing(data.alreadyFollowing);
        setUserProfile(data.profile);
        setPosts(data.posts);
        setPrivacy('-1'); // Is this ok??
      }
    });
  };
  return (
    <div className={styles.profileContainer}>
      <div className={styles.profileInfo}>
        <div className={styles.avatar}>
          {userProfile.Avatar ? (
            <img
              className={styles.avatarImg}
              src={`${backendUrl}/avatar/${userProfile.Avatar}`}
              alt='Avatar'
            ></img>
          ) : (
            ''
          )}
        </div>
        <div className={styles.profile}>
          <span>Email: </span>
          {userProfile.Email}
          {userProfile && userProfile.Privacy === '-1' && !alreadyFollowing ? (
            <p>This user is private, please send a follow request</p>
          ) : (
            <>
              <span>Id: </span>
              {userProfile.Id}
              <span>First Name: </span>
              {userProfile.FirstName}
              <span>Last Name: </span>
              {userProfile.LastName}
              <span>Username: </span>
              {userProfile.Username}
              <span>Date of Birth: </span>
              {new Date(userProfile.DateOfBirth).toDateString()}
              {/* Privacy settings */}
              {privacyButton === '1' && (
                <div>
                  <span>Privacy mode: </span>
                  <div className={styles.toggleSwitch}>
                    <input
                      type='checkbox'
                      id='toggle'
                      className={styles.toggleSwitchCheckbox}
                      checked={privacy === '2'}
                      onChange={handlePrivacyChange}
                    />
                    <label
                      className={styles.toggleSwitchLabel}
                      htmlFor='toggle'
                    >
                      <span className={styles.toggleSwitchInner} />
                      <span className={styles.toggleSwitchSwitch} />
                      <span
                        className={
                          privacy === '2'
                            ? styles.toggleSwitchTextOn
                            : styles.toggleSwitchTextOff
                        }
                      >
                        {privacy === '2' ? 'ON' : 'OFF'}
                      </span>
                    </label>
                  </div>
                </div>
              )}
              {/* Logged in user's followers and following*/}
              <div className={styles.follow}>
                <div className={styles.following}>
                  <h2>Following</h2>
                  {following ? (
                    <div>
                      <ul className={styles.noBullets}>
                        {following.map((user, index) => (
                          <li key={index}>
                            <Link
                              className={styles.noLinks}
                              to={`/profile/${user.fromuserId}`}
                            >
                              {user.SenderEmail}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <p>No users are being followed.</p>
                  )}
                </div>
                <div className={styles.followers}>
                  <h2>Followers</h2>
                  {followers ? (
                    <div>
                      <ul className={styles.noBullets}>
                        {followers.map((user, index) => (
                          <li key={index}>
                            <Link
                              className={styles.noLinks}
                              to={`/profile/${user.fromuserId}`}
                            >
                              {user.SenderEmail}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <p>No followers found.</p>
                  )}
                </div>
              </div>
            </>
          )}
          {ownProfile ? null : alreadyFollowing ? (
            <button onClick={(e) => unfollowUser(currentUser, e)}>
              Unfollow
            </button>
          ) : (
            <button onClick={(e) => followUser(currentUser, e)}>Follow</button>
          )}
        </div>
      </div>
      {/* Logged in user's posts */}
      <div className={styles.postsOverlay}>
        {/* {displayComments ? (
          <NewComment setAllPosts={setAllPosts} />
        ) : (
          <NewPost setAllPosts={setAllPosts} />
        )} */}
        {posts && posts.length > 0 ? (
          posts.map((eachPost, index) => (
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
                      Published at{' '}
                      {new Date(eachPost.Date).toLocaleTimeString()} on{' '}
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
                    {/* {!displayComments ?<div
                        className={styles.commentsButton}
                        onClick={() =>
                          ShowComments(
                            eachPost,
                            setAllPosts,
                            setDisplayComments,
                            setDisplayTitle
                          )
                        }
                      >
                        View Comments
                      </div> : ""} */}
                    <div
                      className={styles.commentsButton}
                      // onClick={() => handleGroupPostComment(eachPost.PostID)}
                    >
                      View Comments
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No posts to show.</p>
        )}
        {/* {displayComments ? (
          <button onClick={showPosts}>RETURN TO POSTS</button>
        ) : (
          ''
        )} */}
      </div>
    </div>
  );
};

export default Profile;
