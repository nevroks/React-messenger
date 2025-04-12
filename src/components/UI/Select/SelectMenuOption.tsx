import { FC, useMemo } from "react";
import { SelectOptionType } from "./Select";
import { useSelectContext } from "./SelectContext";
import classNames from "classnames";
import classes from "./style.module.scss"
import { motion, Variants } from "framer-motion";
type SelectMenuOptionPropsType = {
    option: SelectOptionType
}


const SelectMenuOptionVariants: Variants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
};

const SelectMenuOption: FC<SelectMenuOptionPropsType> = ({ option }) => {

    const { setSelectedOption, selectedOption } = useSelectContext()

    const isOptionSelected = useMemo(() => {
        return JSON.stringify(selectedOption) === JSON.stringify(option)
    }, [selectedOption.value])

    const handleOptionClick = () => {
        if (isOptionSelected) {
            setSelectedOption({
                value: '',
                text: ''
            })
        } else {
            setSelectedOption(option)
        }

    }

    return (
        <motion.li
            onClick={handleOptionClick}
            className={classNames(classes["SelectMenuOption"], {
                [classes.selected]: isOptionSelected
            })}
            variants={SelectMenuOptionVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
        >
            {option.text}
        </motion.li>
    );
};
export default SelectMenuOption;