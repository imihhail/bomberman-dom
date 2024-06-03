import { useEffect, useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';

import { GetAllGroups } from '../../connections/groupsConnection.js';
import { GetGroupContent } from '../../connections/groupContentConnection.js';
import { GetUserList } from '../../connections/userListConnection.js';

import NewGroup from './NewGroup.jsx';
import NewEvent from './NewEvent.jsx';
import GroupChat from './GroupChat.jsx';
import GroupPosts from './GroupPosts.jsx';
import NewGroupPost from './NewGroupPost.jsx';

import styles from './Groups.module.css';

const Groups = () => {
  const [modal, logout, sendJsonMessage, ,] = useOutletContext();
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [notGroupMembers, setNotGroupMembers] = useState([]);
  const [groupMembers, setGroupMembers] = useState([]);
  const [events, setEvents] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [currentUserEmail, setCurrentUserEmail] = useState(null);
  const [invatationSent, setInvatationSent] = useState(false);
  const [isGroupMember, setIsGroupMember] = useState(false);
  const [newGroupPostOpen, setNewGroupPostOpen] = useState(false);
  const [groupPosts, setGroupPosts] = useState([]);
  const [showNewGroup, setShowNewGroup] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    modal(true);
    GetAllGroups().then((data) => {
      if (data?.server) {
        console.log(data.error);
      } else if (data.login === 'success') {
        data.groups == null ? setGroups([]) : setGroups(data.groups);
        setCurrentUserEmail(data.currentUserEmail);
        if (data?.groups?.length > 0) {
          setSelectedGroup(data.groups[0]);
          Groupinfo(data.groups[0]);
        }
        GetUserList().then((data) => {
          setCurrentUser(data.activeUser);
          setNotGroupMembers(data.userList);
        });
        modal(false);
      } else {
        logout();
      }
    });
  }, [navigate, modal]);

  const SendGroupRequest = (groupCreator, title, groupId) => {
    sendJsonMessage({
      type: 'groupRequest',
      fromuserid: currentUser,
      message: title,
      GroupId: groupId,
      touser: groupCreator,
      SenderEmail: currentUserEmail,
    });
  };

  const SendGroupInvite = (reciever, title, groupId) => {
    sendJsonMessage({
      type: 'groupInvitation',
      fromuserid: currentUser,
      message: title,
      GroupId: groupId,
      touser: reciever,
    });
    setInvatationSent(true);
    setTimeout(() => {
      setInvatationSent(false);
    }, 2000);
  };

  const Groupinfo = (group) => {
    setSelectedGroup(group);

    const formData = new FormData();
    formData.append('GroupId', group.Id);

    GetGroupContent(formData).then((data) => {
      setGroupMembers(data.groupMembers);
      setEvents(data.events);
      data.isGroupMember == false
        ? setIsGroupMember(false)
        : setIsGroupMember(true);
      data.posts == null ? setGroupPosts([]) : setGroupPosts(data.posts);
    });
  };

  const newGroupPostHandler = () => {
    setNewGroupPostOpen(!newGroupPostOpen);
    Groupinfo(selectedGroup);
  };

  const toggleNewGroup = () => {
    setShowNewGroup(!showNewGroup);
  };

  return (
    <div className={styles.groupContainer}>
      <NewGroup
        setGroups={setGroups}
        setSelectedGroup={setSelectedGroup}
        Groupinfo={Groupinfo}
        toggleNewGroup={toggleNewGroup}
      />
      {!showNewGroup && isGroupMember && (
        <NewEvent
          groupId={selectedGroup && selectedGroup.Id}
          currentUser={currentUser}
          groupTitle={selectedGroup && selectedGroup.Title}
          setEvents={setEvents}
          setGroupMembers={setGroupMembers}
        />
      )}
      {!showNewGroup && newGroupPostOpen ? (
        <NewGroupPost
          newGroupPostHandler={newGroupPostHandler}
          selectedGroup={selectedGroup}
          setGroupPosts={setGroupPosts}
          Groupinfo={Groupinfo}
        />
      ) : groups.length > 0 ? (
        <div className={styles.groupList}>
          <h3>All Groups</h3>
          {groups.map((group) => (
            <p
              className={
                group === selectedGroup
                  ? styles.groupNameSelected
                  : styles.groupName
              }
              key={group.Id}
              onClick={() => Groupinfo(group)}
            >
              {group.Title}
            </p>
          ))}
        </div>
      ) : (
        ''
      )}
      {!showNewGroup && selectedGroup && !newGroupPostOpen && (
        <div className={styles.groupInfo}>
          <div className={styles.currentGroup}>
            <div className={styles.selectedGroupInfo}>
              <h1>{selectedGroup.Title}</h1>
              <h2>Description: {selectedGroup.Description}</h2>
              <h3>Created by: {selectedGroup.Creator}</h3>
              <div className={styles.groupMembers}>
                <p>Group Members:</p>
                {groupMembers &&
                  groupMembers.map((member) => (
                    <p key={member.Id}>{member.Email}</p>
                  ))}
              </div>
            </div>
            <h4>Group events:</h4>
            <div className={styles.groupEvents}>
              {events &&
                events.map((event) => {
                  const messageDate = new Date(event.EventTime.slice(0, -1));
                  const messageDateString = `${messageDate.getDate()}/${
                    messageDate.getMonth() + 1
                  }/${messageDate.getFullYear()} ${messageDate.getHours()}:${messageDate.getMinutes()}`;
                  return (
                    <div key={event.EventId} className={styles.eventInfo}>
                      <h4>{event.EventTitle}</h4>
                      <p>{event.EventDescription}</p>
                      <p>Creator: {event.CreatorEmail}</p>
                      <p>{messageDateString}</p>
                      <br></br>
                      <p>Participants:</p>
                      {event.Participants.map((participant) => (
                        <p key={participant.ParticipantId}>
                          {participant.ParticipantEmail}
                        </p>
                      ))}
                    </div>
                  );
                })}
            </div>
          </div>
          {isGroupMember && (
            <select
              className={styles.userDopDownMenu}
              value=''
              onChange={(e) =>
                SendGroupInvite(
                  e.target.value,
                  selectedGroup.Title,
                  selectedGroup.Id
                )
              }
            >
              <option value='' disabled>
                Invite user
              </option>
              {notGroupMembers &&
                notGroupMembers.map((user) => (
                  <option key={user.Id} value={user.Id}>
                    {user.Email}
                  </option>
                ))}
            </select>
          )}

          {invatationSent && <label>Group invitation sent!</label>}

          {!isGroupMember && (
            <button
              onClick={() =>
                SendGroupRequest(
                  selectedGroup.CreatorId,
                  selectedGroup.Title,
                  selectedGroup.Id
                )
              }
              className={styles.inviteButton}
            >
              Request to join
            </button>
          )}
          <div className={styles.postsAndChat}>
            {isGroupMember && (
              <GroupPosts
                groupPosts={groupPosts}
                newGroupPostHandler={newGroupPostHandler}
                selectedGroup={selectedGroup}
              />
            )}
            {isGroupMember && (
              <GroupChat
                currentUser={currentUser}
                selectedGroup={selectedGroup}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Groups;
