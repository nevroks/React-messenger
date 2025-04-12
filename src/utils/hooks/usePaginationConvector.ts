import { IGetMessages, MessageType } from "../types/MessagesTypes";

export const getPaginationConvector = (chats: number[], messages: MessageType<"poll" | "text" | "video" | "voice">[]) => {
    const flatChats: number[] = chats.flat();
    const flatMessages: MessageType<"poll" | "text" | "video" | "voice">[] = messages.flat();

    const chatMessages: IGetMessages[] = [];

    flatChats.forEach(chat => {
        const relevantMessages = flatMessages.filter(message => message.chatId === chat);

        chatMessages.push({
            chatIds: [chat],
            messages: relevantMessages
        });
    });

    return chatMessages;
}