import { useRef, useEffect } from 'react';
import styles from './ChatInput.module.css';
import 'emoji-picker-element';

const ChatInput = (props) => {
  const pickerRef = useRef(null);

  useEffect(() => {
    const picker = pickerRef.current;
    picker.addEventListener('emoji-click', handleEmojiSelect);
    return () => {
      picker.removeEventListener('emoji-click', handleEmojiSelect);
    };
  }, []);

  const handleEmojiSelect = (event) => {
    const emoji = event.detail.unicode;
    props.handleEmojis(emoji);
    togglePicker();
  };

  const togglePicker = () => {
    if (pickerRef.current.style.display === 'none') {
      pickerRef.current.style.display = 'block';
    } else {
      pickerRef.current.style.display = 'none';
    }
  };

  return (
    <div className={styles.inputContainer}>
      <input
        type='text'
        value={props.textMessage}
        onChange={props.handleText}
        className={styles.chatInput}
        name='textMessage'
        placeholder={props.textMessageError}
        id=''
        onKeyDown={props.handleKeyPress}
      />
      <button onClick={togglePicker}>😀</button>
      <emoji-picker
        ref={pickerRef}
        style={{
          display: 'none',
          position: 'absolute',
          right: '0',
          bottom: '1.2rem',
        }}
        // onEmojiClick={handleEmojiSelect}
      ></emoji-picker>
      <button
        type='submit'
        onClick={props.sendMessage}
        disabled={props.textMessage.length < 1 ? true : false}
      >
        Send
      </button>
    </div>
  );
};

export default ChatInput;
