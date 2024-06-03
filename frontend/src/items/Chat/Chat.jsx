import { useState, useEffect, useRef } from 'react';
import { useOutletContext } from 'react-router-dom';

import { GetMessages } from '../../connections/messagesConnection';
import Message from './Message';
import ChatInput from './ChatInput';
import ChatUserlist from './ChatUserlist';

import styles from './Chat.module.css';

const Chat = () => {
  const [textMessage, setTextMessage] = useState('');
  const [textMessageError, setTextMessageError] = useState('');
  const [allUserMessages, setAllUserMessages] = useState([]);
  const [activeChatPartner, setActiveChatPartner] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const [wsConnectionOpen, setWsConnectionOpen] = useState(false);
  const [activeMessage, setActiveMessage] = useState([]);

  const [, , sendJsonMessage, lastMessage, readyState, activeSession] =
    useOutletContext();
  const chatContainerRef = useRef(null);

  useEffect(() => {
    if (lastMessage) {
      const messageData = JSON.parse(lastMessage.data);
      if (messageData.type == 'message') {
        if (activeChatPartner === messageData.fromuserid) {
          if (allUserMessages?.length > 0) {
            let messageObject = {
              Date: new Date() + 'Z',
              Message: messageData.message,
              MessageReceiver: messageData.touser,
              MessageSender: messageData.fromuserid,
            };
            setAllUserMessages([...allUserMessages, messageObject]);
            setTimeout(() => {
              chatContainerRef.current.scrollTop =
                chatContainerRef.current.scrollHeight;
            }, 100);
          } else {
            setAllUserMessages([messageData]);
          }
        } else {
          // set new message notification
          if (activeMessage?.length > 0) {
            setActiveMessage([messageData.fromuserid, ...activeMessage]);
          } else {
            setActiveMessage([messageData.fromuserid]);
          }
        }
      }
    }
  }, [lastMessage]);

  useEffect(() => {
    if (readyState === 1) {
      setWsConnectionOpen(true);
    } else {
      setWsConnectionOpen(false);
    }
  }, [readyState]);

  useEffect(() => {
    if (!activeSession) {
      setTextMessage('');
      setActiveChatPartner('');
      setCurrentUser('');
      setWsConnectionOpen(false);
    }
  }, [activeSession]);

  const handleEmojis = (emoj) => {
    setTextMessage((prevText) => prevText + emoj);
  };

  const handleText = (e) => {
    setTextMessage(e.target.value);
    if (e.target.value.length < 1) {
      setTextMessageError("Can't send empty messages!");
    } else {
      setTextMessageError('');
    }
  };

  const sendMessage = () => {
    // send to socket backend
    sendJsonMessage({
      type: 'message',
      fromuserid: currentUser,
      message: textMessage,
      touser: activeChatPartner,
    });

    let messageObject = {
      Date: new Date() + 'Z',
      Message: textMessage,
      MessageReceiver: activeChatPartner,
      MessageSender: currentUser,
      LoggedInUser: true,
    };
    // set new message in the array
    if (allUserMessages?.length > 0) {
      setAllUserMessages([...allUserMessages, messageObject]);
      setTimeout(() => {
        chatContainerRef.current.scrollTop =
          chatContainerRef.current.scrollHeight;
      }, 100);
    } else {
      setAllUserMessages([messageObject]);
    }
    setTimeout(() => {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }, 100);
    // clear message box
    setTextMessage('');
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      sendMessage();
    }
  };

  const setPartnerGetMessages = (id) => {
    setActiveChatPartner(id);
    // fetch messages and set
    const formData = new FormData();
    formData.append('partner', id);
    GetMessages(formData).then((data) => {
      if (data?.server) {
        console.log(data);
        setTextMessageError(data.error);
      } else {
        setAllUserMessages(data.messages);
        setTimeout(() => {
          chatContainerRef.current.scrollTop =
            chatContainerRef.current.scrollHeight;
        }, 100);
      }
    });
  };

  const handleUserClick = (userId) => {
    setPartnerGetMessages(userId);
    if (activeMessage.includes(userId)) {
      const listUpdate = activeMessage.filter(
        (eachMember) => eachMember !== userId
      );
      setActiveMessage(listUpdate);
    }
  };

  return (
    <div className={styles.container}>
      <ChatUserlist
        setCurrentUser={setCurrentUser}
        setPartnerGetMessages={setPartnerGetMessages}
        handleUserClick={handleUserClick}
        activeChatPartner={activeChatPartner}
        activeMessage={activeMessage}
      />
      <div className={styles.chatContainer}>
        <div ref={chatContainerRef} className={styles.chat}>
          {allUserMessages?.map((eachMessage, key) => (
            <Message messageData={eachMessage} key={key} />
          ))}
        </div>
        {wsConnectionOpen ? (
          <ChatInput
            textMessage={textMessage}
            handleText={handleText}
            handleEmojis={handleEmojis}
            handleKeyPress={handleKeyPress}
            sendMessage={sendMessage}
            textMessageError={textMessageError}
          />
        ) : textMessageError ? (
          <p className={styles.chatConnection}>{textMessageError}</p>
        ) : (
          <p className={styles.chatConnection}>Connecting to Chat!</p>
        )}
      </div>
    </div>
  );
};

export default Chat;
