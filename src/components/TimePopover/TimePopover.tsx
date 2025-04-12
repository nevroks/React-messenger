import React from "react";
import styles from "./style.module.scss";
import ClockIcon from "../../assets/icons/clock.svg";
import Popover from "../UI/Popover/Popover";

interface TimePopoverProps {
  isOpen: boolean;
  anchorRef: React.RefObject<HTMLElement>;
  onClose: () => void;
}

const TimePopover: React.FC<TimePopoverProps> = ({
  isOpen,
  anchorRef,
  onClose,
}) => {
  if (!isOpen || !anchorRef) return null;

  const content = (
    <div className={styles["time-popover"]}>
      <h4 className={styles.title}>Отключить на время</h4>
      <ul className={styles.list}>
        {[
          "30 минут",
          "1 час",
          "4 часа",
          "8 часов",
          "24 часа",
          "Пока не включу",
        ].map((item) => (
          <li key={item} className={styles["list-item"]} onClick={onClose}>
            <span className={styles["list-item-icon"]}>
              <img src={ClockIcon} alt="" />
            </span>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <Popover
      isOpen={isOpen}
      anchorRef={anchorRef}
      onClose={onClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
    >
      {content}
    </Popover>
  );
};
export default TimePopover;
