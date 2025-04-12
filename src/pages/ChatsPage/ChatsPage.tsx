import styles from './ChatsPage.module.scss'
import { Outlet } from 'react-router-dom';





const ChatsPage = () => {

  return (
    <div className={styles['ChatsPage']}>
      <Outlet />
    </div>
  );
};
export default ChatsPage;
