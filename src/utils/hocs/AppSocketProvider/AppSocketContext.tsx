import { createContext, useContext } from "react"
import { Socket } from "socket.io-client"



type AppSocketContextType={
    appSocket:Socket | null 
}
const AppSocketContext =createContext<AppSocketContextType | null>(null)

export function useAppSocketContext(){
    const context =useContext(AppSocketContext)
    if (!context){
        throw new Error("")
    }
    return context
}

export default AppSocketContext;