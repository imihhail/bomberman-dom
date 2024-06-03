import { useState, useRef } from 'react';

import { GetLogin } from '../connections/loginConnection.js';
import { SetRegister } from '../connections/registerConnection.js';

import styles from './Authenticate.module.css';

const Authenticate = (props) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [date, setDate] = useState('');
  const [username, setUsername] = useState('');
  const [aboutUser, setAboutUser] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const avatar = useRef(null);

  const [authError, setAuthError] = useState('');
  const [switchRegOrLogin, setSwitchRegOrLogin] = useState(false);
  const [inputError, setInputError] = useState(false);
  const [inputErrorText, setInputErrorText] = useState('');

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleRegisterOrLogin = () => {
    setSwitchRegOrLogin(!switchRegOrLogin);
  };

  const validateEmailInput = (e) => {
    setEmail(e.target.value);
    let mailformat = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
    if (!e.target.value.match(mailformat)) {
      setInputError(true);
      setInputErrorText('Not a valid email!');
    } else {
      setInputError(false);
    }
  };

  const validatePasswordInput = (e) => {
    setPassword(e.target.value);
    if (e.target.value.length < 6) {
      setInputError(true);
      setInputErrorText('Password length must be above 5 letters');
    } else {
      setInputError(false);
    }
  };

  const validateFirstNameInput = (e) => {
    setFirstName(e.target.value);
    if (e.target.value.length < 1) {
      setInputError(true);
      setInputErrorText('Empty First name not allowed!');
    } else {
      setInputError(false);
    }
  };

  const validateLastNameInput = (e) => {
    setLastName(e.target.value);
    if (e.target.value.length < 1) {
      setInputError(true);
      setInputErrorText('Empty Last name not allowed!');
    } else {
      setInputError(false);
    }
  };

  const validateDateInput = (e) => {
    setDate(e.target.value);
    let currYear = new Date().getFullYear();
    if (currYear - e.target.valueAsDate.getFullYear() < 18) {
      setInputError(true);
      setInputErrorText('Must be at least 18 years old');
    } else {
      setInputError(false);
    }
  };

  const handleUsername = (e) => {
    setUsername(e.target.value);
  };

  const handleAboutUser = (e) => {
    setAboutUser(e.target.value);
  };

  const resetInputs = () => {
    setEmail('');
    setPassword('');
    setFirstName('');
    setLastName('');
    setDate('');
    setUsername('');
    setAboutUser('');
  };
  // send login / register request to server
  const sendRequest = async () => {
    props.modal(true);
    // if logging in
    const formData = new FormData();
    formData.append('email', email);
    formData.append('password', password);

    // if registering
    if (switchRegOrLogin) {
      const fileInput = avatar.current;
      const file = fileInput?.files[0];
      if (file) {
        if (!(file.type.startsWith('image/') || file.type.endsWith('gif'))) {
          setAuthError('Avatar file must be a jpg or gif');
          console.error('Invalid file type. Please select an image or GIF.');
          return;
        }
      }
      formData.append('firstName', firstName);
      formData.append('lastName', lastName);
      formData.append('date', date);
      formData.append('username', username);
      formData.append('aboutUser', aboutUser);
      formData.append('avatar', file);
      SetRegister(formData).then((data) => {
        if (data.newUser === 'created') {
          resetInputs();
          toggleRegisterOrLogin();
          setInputErrorText('');
          setInputError(false);
        } else {
          setInputError(true);
          if (data?.server) {
            setInputErrorText(data.error);
          } else if (data?.email) {
            setInputErrorText(data.email);
          } else if (data?.username) {
            setInputErrorText(data.username);
          }
        }
        props.modal(false);
      });
    } else {
      GetLogin(formData).then((data) => {
        resetInputs();
        // if valid
        if (data.login === 'success') {
          props.currSession('true');
          props.setUserId(data['userid']);
          props.setUserAvatar(data['useravatar']);
          props.setUserEmail(data['useremail']);
        } else if (data?.server) {
          setInputError(true);
          setInputErrorText(data.error);
        } else {
          setInputError(true);
          setInputErrorText(data.error);
        }
        props.modal(false);
      });
    }
  };

  const validateAllRequiredInputs = () => {
    // registration
    if (switchRegOrLogin) {
      if (
        email.length > 0 &&
        password.length > 0 &&
        firstName.length > 0 &&
        lastName.length > 0 &&
        date.length > 0
      ) {
        sendRequest();
      } else {
        setInputError(true);
        setInputErrorText('Inputs marked with * are required!');
      }
      // login
    } else {
      if (email.length > 0 && password.length > 0) {
        sendRequest();
        setInputError(false);
      } else {
        setInputError(true);
        setInputErrorText('Inputs marked with * are required!');
      }
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      validateAllRequiredInputs();
    }
  };

  return (
    <>
      <div className={styles.login}>
        <span className={styles.required}>Email</span>
        <input
          className={styles.userInput}
          type='email'
          name='email'
          value={email}
          onChange={validateEmailInput}
        />
        <span className={styles.required}>Password</span>
        <input
          className={styles.userInput}
          type='password'
          name='password'
          value={password}
          onChange={validatePasswordInput}
          onKeyDown={handleKeyPress}
        />
        {/* open extra inputs if register */}
        {switchRegOrLogin ? (
          <div className={styles.register}>
            <span className={styles.required}>First name</span>
            <input
              className={styles.userInput}
              type='text'
              name='firstName'
              value={firstName}
              onChange={validateFirstNameInput}
            />
            <span className={styles.required}>Last name</span>
            <input
              className={styles.userInput}
              type='text'
              name='lastName'
              value={lastName}
              onChange={validateLastNameInput}
            />
            <span className={styles.required}>Birth date</span>
            <input
              className={styles.userInput}
              type='date'
              name='date'
              value={date}
              onChange={validateDateInput}
            />
            <span>Username</span>
            <input
              className={styles.userInput}
              type='text'
              name='username'
              value={username}
              onChange={handleUsername}
            />
            <span>About you</span>
            <input
              className={styles.userInput}
              type='text'
              name='about'
              value={aboutUser}
              onChange={handleAboutUser}
            />
            <span>Avatar</span>
            <label className={styles.avatarContainer}>
              <input
                className={styles.userInput}
                type='file'
                name='avatar'
                id='avatar'
                ref={avatar}
                accept='.jpg, .jpeg, .gif'
                onChange={handleImageChange}
              />
              Select file
              {selectedImage && (
                <img className={styles.selectedImage} src={selectedImage} />
              )}
            </label>
          </div>
        ) : (
          ''
        )}
        <span className={styles.error}>{authError}</span>
        <div className={styles.selectButton}>
          <button
            onClick={validateAllRequiredInputs}
            className={styles.submit}
            type='submit'
          >
            {!switchRegOrLogin ? 'Login' : 'Register'}
          </button>
        </div>
        {inputError ? (
          <span className={styles.errorMsg}>{inputErrorText}</span>
        ) : (
          ''
        )}
        <span className={styles.switch} onClick={toggleRegisterOrLogin}>
          {switchRegOrLogin ? 'Login instead' : 'Register instead'}
        </span>
      </div>
    </>
  );
};

export default Authenticate;
