import { useState, useEffect, useRef } from 'react';
import 'emoji-picker-element';
import { useOutletContext, Link } from 'react-router-dom';

const backendUrl =
  import.meta.env.VITE_APP_BACKEND_PICTURE_URL || 'http://localhost:8080';

import { GetGroupMessages } from '../../connections/getGroupMessagesConnection';

import styles from './GroupChat.module.css';

const GroupChat = (props) => {
  const [groupChat, setGroupChat] = useState([]);
  const [groupChatInput, setGroupChatInput] = useState('');
  const [textMessageError, setTextMessageError] = useState('');
  const [wsConnectionOpen, setWsConnectionOpen] = useState(false);
  const chatContainerRef = useRef(null);
  const grouppickerRef = useRef(null);

  const [, , sendJsonMessage, lastMessage, readyState] = useOutletContext();

  const handleEmojiSelect = (event) => {
    const emoji = event.detail.unicode;
    setGroupChatInput((prev) => prev + emoji);
    togglePicker();
  };

  const togglePicker = () => {
    if (grouppickerRef.current.style.display === 'none') {
      grouppickerRef.current.style.display = 'block';
    } else {
      grouppickerRef.current.style.display = 'none';
    }
  };

  useEffect(() => {
    if (readyState === 1) {
      setWsConnectionOpen(true);
    } else {
      setWsConnectionOpen(false);
    }
  }, [readyState]);

  useEffect(() => {
    if (lastMessage) {
      const messageData = JSON.parse(lastMessage.data);
      if (messageData.type == 'groupMessage') {
        if (props.selectedGroup.Id === messageData.GroupId) {
          if (groupChat?.length > 0) {
            let messageObject = {
              Date: new Date() + 'Z',
              GroupChatMessage: messageData.message,
              GroupId: messageData.touser,
              GroupChatMessageSender: messageData.fromuserid,
            };
            setGroupChat([...groupChat, messageObject]);
            setTimeout(() => {
              chatContainerRef.current.scrollTop =
                chatContainerRef.current.scrollHeight;
            }, 100);
          } else {
            setGroupChat([messageData]);
          }
        }
      }
    }
  }, [lastMessage]);

  useEffect(() => {
    const formData = new FormData();
    formData.append('groupId', props.selectedGroup.Id);
    GetGroupMessages(formData).then((data) => {
      if (data?.server) {
        setTextMessageError(data.error);
      } else {
        setGroupChat(data.groupMessages);
        setTextMessageError('');
      }
    });
  }, [props.selectedGroup]);

  useEffect(() => {
    const groupPicker = grouppickerRef.current;
    if (groupPicker) {
      groupPicker.addEventListener('emoji-click', handleEmojiSelect);
    }
    return () => {
      if (groupPicker) {
        groupPicker.removeEventListener('emoji-click', handleEmojiSelect);
      }
    };
  }, [wsConnectionOpen]);

  const handleChatInput = (e) => {
    setGroupChatInput(e.target.value);
    if (e.target.value < 1) {
      setTextMessageError('Please enter some text!');
    } else {
      setTextMessageError('');
    }
  };

  const sendGroupMessage = () => {
    sendJsonMessage({
      type: 'groupMessage',
      GroupId: props.selectedGroup.Id,
      fromuserid: props.currentUser,
      message: groupChatInput,
    });
    let messageObject = {
      Date: new Date() + 'Z',
      GroupId: props.selectedGroup.Id,
      GroupChatMessageSender: props.currentUser,
      GroupChatMessage: groupChatInput,
      LoggedInUser: true,
    };

    if (groupChat?.length > 0) {
      setGroupChat([...groupChat, messageObject]);
      setTimeout(() => {
        chatContainerRef.current.scrollTop =
          chatContainerRef.current.scrollHeight;
      }, 100);
    } else {
      setGroupChat([messageObject]);
    }
    setTimeout(() => {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }, 100);

    setGroupChatInput('');
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      if (groupChatInput.length < 1) {
        setTextMessageError("Can't send empty messages!");
      } else {
        sendGroupMessage();
        setTextMessageError('');
      }
    }
  };
  return (
    <div className={styles.groupChat}>
      <div ref={chatContainerRef} className={styles.groupChatBox}>
        {groupChat?.map((item, i) => (
          <div key={i} className={`${styles.groupChatRow}`}>
            {item.LoggedInUser ? (
              <>
                <div className={styles.groupChatProfileContentMirrored}>
                  <div className={styles.textContent}>
                    {item.GroupChatMessage}
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className={styles.groupChatEmail}>
                  <Link
                    className={styles.noLinks}
                    to={`/profile/${item.GroupChatMessageSender}`}
                  >
                    {item.SenderEmail}
                  </Link>
                </div>
                <div className={styles.groupChatProfileContent}>
                  <div className={styles.leftProfile}>
                    {item.SenderAvatar ? (
                      <Link to={`/profile/${item.GroupChatMessageSender}`}>
                        <img
                          className={styles.avatarImg}
                          src={`${backendUrl}/avatar/${item.SenderAvatar}`}
                          alt='Avatar'
                        />
                      </Link>
                    ) : (
                      ''
                    )}
                  </div>
                  <div className={styles.textContentMirrored}>
                    {item.GroupChatMessage}
                  </div>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
      {wsConnectionOpen ? (
        <div className={styles.groupChatInputContainer}>
          <input
            type='text'
            value={groupChatInput}
            onChange={handleChatInput}
            className={styles.groupChatInput}
            name='textMessage'
            placeholder={textMessageError}
            id=''
            onKeyDown={handleKeyPress}
          />
          <button onClick={togglePicker}>😀</button>
          <emoji-picker
            ref={grouppickerRef}
            style={{
              display: 'none',
              position: 'absolute',
              right: '25rem',
              bottom: '5.5rem',
            }}
            // onEmojiClick={handleEmojiSelect}
          ></emoji-picker>
          <button
            className={styles.chatInputSubmit}
            type='submit'
            onClick={sendGroupMessage}
            disabled={groupChatInput.length < 1 ? true : false}
          >
            Send
          </button>
        </div>
      ) : (
        textMessageError
      )}
    </div>
  );
};

export default GroupChat;
