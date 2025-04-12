import { useChatsStore } from '../../../stores/ChatsStore';
import { useAppSocketContext } from '../../hocs/AppSocketProvider/AppSocketContext';
import { Chat, ChatUserType, RequiredDataToCreatenewChatType, } from '../../types/ChatTypes';

// -----Create new chat-----
export type CreateNewChatPayloadType = RequiredDataToCreatenewChatType
export type CreateNewChatResultType = {
    chat: Chat
}
// -----Create new chat-----
// -----Join users-----
export type JoinUsersPayloadType = {
    chatId: number;
    userIds: number[]
}
export type JoinUsersResultType = {
    chatId: number;
    addedUsers: ChatUserType[]
}
// -----Join users-----
// -----Exclude users-----
export type ExcludeUsersResultType = {
    chatId: number;
    excluded: ChatUserType[];
}
export type ExcludeUsersPayloadType = {
    chatId: number;
    userIds: number[]
}
// -----Exclude users-----
// -----Leave users-----
export type LeaveUserPayloadType = {
    chatId: number;
}
export type LeaveChatResultType = {
    chatId: number;
    leavingUser: ChatUserType
}
// -----Leave users-----

const chatsOperations = {
    receive: {
        get_chats: "receive_get_chats",
        listen_NewChats: "receive_new_chat",
        listen_newUsers: "receive_join_users",
        listen_ExcludedUsers: "receive_exclude_users",
        listen_UsersLeave: "receive_leave_chat"
    },
    send: {
        create_newChat: "send_new_chat",
        join_user: "send_join_users",
        exclude_user: "send_exclude_users",
        leave_user: "send_leave_chat",
    }
}
const useChatsSocket = () => {

    const { appSocket: chatsSocket } = useAppSocketContext()

    const getChats = () => {
        return new Promise<Chat[]>((resolve) => {
            if (chatsSocket) {
                chatsSocket.on(chatsOperations.receive.get_chats, (response) => {
                    resolve(response.chats);
                });
            }
        });
    };
    // -------------------------
    // -----Start listeners-----
    // -------------------------
    const listenToNewChats = (callback: (newChat: Chat) => void): void => {
        chatsSocket?.on(chatsOperations.receive.listen_NewChats, (response: { newChat: Chat }) => {
            callback(response.newChat);
        });
    };
    const listenToNewUsersJoin = (callback: (joinUsersResult: JoinUsersResultType) => void): void => {
        chatsSocket?.on(chatsOperations.receive.listen_newUsers, (response: JoinUsersResultType) => {
            callback(response);
        });
    };

    const listenUsersToExcludeFromChat = (callback: (excludeUsersResult: ExcludeUsersResultType) => void): void => {
        chatsSocket?.on(chatsOperations.receive.listen_ExcludedUsers, (response: ExcludeUsersResultType) => {
            callback(response);
        });
    };

    const listenUsersLeave = (callback: (leaveUserResult: LeaveChatResultType) => void): void => {
        chatsSocket?.on(chatsOperations.receive.listen_UsersLeave, (response: LeaveChatResultType) => {
            callback(response);
        });
    };
    // -------------------------
    // -----End listeners-----
    // -------------------------


    // -------------------------
    // ------Start actions------
    // -------------------------
    const createNewChat = (newChatData: CreateNewChatPayloadType) => {
        chatsSocket?.emit(chatsOperations.send.create_newChat, {
            title: newChatData.title,
            chatType: newChatData.chatType,
            companyId: newChatData.companyId
        },(response)=>{
            console.log(response.status)
        })

    }
    const addNewUsersToChat = ({ chatId, userIds }: JoinUsersPayloadType) => {
        chatsSocket?.emit(chatsOperations.send.join_user, {
            chatId: chatId,
            userIds: userIds,
        });
    };
    const excludeUsersFromChat = ({ chatId, userIds }: ExcludeUsersPayloadType) => {
        chatsSocket?.emit(chatsOperations.send.exclude_user, {
            chatId: chatId,
            usersIds: userIds,
        });
    };
    const leaveFromChat = ({ chatId }: LeaveUserPayloadType) => {
        chatsSocket?.emit(chatsOperations.send.leave_user, {
            chatId: chatId,
        });
    };
    // -------------------------
    // -------End actions-------
    // -------------------------
    return {
        listeners: {
            getChats,
            listenToNewChats,
            listenToNewUsersJoin,
            listenUsersToExcludeFromChat,
            listenUsersLeave
        },
        actions: {
            createNewChat,
            addNewUsersToChat,
            excludeUsersFromChat,
            leaveFromChat,
        }
    };
};

export default useChatsSocket;