import { Link } from 'react-router-dom';
import styles from './style.module.scss';

const ServerErrorPage = () => {
  return (
    <div className={styles.container}>
      <h1>500 - Server Error</h1>
      <p>Something went wrong on our end. Please try again later.</p>
      <Link to="/" className={styles.link}>Go back to Home</Link>
    </div>
  );
};

export default ServerErrorPage;
