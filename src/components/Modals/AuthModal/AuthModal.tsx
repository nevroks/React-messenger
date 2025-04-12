import Modal from "../../UI/Modal/Modal";
import SmsIcon from "../../assets/icons/sms.svg";
import styles from "./style.module.scss";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <form className={styles["form"]}>
        <h2 className={styles["form-title"]}>Авторизация</h2>
        <div className={styles["form-wrapper"]}>
          <input
            className={styles["form-wrapper-input"]}
            type="email"
            placeholder="Электронная почта"
            required
          />
          <img className={styles["form-icon"]} src={SmsIcon} alt="" />
        </div>

        <button type="submit" className={styles["form-submit-button"]}>
          Получить код
        </button>
      </form>
    </Modal>
  );
};

export default AuthModal;
