import { FC } from "react";
import { useSelectContext } from "./SelectContext";

type SelectButtonPropsType={
    defaultText?:string
}

const SelectButton:FC<SelectButtonPropsType> = ({defaultText}) => {
    const {selectedOption,setIsMenuOpenned}=useSelectContext()
    const selectButtonClickHandler=()=>{
        setIsMenuOpenned(prevState=>!prevState)
    }

    return (
       <button onClick={selectButtonClickHandler}>
            {selectedOption.text ? selectedOption.text : defaultText}
       </button>
    );
};
export default SelectButton;