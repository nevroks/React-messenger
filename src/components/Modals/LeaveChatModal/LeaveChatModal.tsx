import classNames from "classnames";
import Modal from "../../UI/Modal/Modal";
import styles from "./style.module.scss";

interface LeaveChatModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LeaveChatModal: React.FC<LeaveChatModalProps> = ({ isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className={styles["modal-content"]}>
        <h4 className={styles["modal-content-title"]}>Покинуть чат?</h4>
        <p className={styles["modal-content-text"]}>
          Администратор этого чата сможет вернуть вас обратно, если это будет
          неоходимо
        </p>
        <div className={styles["modal-content-buttons"]}>
          <button className={styles["modal-content-buttons-btn"]} type="button">
            Остаться
          </button>
          <button
            className={classNames(
              styles["modal-content-buttons-btn"],
              styles["red"]
            )}
            type="button"
          >
            Покинуть чат
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default LeaveChatModal;
