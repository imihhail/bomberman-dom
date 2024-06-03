import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import { GetGroupContent } from '../../connections/groupContentConnection.js';

import styles from './NewGroup.module.css';

const NewEvent = ({
  groupId,
  currentUser,
  groupTitle,
  setEvents,
  setGroupMembers,
}) => {
  const [, logout, sendJsonMessage, ,] = useOutletContext();
  const [newPostOpen, setNewPostOpen] = useState(false);
  const [eventTitle, setEventTitle] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  // const [eventTime, setEventTime] = useState('');
  const [attendEvent, setAttendEvent] = useState('1');
  const [inputError, setInputError] = useState(true);
  const [inputErrorText, setInputErrorText] = useState('');

  const [startDate, setStartDate] = useState(new Date());

  // const today = new Date();
  // const formattedToday = today.toISOString().substring(0, 16);

  const validateEventTitleInput = (e) => setEventTitle(e.target.value);
  const validateEventInputDescrInput = (e) =>
    setEventDescription(e.target.value);
  // const validateEventDateInput = (e) => setEventTime(e.target.value)
  const validateAttendEventInput = (e) => setAttendEvent(e.target.value);

  const switchNewPostOpen = () => {
    setNewPostOpen(!newPostOpen);
    setInputErrorText('');
  };

  const CreateNewEvent = () => {
    if (eventTitle.length < 1 || eventDescription.length < 1 || startDate < 1) {
      setInputError(true);
      setInputErrorText('Title or description can not be empty!');
      return;
    }

    sendJsonMessage({
      type: 'event',
      GroupId: groupId,
      EventTitle: eventTitle,
      EventDescription: eventDescription,
      eventtime: startDate,
      participation: attendEvent,
      fromuserid: currentUser,
      GroupTitle: groupTitle,
    });
    const formData = new FormData();
    formData.append('GroupId', groupId);

    GetGroupContent(formData).then((data) => {
      if (data?.server) {
        setInputError(true);
        setInputErrorText(data.error);
      } else if (data.login == 'success') {
        setGroupMembers(data.groupMembers);
        setEvents(data.events);
        switchNewPostOpen();
      } else {
        logout();
      }
    });
  };

  return (
    <div className={styles.newPost}>
      {newPostOpen ? (
        <div className={styles.openNewPost}>
          <span>Title</span>
          <input type='text' id='content' onChange={validateEventTitleInput} />
          <span>Description</span>
          <input
            type='text'
            id='content'
            onChange={validateEventInputDescrInput}
          />
          <span className={styles.required}>Event date</span>

          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            showTimeSelect
            timeFormat='HH:mm'
            timeIntervals={15}
            timeCaption='time'
            dateFormat='MMMM d, yyyy h:mm aa'
          />

          <div className={styles.privacySelection}>
            <div>
              <input
                type='radio'
                value='1'
                checked={attendEvent === '1'}
                onChange={validateAttendEventInput}
              />
              <span>Going</span>
            </div>
            <div>
              <input
                type='radio'
                value='2'
                checked={attendEvent === '2'}
                onChange={validateAttendEventInput}
              />
              <span>Not going</span>
            </div>
          </div>
          {inputError ? (
            <span className={styles.errorMsg}>{inputErrorText}</span>
          ) : (
            ''
          )}

          <div className={styles.openNewPostOptions}>
            <span className={styles.openNewPostSubmit} onClick={CreateNewEvent}>
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
        <span
          className={styles.closedNewEvent}
          onClick={() => {
            switchNewPostOpen();
          }}
        >
          Create Event
        </span>
      )}
    </div>
  );
};
export default NewEvent;
