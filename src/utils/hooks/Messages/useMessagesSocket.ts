import { useAppSocketContext } from "../../hocs/AppSocketProvider/AppSocketContext";

import {
    MessageAttacmentsSendPropsType,
    IChatUser,
    MessageTypeType,
    MessageVoiceMessageType,
    MessageVideoMessageType,
    MessageType
} from "../../types/MessagesTypes";


// -----List Messages----- 
export type ListMessagesPayloadType = {
    chatIds: number[];
    page?: number;
    limit?: number;
};

export type ListMessagesResultType = {
    chatIds: number[];
    messages: MessageType<"text" | "poll" | "video" | "voice">[];
};

// -----Send Message----- 
export type SendMessagePayloadType<T extends MessageTypeType> = T extends 'text'
    ? SendTextMessagePayloadType
    : T extends 'voice'
    ? SendVoiceMessagePayloadType
    : T extends 'video'
    ? SendVideoMessagePayloadType
    : never;


export type SendTextMessagePayloadType = {
    chatId: number;
    type: MessageTypeType;
    repliedTo?: number;
    text: string;
    attachments?: MessageAttacmentsSendPropsType[];
};
export type SendVoiceMessagePayloadType = {
    chatId: number;
    type: MessageTypeType;
    repliedTo?: number;
    voice: MessageVoiceMessageType;
};
export type SendVideoMessagePayloadType = {
    chatId: number;
    type: MessageTypeType;
    repliedTo?: number;
    video: MessageVideoMessageType;
};




export type SendMessageResultType = MessageType<"text" | "poll" | "video" | "voice">;


// -----Update Message----- 
export type UpdateMessagePayloadType = {
    messageId: number;
    type: MessageTypeType;
    text: string;
    attachments?: MessageAttacmentsSendPropsType;
};

export type UpdateMessageResultType = {
    updatedMessage: MessageType<"text" | "poll" | "video" | "voice">;
};

// -----Delete Message----- 
export type DeleteMessagePayloadType = {
    messageId: number;
};

export type DeleteMessageResultType = {
    deletedMessage: {
        id: number;
        chatId: number;
        editedAt: string | null;
        deletedAt: string;
    };
};

// -----Important Message----- 
export type ImportantMessagePayloadType = {
    chatId: number;
    messageId: number;
    isImportant: boolean;
};

export type ImportantMessageResultType = {
    messageId: number;
    isImportant: boolean;
};

// -----Pin Message----- 
export type PinMessagePayloadType = {
    chatId: number;
    messageId: number;
    isPinned: boolean;
};

export type PinMessageResultType = {
    messageId: number;
    isPinned: boolean;
};

// -----Update Reactions----- 
export type UpdateReactionsPayloadType = {
    chatId: number;
    messageId: number;
    reactionCode: string;
};

export type UpdateReactionsResultType = {
    chatId: number;
    messageId: number;
    updatedReactions: IUpdatedReaction[];
};

export interface IUpdatedReaction {
    id: number;
    reactionCode: string;
    users: IChatUser[];
}


const messageOperations = {
    receive: {
        receive_getMessages: "receive_get_messages",
        receive_newMessage: "receive_new_message",
        receive_deleteMessage: "receive_delete_message",
        receive_updateMessage: "receive_update_message",
        receive_pinMessage: "receive_pin_message",
        receive_updateReactions: "receive_update_reactions"
    },
    send: {
        send_getMessages: "send_get_messages",
        send_newMessage: "send_new_message",
        send_deleteMessage: "send_delete_message",
        send_updateMessage: "send_update_message",
        send_pinMessage: "send_pin_message",
        send_updateReactions: "send_update_reactions"
    }
};


