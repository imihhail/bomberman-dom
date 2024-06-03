import { NavLink } from 'react-router-dom';

import styles from './Menu.module.css';

const backendUrl =
  import.meta.env.VITE_APP_BACKEND_PICTURE_URL || 'http://localhost:8080';

const Menu = (props) => {
  const activeClassName = ({ isActive, isPending }) =>
    [isPending ? styles.transition : '', isActive ? styles.active : ''].join(
      ' '
    ) +
    ' ' +
    styles.linkButton;

  const activeProfile = ({ isActive, isPending }) =>
    [isPending ? styles.transition : '', isActive ? styles.active : ''].join(
      ' '
    ) +
    ' ' +
    styles.linkButton;

  const activeNotificationClassName = ({ isActive, isPending }) =>
    [
      isPending ? styles.transition : '',
      isActive ? styles.active : '',
      props.glow ? styles.glowing : '',
    ].join(' ') +
    ' ' +
    styles.linkButton;
  return (
    <div className={styles.menu}>
      <NavLink
        to={`/notifications`}
        onClick={props.handleGlow}
        className={activeNotificationClassName}
      >
        Notifications
      </NavLink>
      <NavLink to={`/posts`} className={activeClassName}>
        Posts
      </NavLink>
      <NavLink to={`/groups`} className={activeClassName}>
        Groups
      </NavLink>
      <NavLink to={`/chat`} className={activeClassName}>
        Chat
      </NavLink>
      <NavLink to={`/profile/`} className={activeProfile}>
        <img
          src={`${backendUrl}/avatar/${props.userAvatar}`}
          alt='Profile picture'
        />
        <p className={styles.userName}>{props.userEmail}</p>
      </NavLink>
      <a onClick={props.onLogout} className={styles.linkButton}>
        Logout
      </a>
    </div>
  );
};

export default Menu;
