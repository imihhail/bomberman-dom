import { useRouteError, useNavigate } from 'react-router-dom';

import styles from './ErrorPage.module.css';

const ErrorPage = () => {
  const error = useRouteError();
  const navigate = useNavigate();
  const RedirectAfterError = () => {
    navigate('/');
  };
  // console.error(error);
  return (
    <div className={styles.errors}>
      <h1>Oops!</h1>
      <p>Sorry, an unexpected error has occurred.</p>
      <p>
        <i>{error.statusText || error.message}</i>
      </p>
      <button onClick={RedirectAfterError}>Back</button>
    </div>
  );
};

export default ErrorPage;
