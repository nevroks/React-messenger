import { useEffect, useRef, useState } from "react";
import { useChatsStore } from "../../../stores/ChatsStore";
import { useMessagesStore } from "../../../stores/Messages/MessagesStore";
import useMessagesSocket from "../Messages/useMessagesSocket";
import { getChatMessages } from "../useDataConvector";
import { getPaginationConvector } from "../usePaginationConvector"


export const useMessagesSubscribe = () => {

    const { listeners, actions: messagesActions } = useMessagesSocket();
    const { actions, selectors } = useMessagesStore();
    const { selectors: chatSelectors } = useChatsStore();

    const isSubscribed = useRef(false);
    const chatIds = chatSelectors.getAllChatIdsSelector();
    const selectedChatId = selectors.getDateNextMessagesSelector.chatId;
    const totalMessagesCount = chatSelectors.getTotalCountChatMessages().find(chat => chat.chatId === selectedChatId)?.count || 0;
    const localMessagesCount = selectors.getMessagesOneChatSelector(selectedChatId)?.length || 0;
    const [localPage, setLocalPage] = useState(2);

    useEffect(() => {
        if (localPage !== 2) {
            setLocalPage(2);
        }
    }, [ selectors.getIdChat]);

    useEffect(() => {
        if (!isSubscribed.current) {
            isSubscribed.current = true;

            const fetchInitialMessages = async () => {
                try {
                    const data = await messagesActions.getMessages({ chatIds, limit: 20, page: 1 });
                    const formattedData = getChatMessages(data.chatIds, data.messages);
                    actions.setChatsAction(formattedData);
                    actions.changeMessagesIsFetchedAction(true);
                } catch (error) {
                    actions.setMessagesErrorAction(error as Error);
                } finally {
                    actions.changeMessagesIsFetchedAction(false);
                }
            };

            fetchInitialMessages();

            listeners.listenGetNewMessages((messageData) => {
                if (Array.isArray(messageData)) {
                    messageData.forEach(actions.addMessageAction);
                } else {
                    actions.addMessageAction(messageData);
                }
            });

            listeners.listenUpdateReactions((updatedReactions) => {
                actions.updateMessageReactions(updatedReactions);
            });

            listeners.listenPinMessage((pinData) => {
                const { messageId, isPinned } = pinData;
                if (isPinned) {
                    actions.pinMessageAction({ messageId, isPinned });
                }
            });
            listeners.listenDeleteMessage((deletedMessage) => {
                actions.deleteMessageAction(deletedMessage);
            });
        }
    }, [actions, chatIds, listeners, messagesActions]);


    useEffect(() => {
        const emojions = selectors.getReactionMessagSelector;

        if (emojions && emojions.chatId && emojions.messageId && emojions.reactionCode) {
            messagesActions.sendAddReaction({
                chatId: emojions.chatId,
                messageId: emojions.messageId,
                reactionCode: emojions.reactionCode
            });
        }
    }, [selectors.getReactionMessagSelector]);

    useEffect(() => {
        actions.endChatAction(localMessagesCount >= totalMessagesCount);
    }, [actions, localMessagesCount, totalMessagesCount]);


    const loadMoreMessages = async () => {
        const { chatId: nextChatId, limit, inView, } = selectors.getDateNextMessagesSelector;

        if (inView && localMessagesCount < totalMessagesCount) {

            actions.changeMessagesIsPaginationLoadingAction(true);
            try {
                setLocalPage(prevPage => prevPage + 1);

                const data = await messagesActions.getPagination({ chatIds: [nextChatId], limit, page: localPage });

                const formattedData = getPaginationConvector([data.chatIds[0]], data.messages);
                actions.setChatsNextAction(formattedData);
            } catch (error) {
                actions.setMessagesErrorAction(error as Error);
            } finally {
                actions.changeMessagesIsPaginationLoadingAction(false);
            }
        }
    };


    useEffect(() => {
        loadMoreMessages();
    }, [selectors.getDateNextMessagesSelector.inView]);

    return { loadMoreMessages };
};
