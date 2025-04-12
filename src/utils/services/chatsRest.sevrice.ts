import axios from "axios";
import { MessageTypeDetails } from "./massagesSocket.service";
import { secureAxiosApi } from "../helpers/secureAxiosApi";


const chatsApi = axios.create({
    baseURL: `${import.meta.env.VITE_BACKEND_URL}/chats`,
    headers: {
        "Content-Type": "application/json",
        
    },
});
secureAxiosApi(chatsApi)
export const getFilteredMessagesFromChatBySeaechQuery = async (chatId: string, searchQuery: string):Promise<MessageTypeDetails[]> => {
    const {data} = await chatsApi.get(`/${chatId}/messages/search`, {params: {text: searchQuery}});
    return data
};