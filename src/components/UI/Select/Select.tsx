import { Dispatch, ReactNode, SetStateAction, useState } from "react";
import SelectButton from "./SelectButton";
import SelectMenu from "./SelectMenu";
import SelectContext from "./SelectContext";

export type SelectOptionType<T extends string> = {
    value: T,
    text: string
}

type SelectPropsType<T extends string> = {
    children: ReactNode;
    optionsArr: SelectOptionType<T>[];
    setSelectedOption: Dispatch<SetStateAction<SelectOptionType<T>>>;
    selectedOption: SelectOptionType<T>;
}
/* interface SelectComponent{
    Button: typeof SelectButton;
    Menu: typeof SelectMenu;
    Main: typeof Select;
} */
function Select<T extends string>({ children, optionsArr, setSelectedOption, selectedOption }: SelectPropsType<T>){

    const [isMenuOpenned, setIsMenuOpenned] = useState(false)


    return (
        <>
            <SelectContext.Provider value={{
                selectedOption: selectedOption,
                setSelectedOption: setSelectedOption,
                options: optionsArr,
                setIsMenuOpenned: setIsMenuOpenned,
                isMenuOpenned: isMenuOpenned
            }}>
                {children}
            </SelectContext.Provider>

        </>
    );
};
    Select.Button = SelectButton
    Select.Menu = SelectMenu
export default Select;