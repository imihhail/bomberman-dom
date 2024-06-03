import { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { GetUserList } from '../../connections/userListConnection';
import styles from './ChatUserlist.module.css';

const ChatUserlist = (props) => {
  const [userList, setUserList] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [modal, logout, , lastMessage, , activeSession] = useOutletContext();

  useEffect(() => {
    if (!activeSession) {
      setUserList([]);
    }
  }, [activeSession]);

  useEffect(() => {
    if (lastMessage) {
      const messageData = JSON.parse(lastMessage.data);
      if (messageData.type == 'onlineStatus') {
        setOnlineUsers(messageData.connectedclients);
      }
    }
  }, [lastMessage]);

  useEffect(() => {
    GetUserList().then((data) => {
      if (data) {
        if (data.login === 'success') {
          // set messages
          setUserList(data.userList || []);
          if (data?.userList?.length > 0) {
            // set defaul chat partner and their messages on load
            props.setPartnerGetMessages(data.userList[0].Id);
          }
          // set current user
          props.setCurrentUser(data.activeUser);
          modal(false);
        } else {
          logout();
        }
      }
    });
  }, [modal]);

  return (
    <div className={styles.users}>
      {userList.map((each, key) => (
        <p
          key={key}
          className={
            (onlineUsers.includes(each.Id) ? styles.onlineUser : '') +
            ' ' +
            (each.Id === props.activeChatPartner
              ? styles.activePartner
              : props.activeMessage.includes(each.Id)
              ? styles.newMessage
              : styles.chatuser)
          }
          onClick={() => props.handleUserClick(each.Id)}
        >
          {each.Email}
          {onlineUsers.includes(each.Id) ? (
            <button onClick={props.handleChallenge}>Challenge</button>
          ) : (
            ''
          )}
        </p>
      ))}
    </div>
  );
};

export default ChatUserlist;
