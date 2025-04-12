import MessengerIcon from '../../../assets/icons/sms-notification.svg';
// import CommentsIcon from '../../../assets/icons/device-message.svg';
import UsersIcon from '../../../assets/icons/add-user.svg';
import styles from './style.module.scss';
import InviteTeamModal from '../../Modals/InviteTeamModal/InviteTeamModal';
import { useState } from 'react';

const Header = () => {

  const [isInviteTeamModalVisible,setIsInviteTeamModalVisible]=useState(false)

  return (
    <div className={styles['header-menu']}>
      <div className={styles['header-menu-content']}>
        <div className={styles['messenger-link']}>
          <img src={MessengerIcon} alt="" />
          <p>Мессенджер</p>
        </div>
        <div className={styles['header-actions']}>
          <div className={styles['header-actions-buttons']}>
            {/* <button className={styles['comments-button']}>
              <img src={CommentsIcon} alt="" />
              <span>Комментарии</span>
            </button> */}
            <button className={styles['invite-team-button']} onClick={() => setIsInviteTeamModalVisible(true)}>
              <img src={UsersIcon} alt="" />
              <span>Пригласить команду</span>
            </button>
            <InviteTeamModal isOpen={isInviteTeamModalVisible} onClose={() => setIsInviteTeamModalVisible(false)}/>
          </div>
          <div className={styles['user-profile']}></div>
        </div>
      </div>
    </div>
  );
}

export default Header;