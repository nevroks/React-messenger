import { immer } from "zustand/middleware/immer";
import { create } from "zustand";

import { devtools, persist } from "zustand/middleware";

import { Chat } from "../../utils/types/ChatTypes.ts";
import { JoinUsersResultType } from "../../utils/hooks/Chats/useChatsSocket.ts";


interface IChatsStoreState {
    ChatsStoreState: {
        isFetched: boolean,
        error: null | Error,
        Chats: Chat[],
    },
    setChatsStateAction: (ChatsArr: Chat[]) => void,
    changeChatsIsFetchedStateAction: (isFetched: boolean) => void,
    setChatsErrorStateAction: (error: Error) => void,
    addSingleChatToChatsStoreAction: (Chat: Chat) => void,
    addUsersToChatsStoreAction: ({ chatId, addedUsers }: JoinUsersResultType) => void,
    deleteUsersFromChatsStoreAction: ({ chatId, userIds }: { chatId: number, userIds: number[] }) => void,
    deleteChatFromChatsStoreAction: (chatId: number) => void
}

const ChatsStore = create<IChatsStoreState>()(persist(immer(devtools((set) => ({
    ChatsStoreState: {
        isFetched: false,
        error: null,
        Chats: []
    },
    setChatsStateAction: (ChatsArr: Chat[]) =>
        set(({ ChatsStoreState }) => {
            ChatsStoreState.Chats = ChatsArr
        }),
    changeChatsIsFetchedStateAction: (isFetched: boolean) =>
        set(({ ChatsStoreState }) => {
            ChatsStoreState.isFetched = isFetched
        }),
    setChatsErrorStateAction: (error: Error) =>
        set(({ ChatsStoreState }) => {
            ChatsStoreState.error = error
        }),
    addSingleChatToChatsStoreAction: (Chat: Chat) =>
        set(({ ChatsStoreState }) => {
            ChatsStoreState.Chats.push(Chat)
        }),
    addUsersToChatsStoreAction: ({ chatId, addedUsers }: JoinUsersResultType) =>
        set(({ ChatsStoreState }) => {
            const chatIndex = ChatsStoreState.Chats.findIndex((chatInStore) => chatInStore.id === chatId)
            addedUsers.map(addedUser => ChatsStoreState.Chats[chatIndex].users.push(addedUser))
        }),
    deleteUsersFromChatsStoreAction: ({ chatId, userIds }: { chatId: number, userIds: number[] }) => {
        set(({ ChatsStoreState }) => {
            const chatIndex = ChatsStoreState.Chats.findIndex((chat) => chat.id === chatId)
            const updatedChatUsers = ChatsStoreState.Chats[chatIndex].users.filter(user => !userIds.includes(user.id));
            ChatsStoreState.Chats[chatIndex].users = updatedChatUsers
        })
    },
    deleteChatFromChatsStoreAction: (chatId: number) => {
        set(({ ChatsStoreState }) => {
            ChatsStoreState.Chats = ChatsStoreState.Chats.filter((chat) => chat.id !== chatId)
        })
    }
        
}))), {
    name: "Stored_Chats"
}))

export const useChatsStore = () => {
    const {
        setChatsStateAction,
        changeChatsIsFetchedStateAction,
        setChatsErrorStateAction,
        addSingleChatToChatsStoreAction,
        addUsersToChatsStoreAction,
        deleteUsersFromChatsStoreAction,
        deleteChatFromChatsStoreAction
    } = ChatsStore();

    const getAllChatsSelector = ChatsStore((state) => state.ChatsStoreState.Chats);
    const getChatsIsFetchedSelector = ChatsStore((state) => state.ChatsStoreState.isFetched);
    const getChatByIdSelector: (chatId: number) => Chat = (chatId) => ChatsStore((state) => {
        return state.ChatsStoreState.Chats.find((chat) => chat.id === chatId)!
    });

    const getAllChatIdsSelector: () => number[] = () => ChatsStore(({ ChatsStoreState }) => {
        return ChatsStoreState.Chats.reduce<number[]>((acc, chat) => {
            acc.push(chat.id);
            return acc;
        }, []);
    });
    const getTotalCountChatMessages = () => {
        return ChatsStore(state => {
            return state.ChatsStoreState.Chats.map(chat => {
                return {
                    chatId: chat.id,
                    count: chat.totalMessages || 0
                };
            });
        });
    };

    return {
        actions: {
            setChatsStateAction,
            changeChatsIsFetchedStateAction,
            setChatsErrorStateAction,
            addSingleChatToChatsStoreAction,
            addUsersToChatsStoreAction,
            deleteUsersFromChatsStoreAction,
            deleteChatFromChatsStoreAction
        },
        selectors: {
            getAllChatsSelector,
            getChatsIsFetchedSelector,
            getChatByIdSelector,
            getTotalCountChatMessages,
            getAllChatIdsSelector
        },
    };
};