import { FC, HTMLAttributes, ReactNode } from "react";
import SelectMenuOption from "./SelectMenuOption";
import { useSelectContext } from "./SelectContext";
import classNames from "classnames";
import classes from "./style.module.scss"
import { AnimatePresence, motion, Variants } from "framer-motion";

type SelectMenuPropsType = {
    children: ReactNode
}

interface SelectMenuComponent extends FC<SelectMenuPropsType & HTMLAttributes<HTMLDivElement>> {
    Option: typeof SelectMenuOption
}

const SelectMenuVariants: Variants = {
    hidden: { opacity: 0, height: 0 },
    visible: {
        opacity: 1,
        height: 'auto',
        transition: {
            staggerChildren: 0.1
        }
    },
    exit: { opacity: 0, height: 0 }
};

const SelectMenu: SelectMenuComponent = ({ children }) => {

    const { isMenuOpenned } = useSelectContext()



    return (
        <AnimatePresence>
            {isMenuOpenned && (
                <motion.ul
                    className={classNames(classes["SelectMenu"], {
                        [classes.opened]: isMenuOpenned
                    })}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    variants={SelectMenuVariants}
                >
                    {children}
                </motion.ul>
            )}
        </AnimatePresence>
    );
};

SelectMenu.Option = SelectMenuOption

export default SelectMenu;