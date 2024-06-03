import { useState, useEffect } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';

import { GetNotifications } from '../../connections/getNotificationsConnection';
import { SendNotificationResponse } from '../../connections/notificationResponseConnection';

import styles from './Notifications.module.css';

const Notifications = () => {
  const [modal, logout, , lastMessage, ,] = useOutletContext();
  const [groupInvNotify, setGroupInvNotify] = useState([]);
  const [groupReqNotify, setGroupReqNotify] = useState([]);
  const [eventNotify, setEventNotify] = useState([]);
  const [followNotify, setFollowNotify] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    modal(true);
    GetNotifications().then((data) => {
      if (data) {
        if (data.login === 'success') {
          data.groupInvNotifications == null
            ? setGroupInvNotify([])
            : setGroupInvNotify(data.groupInvNotifications);
          data.eventNotifications == null
            ? setEventNotify([])
            : setEventNotify(data.eventNotifications);
          data.groupRequests == null
            ? setGroupReqNotify([])
            : setGroupReqNotify(data.groupRequests);
          data.followRequests == null
            ? setFollowNotify([])
            : setFollowNotify(data.followRequests);
          modal(false);
        } else {
          logout();
        }
      }
    });
  }, [navigate, modal]);

  // Update new live notfication with websocket
  useEffect(() => {
    if (lastMessage) {
      const messageData = JSON.parse(lastMessage.data);
      if (messageData.type === 'groupInvitation') {
        setGroupInvNotify((prevNotifications) => [
          ...prevNotifications,
          messageData,
        ]);
      }
      if (messageData.type === 'groupRequest') {
        setGroupReqNotify((prevNotifications) => [
          ...prevNotifications,
          messageData,
        ]);
      }
      if (messageData.type === 'event') {
        setEventNotify((prevNotifications) => [
          ...prevNotifications,
          messageData,
        ]);
      }
      if (messageData.type === 'followUser') {
        setFollowNotify((prevNotifications) => [
          ...prevNotifications,
          messageData,
        ]);
      }
    }
  }, [lastMessage]);

  // Update databases after user accepts/declines notification
  const invitationResponse = (notification, index, e, type) => {
    type == 'groupInvitation' &&
      setGroupInvNotify((prevNotifications) =>
        prevNotifications.filter((_, i) => i !== index)
      );
    type == 'event' &&
      setEventNotify((prevNotifications) =>
        prevNotifications.filter((_, i) => i !== index)
      );
    type == 'groupRequest' &&
      setGroupReqNotify((prevNotifications) =>
        prevNotifications.filter((_, i) => i !== index)
      );
    type == 'followUser' &&
      setFollowNotify((prevNotifications) =>
        prevNotifications.filter((_, i) => i !== index)
      );

    let fromUser = notification.fromuserid;
    if (fromUser === '' || fromUser === undefined) {
      fromUser = notification.fromuserId;
    }

    const formData = {
      decision: e.target.value,
      type: type,
      GroupId: notification.GroupId,
      EventId: notification.EventId,
      NotificationId: notification.NotificationId,
      fromuserid: fromUser,
    };
    SendNotificationResponse(formData);
  };

  return (
    <div className={styles.groupContainer}>
      {/* <div className={styles.dropdown}> */}
      {/* <div id='grInv' className={styles.listButton}>
        Group invitations
        {groupInvNotify.length > 0 ? groupInvNotify.length : ''}
      </div> */}
      {groupInvNotify.length > 0 && (
        <div id='grInv' className={styles.groupInvList}>
          {groupInvNotify.map((notification, index) => (
            <div className={styles.notifyBox} key={index}>
              <div>
                {notification.SenderEmail} Has invited you to Group named:{' '}
                {notification.message}
              </div>

              <button
                className={styles.accept}
                value={'accept'}
                onClick={(e) => {
                  invitationResponse(notification, index, e, 'groupInvitation');
                }}
              >
                Accept
              </button>
              <button
                className={styles.decline}
                value={'decline'}
                onClick={(e) => {
                  invitationResponse(notification, index, e, 'groupInvitation');
                }}
              >
                Decline
              </button>
            </div>
          ))}
        </div>
      )}
      {eventNotify.length > 0 && (
        <div id='event' className={styles.groupInvList}>
          {eventNotify.map((notification, index) => {
            const messageDate = new Date(notification.EventTime.slice(0, -1));
            const messageDateString = `${messageDate.getHours()}:${messageDate.getMinutes()}:${messageDate.getSeconds()} ${messageDate.getDate()}-${
              messageDate.getMonth() + 1
            }-${messageDate.getFullYear()}`;
            return (
              <div className={styles.notifyBox} key={index}>
                <div className={styles.eventInfo}>
                  <p>
                    {notification.SenderEmail} Has invited you to an{' '}
                    {notification.EventTitle} event on {messageDateString}
                  </p>
                </div>
                <button
                  className={styles.accept}
                  value={'accept'}
                  onClick={(e) => {
                    invitationResponse(notification, index, e, 'event');
                  }}
                >
                  Going
                </button>
                <button
                  className={styles.decline}
                  value={'decline'}
                  onClick={(e) => {
                    invitationResponse(notification, index, e, 'event');
                  }}
                >
                  Not going
                </button>
              </div>
            );
          })}
        </div>
      )}
      {groupReqNotify.length > 0 && (
        <div id='grReq' className={styles.groupInvList}>
          {groupReqNotify.map((notification, index) => (
            <div className={styles.notifyBox} key={index}>
              <p>Group name: {notification.message}</p>
              <p>Request Sender: {notification.SenderEmail}</p>

              <button
                className={styles.accept}
                value={'accept'}
                onClick={(e) => {
                  invitationResponse(notification, index, e, 'groupRequest');
                }}
              >
                Accept
              </button>
              <button
                className={styles.decline}
                value={'decline'}
                onClick={(e) => {
                  invitationResponse(notification, index, e, 'groupRequest');
                }}
              >
                Decline
              </button>
            </div>
          ))}
        </div>
      )}
      {followNotify.length > 0 && (
        <div id='follow' className={styles.groupInvList}>
          {followNotify.map((notification, index) => (
            <div className={styles.notifyBox} key={index}>
              <p>
                {notification.SenderEmail} Has asked if he/she can follow you?
              </p>

              <button
                className={styles.accept}
                value={'accept'}
                onClick={(e) => {
                  invitationResponse(notification, index, e, 'followUser');
                }}
              >
                Accept
              </button>
              <button
                className={styles.decline}
                value={'decline'}
                onClick={(e) => {
                  invitationResponse(notification, index, e, 'followUser');
                }}
              >
                Decline
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notifications;
