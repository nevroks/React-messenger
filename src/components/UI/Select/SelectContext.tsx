import {createContext, Dispatch, SetStateAction, useContext} from "react";
import { SelectOptionType } from "./Select";


type SelectContextType={
    selectedOption:SelectOptionType;
    setSelectedOption:Dispatch<SetStateAction<SelectOptionType>>;
    options:SelectOptionType[];
    isMenuOpenned:boolean;
    setIsMenuOpenned:Dispatch<SetStateAction<boolean>>;
}
const SelectContext =createContext<SelectContextType | null>(null)

// eslint-disable-next-line react-refresh/only-export-components
export function useSelectContext(){
    const context =useContext(SelectContext)
    if (!context){
        throw new Error("")
    }
    return context
}

export default SelectContext;