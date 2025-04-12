import Modal from "../../UI/Modal/Modal";
import styles from "./style.module.scss";
import classNames from "classnames";

//Icons
import MoreIcon from "../../assets/icons/more.svg";
import UserIcon from "../../assets/icons/user-square.svg";
import AwardIcon from "../../assets/icons/award.svg";
import HashtagIcon from "../../assets/icons/hashtag.svg";
import SmsIcon from "../../assets/icons/sms-black.svg";
import MobileIcon from "../../assets/icons/mobile.svg";
import LanguageIcon from "../../assets/icons/language-square.svg";
import SunIcon from "../../assets/icons/sun.svg";
import LogoutIcon from "../../assets/icons/logout.svg";
import AvatarImg from "../../assets/avatar-example.jpeg";

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <button type="button" className={styles["profile-more"]}>
        <img src={MoreIcon} alt="" />
      </button>
      <img src={AvatarImg} alt="avatar" className={styles["profile-avatar"]} />
      <h2 className={styles["profile-title"]}>Андрей Иванов</h2>
      <ul className={styles["profile-list"]}>
        <li className={styles["profile-list-item"]}>
          <img src={UserIcon} alt="" />
          Имя{" "}
          <span className={styles["profile-list-item-info"]}>
            Андрей Иванов
          </span>
        </li>
        <li className={styles["profile-list-item"]}>
          <img src={AwardIcon} alt="" />
          Роль{" "}
          <span
            className={classNames(
              styles["profile-list-item-info"],
              styles["gray-text"]
            )}
          >
            Graph
          </span>
        </li>
        <li className={styles["profile-list-item"]}>
          <img src={HashtagIcon} alt="" />
          Имя пользователя{" "}
          <span className={styles["profile-list-item-info"]}>
            @andrey_ivanov
          </span>
        </li>
        <li className={styles["profile-list-item"]}>
          <img src={SmsIcon} alt="" />
          Электронная почта{" "}
          <span
            className={classNames(
              styles["profile-list-item-info"],
              styles["gray-text"]
            )}
          >
            pochta@pochta.com
          </span>
        </li>
        <li className={styles["profile-list-item"]}>
          <img src={MobileIcon} alt="" />
          Номер телефона{" "}
          <span className={styles["profile-list-item-info"]}>
            +7 (000) 000-00-00
          </span>
        </li>
        <li className={styles["profile-list-item"]}>
          <img src={LanguageIcon} alt="" />
          Язык <span className={styles["profile-list-item-info"]}>Русский</span>
        </li>
        <li className={styles["profile-list-item"]}>
          <img src={SunIcon} alt="" />
          Тема оформления{" "}
          <span className={styles["profile-list-item-info"]}>Системная</span>
        </li>
      </ul>
      <button type="button" className={styles["profile-logout"]}>
        <img src={LogoutIcon} alt="" />
        Выйти из аккаунта
      </button>
    </Modal>
  );
};

export default ProfileModal;
