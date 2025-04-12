import { useEffect, useRef } from "react";
import { useChatsStore } from "../../../stores/ChatsStore";
import useChatsSocket from "./useChatsSocket";


export const useChatsSubscribe = () => {

    const { listeners } = useChatsSocket()
    const { actions } = useChatsStore();
    const isSubscribed = useRef(false);

    useEffect(() => {
        if (!isSubscribed.current) {
            isSubscribed.current = true;

            const fetchChats = async () => {
                try {
                    const fetchedChats = await listeners.getChats();
                    actions.setChatsStateAction(fetchedChats);
                    actions.changeChatsIsFetchedStateAction(true);
                } catch (e) {
                    actions.setChatsErrorStateAction(e as Error);
                    actions.changeChatsIsFetchedStateAction(false);
                }
            };

            fetchChats();

            listeners.listenToNewUsersJoin(({ addedUsers, chatId }) => {
                actions.addUsersToChatsStoreAction({ addedUsers: addedUsers, chatId:chatId })
            })
            listeners.listenUsersToExcludeFromChat(({ chatId, excluded }) => {
                const excludedUsersIds = excluded.map(excludedUser => excludedUser.id)
                actions.deleteUsersFromChatsStoreAction({ chatId: chatId, userIds: excludedUsersIds })
            })
            listeners.listenToNewChats((newChat) => {
                actions.addSingleChatToChatsStoreAction(newChat);
            })
            listeners.listenUsersLeave((({ chatId, leavingUser }) => {
                actions.deleteUsersFromChatsStoreAction({ chatId: chatId, userIds: [leavingUser.id] })
            }))
        }
    }, [actions]);

};






