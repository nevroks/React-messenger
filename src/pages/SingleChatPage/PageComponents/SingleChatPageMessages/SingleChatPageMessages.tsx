import { FC, useEffect, useRef, useState } from 'react';
import MessageItem from '../../../../components/MessageItem/MessageItem';
import styles from './style.module.scss';
import { useMessagesStore } from '../../../../stores/Messages/MessagesStore';
import { useSelectedMessagesStore } from '../../../../stores/Messages/SelectedMessagesStore';
import { useParams } from "react-router-dom";
import { useInView } from "react-intersection-observer";
// import MessagesSkelets from '../../../../components/Skelets/MessagesSkelets/MessagesSkelets';
import useMessages from '../../../../utils/hooks/Messages/useMessages';
import { MessageType } from '../../../../utils/types/MessagesTypes';
import XIcon from "../../../../assets/icons/xmark-gray.svg"
import InfiniteScroll from 'react-infinite-scroll-component';
import { useComponentsHeightStore } from '../../../../stores/ComponentsHeight';
import { useChatsStore } from '../../../../stores/ChatsStore';

// import { AnimatePresence,motion } from 'framer-motion';




// const pinnedMessageContainerVariants = {
//     hidden: { opacity: 0, y: -50 },
//     visible: {
//         opacity: 1,
//         y: 0,
//         transition: {
//             type: 'spring',
//             stiffness: 100,
//             damping: 15,
//         },
//     },
//     exit: {
//         opacity: 0,
//         y: -50,
//         transition: { duration: 0.4 },
//     },
// };

// const pinnedMessageTextVariants = {
//     hidden: { opacity: 0, scale: 0.8 },
//     visible: {
//         opacity: 1,
//         scale: 1,
//         transition: {
//             type: 'spring',
//             stiffness: 150,
//             damping: 12,
//         },
//     },
// };

type SingleChatPageMessagesProps = {
    isSidebarOpen: boolean
}