const useMessagesSocket = () => {

    const { appSocket: messageSocket } = useAppSocketContext()

    // -------------------------
    // -----Start listeners-----
    // -------------------------

    const listenGetNewMessages = (callback: (messages: SendMessageResultType) => void) => {
        messageSocket?.on(messageOperations.receive.receive_newMessage, (response: { newMessage: SendMessageResultType }) => {
            callback(response.newMessage);
        });
    };

    const listenUpdateMessage = (callback: (updatedMessage: UpdateMessageResultType) => void) => {
        messageSocket?.on(messageOperations.receive.receive_updateMessage, (response: { updatedMessage: UpdateMessageResultType }) => {
            callback(response.updatedMessage);
        });
    }

    const listenUpdateReactions = (callback: (reactions: UpdateReactionsResultType) => void) => {
        messageSocket?.on(messageOperations.receive.receive_updateReactions, (response: UpdateReactionsResultType) => {
            callback(response);
        });
    };
    const listenPinMessage = (callback: (pinnedMessage: PinMessageResultType) => void) => {
        messageSocket?.on(messageOperations.receive.receive_pinMessage, (response: PinMessageResultType) => {
            callback(response);
        });
    }

    const listenDeleteMessage = (callback: (deletedMessage: DeleteMessageResultType) => void) => {
        messageSocket?.on(messageOperations.receive.receive_deleteMessage, (response: DeleteMessageResultType) => {
            callback(response);
        });
    };

    // -------------------------
    // -----End listeners-----
    // -------------------------


    // -------------------------
    // ------Start actions------
    // -------------------------

    const getPagination = (parameters: ListMessagesPayloadType): Promise<ListMessagesResultType> => {
        return new Promise((resolve, reject) => {
            console.log(parameters);
            messageSocket?.emit(messageOperations.send.send_getMessages, {
                chatIds: parameters.chatIds,
                page: parameters.page,
                limit: parameters.limit
            });

            messageSocket?.on(messageOperations.receive.receive_getMessages, (response: ListMessagesResultType) => {
                resolve(response);
            });

            messageSocket?.on('error', (error) => {
                reject(error);
            });
        });
    };

    const getMessages = (parameters: ListMessagesPayloadType): Promise<ListMessagesResultType> => {
        return new Promise((resolve, reject) => {
            messageSocket?.emit(messageOperations.send.send_getMessages, {
                chatIds: parameters.chatIds,
                page: parameters.page,
                limit: parameters.limit
            });

            messageSocket?.on(messageOperations.receive.receive_getMessages, (response: ListMessagesResultType) => {
                resolve(response);
            });

            messageSocket?.on('error', (error) => {
                reject(error);
            });
        });
    };

    const sendGetMessages = (parameters: ListMessagesPayloadType) => {
        messageSocket?.emit(messageOperations.send.send_getMessages, {
            chatIds: parameters.chatIds,
            page: parameters.page,
            limit: parameters.limit
        })

    }

    const sendNewMessage = (newMessage: SendMessagePayloadType<"text" | "voice" | "video">) => {
        switch (newMessage.type) {
            case 'text':
                let typedNewMessage = newMessage as SendTextMessagePayloadType
                messageSocket?.emit(messageOperations.send.send_newMessage, {
                    chatId: typedNewMessage.chatId,
                    type: typedNewMessage.type,
                    text: typedNewMessage.text,
                    repliedTo: typedNewMessage.repliedTo,
                    attachments: typedNewMessage.attachments,
                });
                break
            case "voice":
                const typedNewVoiceMessage = newMessage as SendVoiceMessagePayloadType

                messageSocket?.emit(messageOperations.send.send_newMessage, {
                    chatId: typedNewVoiceMessage.chatId,
                    type: typedNewVoiceMessage.type,
                    repliedTo: typedNewVoiceMessage.repliedTo,
                    voice: typedNewVoiceMessage.voice,
                })
                break
            case "video":
                const typedNewVideoMessage = newMessage as SendVideoMessagePayloadType

                messageSocket?.emit(messageOperations.send.send_newMessage, {
                    chatId: typedNewVideoMessage.chatId,
                    type: typedNewVideoMessage.type,
                    repliedTo: typedNewVideoMessage.repliedTo,
                    video: typedNewVideoMessage.video
                })
        }
    };


    const sendDeleteMessage = (messageId: DeleteMessagePayloadType) => {
        messageSocket?.emit(messageOperations.send.send_deleteMessage, {
            messageId: messageId.messageId
        });
    };

    const sendUpdateMessage = ({ messageId, type, text }: UpdateMessagePayloadType) => {
        messageSocket?.emit(messageOperations.send.send_updateMessage, {
            messageId,
            type,
            text,
        });
    };


    const sendPinMessage = ({ chatId, messageId, isPinned }: PinMessagePayloadType) => {
        messageSocket?.emit(messageOperations.send.send_pinMessage, { chatId, messageId, isPinned });
    };


    const sendAddReaction = ({ chatId, messageId, reactionCode }: UpdateReactionsPayloadType) => {
        messageSocket?.emit(messageOperations.send.send_updateReactions, { chatId, messageId, reactionCode });
    };

    // -------------------------
    // -------End actions-------
    // -------------------------


    return {
        listeners: {
            listenGetNewMessages,
            listenUpdateMessage,
            listenUpdateReactions,
            listenPinMessage,
            listenDeleteMessage
        },
        actions: {
            getPagination,
            getMessages,
            sendGetMessages,
            sendNewMessage,
            sendDeleteMessage,
            sendUpdateMessage,
            sendPinMessage,
            sendAddReaction
        }
    };
}
export default useMessagesSocket;