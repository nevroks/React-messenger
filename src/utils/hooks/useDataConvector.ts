import { IGetMessages, MessageType} from "../types/MessagesTypes";

export const getChatMessages = (chats: number[], messages: MessageType<"poll" | "text" | "video" | "voice">[]) => {
    const flatChats: number[] = chats.flat();
    
    const chatMessages: IGetMessages[] = [];

    flatChats.forEach(chat => {
        const relevantMessages = messages.filter(message => message.chatId === chat);

        chatMessages.push({
            chatIds: [chat],
            messages: relevantMessages
        });
    });

    
    return chatMessages;
}