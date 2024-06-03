
import styles from './Message.module.css';
import { Link } from 'react-router-dom';

const backendUrl =
  import.meta.env.VITE_APP_BACKEND_PICTURE_URL || 'http://localhost:8080';

const Message = (props) => {
    const messageDate = new Date(props.messageData.Date.slice(0, -1));
    const messageDateString = `${messageDate.getHours()}:${messageDate.getMinutes()}:${messageDate.getSeconds()} ${messageDate.getDate()}-${
      messageDate.getMonth() + 1
    }-${messageDate.getFullYear()}`;
  return (
    <div className={`${styles.tabChatRow}`}>
      {props.messageData.LoggedInUser ? (
        <>
          <div className={styles.tabChatProfileContentMirrored} title={messageDateString}>
            <div className={styles.textContent} >
              {props.messageData.Message}
            </div>
          </div>
        </>
      ) : (
        <>
          <div className={styles.tabChatProfileContent}>
            <div className={styles.leftProfile}>
              {props.messageData.SenderAvatar ? (
                <Link to={`/profile/${props.messageData.SenderAvatar}`}>
                  <img
                    className={styles.avatarImg}
                    src={`${backendUrl}/avatar/${props.messageData.SenderAvatar}`}
                    alt='Avatar'
                  />
                </Link>
              ) : (
                ''
              )}
            </div>
            <div className={styles.textContentMirrored} title={messageDateString}>
              {props.messageData.Message}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Message