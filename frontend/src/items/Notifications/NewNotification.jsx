import styles from './NewNotification.module.css';

const NewNotification = ({ children }) => {
  return <div className={styles.notification}>{children}</div>;
};

export default NewNotification;