const SingleChatPageMessages: FC<SingleChatPageMessagesProps> = ({ isSidebarOpen }) => {
    const { id } = useParams()
    const messageListRef = useRef<HTMLDivElement>(null);
    const [contextMenuMessageId, setContextMenuMessageId] = useState<string | null>(null);
    const { selectors, actions } = useMessagesStore();

    const { selectors: chatSelectors } = useChatsStore()
    const {actions:selectedStoreActions, selectors: selectedStoreSelectors} = useSelectedMessagesStore();

    const IsPaginationLoading = selectors.getIsPaginationLoadingSelector;
    const chatMessages: MessageType<"text" | "poll" | "video" | "voice">[] = selectors.getMessagesOneChatSelector(Number(id)) || [];
    const { ref, inView } = useInView({ threshold: 1 });
    const [isLoadingSkeleton, setIsLoadingSkeleton] = useState(false);
    const [countMessages, SetCountMessages] = useState<number>();
    const { pinMessage, unpinMessage, deleteMessage } = useMessages();
    const { selectors: windowSelector } = useComponentsHeightStore()
    const totalMessagCount = chatSelectors.getTotalCountChatMessages()

    useEffect(() => {
        const chat = totalMessagCount.find(chat => chat.chatId === Number(id))
        SetCountMessages(chat?.count)
    }, [ id])

    // const highlightSearchTerm = (text: string, searchTerm: string) => {
    //     if (!searchTerm) return text;
    //     const regex = new RegExp(`(${searchTerm})`, 'gi');
    //     return text.replace(regex, '<mark>$1</mark>');
    // };

    useEffect(() => {
        actions.setInViewAction(inView);
    }, [inView, actions]);

    useEffect(() => {
        const numericId = id ? Number(id) : undefined;

        if (numericId !== selectors.getIdChat) {
            localStorage.setItem(`scroll-position-${id}`, '0');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id, actions]);

    useEffect(() => {
        const currentRef = messageListRef.current;
        if (currentRef) {
            const savedScrollPosition = localStorage.getItem(`scroll-position-${id}`);
            if (savedScrollPosition) {
                currentRef.scrollTop = parseInt(savedScrollPosition, 10);
            }
            const handleScroll = () => {

                if (!isLoadingSkeleton) {
                    localStorage.setItem(`scroll-position-${id}`, currentRef.scrollTop.toString());
                }
            };
            currentRef.addEventListener('scroll', handleScroll);
            return () => {
                currentRef.removeEventListener('scroll', handleScroll);
            };
        }
    }, [id, isLoadingSkeleton]);

    useEffect(() => {
        if (IsPaginationLoading) {
            setIsLoadingSkeleton(true);
        } else {
            setIsLoadingSkeleton(false);
        }
    }, [IsPaginationLoading]);

    const handleMessageDelete = (messageId: number) => {
        deleteMessage(messageId)
    }

    const handleMessageEdit = (message: MessageType<"text" | "poll" | "video" | "voice">) => {
        actions.setEditingMessageAction(message);
    }

    const handleMessageSelect = (id: number) => {
        selectedStoreActions.setSelectedMessagesAction(id);
    }



    const handleMessagePin = (message: MessageType<"text" | "poll" | "video" | "voice">) => {
        pinMessage(message);
    }

    const handleMessageUnpin = (message: MessageType<"text" | "poll" | "video" | "voice">) => {
        unpinMessage(message);
    }


    const pinnedMessage = selectors.getLastPinnedMessageSelector

    const handleMessageReply = (id: number) => {
        actions.setReplyId(id);
    }


    return (
        <div className={styles['chat-view']}>

            {pinnedMessage && pinnedMessage.author && (
                <div className={styles['pinned-message']}>
                    <strong>{pinnedMessage.author.firstName}:</strong>
                    <span className={styles['pinned-message-preview']}>
                        {pinnedMessage.textMessage.content.length > 153
                            ? `${pinnedMessage.textMessage.content.substring(0, 153)}...`
                            : pinnedMessage.textMessage.content}
                    </span>
                    <button onClick={() => handleMessageUnpin(pinnedMessage)}
                        className={styles['unpin-button']}
                    >
                        <img src={XIcon} alt="" />
                    </button>
                </div>
            )}
            <div className={styles['message-list-wrapper']}>
                <div className={`${styles['message-list']}  ${isSidebarOpen ? styles['message-list-with-sidebar'] : ''}`} ref={messageListRef}>
                    {/* {isLoadingSkeleton ? (
                        <div className={styles['message-skeleton-container']}>
                            {Array.from({ length: 6 }, (_, index) => (
                                <div className={styles['message-skeleton-box']} key={`skeleton-${index}`}>
                                    <MessagesSkelets className={styles['message-skeleton']} />
                                </div>
                            ))}
                        </div>
                    ) : ( */}
                    <div
                        id="scrollableDiv"
                        style={{
                            height: pinnedMessage ? windowSelector.getWindowLentHeightSelector - 100 : windowSelector.getWindowLentHeightSelector - 60,
                            overflow: 'auto',
                            display: 'flex',
                            flexDirection: 'column-reverse',
                        }}
                    >
                        <InfiniteScroll
                            dataLength={chatMessages.length}
                            next={() => actions.setInViewAction(true)}
                            style={{ display: 'flex', flexDirection: 'column-reverse' }}
                            inverse={true}
                            hasMore={true}
                            loader={ countMessages === chatMessages.length? <h4>No more messages</h4> :<h4>Loading...</h4>}
                            scrollableTarget="scrollableDiv"
                        >
                            {chatMessages.map((message, index) => {
                                const isSecondLast = index === chatMessages.length - 2
                                return (
                                    <MessageItem
                                        key={message.id ? message.id : `message-${index}`}
                                        vieved={isSecondLast ? ref : () => { }}
                                        message={message}
                                        onUserClick={() => { }}
                                        contextMenuMessageId={contextMenuMessageId}
                                        setContextMenuMessageId={setContextMenuMessageId}
                                        pinnedMessageId={null}
                                        onDelete={() => handleMessageDelete(message.id)}
                                        onEdit={() => handleMessageEdit(message)}
                                        onSelect={() => handleMessageSelect(message.id)}
                                        onPin={() => handleMessagePin(message)}
                                        selectedMessages={selectedStoreSelectors.getHandleMessagesSelector}
                                        onReply={() => handleMessageReply(message.id)}
                                        replyId={message.replied}
                                    />
                                );
                            })}
                        </InfiniteScroll>
                    </div>
                </div>
            </div>
        </div >
    );
};

export default SingleChatPageMessages;