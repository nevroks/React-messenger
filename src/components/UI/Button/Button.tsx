import { FC } from "react";
import classNames from "classnames";
import classes from "./style.module.scss";

interface ButtonProps {
    className?: string;
    icons?: string;
    customClass?: string;
    children?: string;
    positionIcons: "left" | "right" ; 
    onClick: () => void; 
}

const Button:FC<ButtonProps> = ({ icons, children, customClass, positionIcons, onClick }) => {
    const buttonClass = classNames(
        customClass || classes["SingleChatPageSidebarInfoSideBar-leaveChat-button"]
    );

    return (
        <div className={classes["SingleChatPageSidebarInfoSideBar-leaveChat"]}>
            {positionIcons === "left" && <img src={icons} alt="icons" />}
            <button className={buttonClass} onClick={onClick}>
                {children}
            </button>
            {positionIcons === "right" && <img src={icons} alt="icons" />}
        </div>
    );
};

export default Button;