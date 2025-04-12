import { useEffect, useRef, useState } from "react";
import styles from "./style.module.scss";
import SingleChatPageEmojiSidebar from "./PageComponents/SingleChatPageEmojiSidebar/SingleChatPageEmojiSidebar";
import SingleChatPageSidebar from "./PageComponents/SingleChatPageSidebar/SingleChatPageSidebar";
import MessageInput from "../../components/UI/MessageInput/MessageInput";
import { Outlet, useLocation, useParams } from "react-router-dom";
import { useChatsStore } from "../../stores/ChatsStore";
import SingleChatPageHeader from "./PageComponents/SingleChatPageHeader/SingleChatPageHeader";
import SingleChatPageMessages from "./PageComponents/SingleChatPageMessages/SingleChatPageMessages";
import { useMessagesStore } from "../../stores/Messages/MessagesStore";
import {useSelectedMessagesStore} from "../../stores/Messages/SelectedMessagesStore";
import { useComponentsHeightStore } from "../../stores/ComponentsHeight";
import HighlightedMessages from "../../components/UI/HighlightedMessages/HighlightedMessages";

const SingleChatPage = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isEmojiSidebarOpen, setIsEmojiSidebarOpen] = useState(false);
    const leftContentRef = useRef<HTMLDivElement>(null);
    const { actions: heightActions } = useComponentsHeightStore()
    const { selectors } = useChatsStore()


    // eslint-disable-next-line prefer-const
    let location = useLocation();
    const { id } = useParams();
    const { actions } = useMessagesStore();
    const {selectors: selectedMessagesSelectors} = useSelectedMessagesStore();

    const PageMode: "chat" | "search" = location.pathname.includes("search") ? "search" : "chat"

    const chatData = selectors.getChatByIdSelector(Number(id))
    useEffect(() => {
        const chatId = id ? Number(id) : Number(0);
        actions.setChatIdAction(chatId);
    }, [id, actions])

    // if (isLoading) return <div>Loading messages...</div>;

    const handleSidebarToggle = () => {
        if (isEmojiSidebarOpen) {
            setIsEmojiSidebarOpen(false);
        }
        setIsSidebarOpen(!isSidebarOpen);
    };

    const handleEmojiToggle = () => {
        if (isSidebarOpen) {
            setIsSidebarOpen(false);
        }
        setIsEmojiSidebarOpen(!isEmojiSidebarOpen);
    };

    const handleEmojiSelect = (emoji: string) => {
        if (document.querySelector('input[name="text"]')) {
            const input = document.querySelector('input[name="text"]') as HTMLInputElement;
            input.value += emoji;
        }
    };


    useEffect(() => {
        if (leftContentRef.current) {
            heightActions.setWindowLentHeightAction(leftContentRef.current.clientHeight);
        }
    }, [isSidebarOpen, isEmojiSidebarOpen]);



    const handleContextMenu = (event: MouseEvent) => {
        event.preventDefault();

        if (leftContentRef.current) {
            const rect = leftContentRef.current.getBoundingClientRect();
            const clickY = event.clientY - rect.top;
            const heightFromBottom = rect.height - clickY;

            heightActions.setMessagesHeightAction(Math.floor(heightFromBottom))
        }
    };

    useEffect(() => {
        const currentRef = leftContentRef.current;
        if (currentRef) {
            currentRef.addEventListener('contextmenu', handleContextMenu);
        }

        return () => {
            if (currentRef) {
                currentRef.removeEventListener('contextmenu', handleContextMenu);
            }
        };
    }, []);

    return (
        <div className={styles["SingleChatPage"]}>
            <div className={styles["SingleChatPage-content"]}>
                <div className={styles["SingleChatPage-content-left"]}>
                    <SingleChatPageHeader messageCount={chatData.totalMessages} isSidebarOpen={isSidebarOpen} onSidebarToggle={handleSidebarToggle} />
                    <div className={styles["SingleChatPage-content-left-chatView"]}>
                        {PageMode === "chat" ?
                            <div className={styles["SingleChatPage-content-left-chatView-chat"]} ref={leftContentRef}>
                                <div className={styles["SingleChatPage-content-left-chatView-chat-messages"]}>
                                    <SingleChatPageMessages isSidebarOpen={isSidebarOpen} />
                                </div>
                                <div className={styles['SingleChatPage-content-left-chatView-chat-messagesInput']}>
                                    {
                                     selectedMessagesSelectors.getHandleMessagesSelector.length > 1 || selectedMessagesSelectors.getHandleMessagesSelector[0] > 0 ?
                                            <HighlightedMessages /> :
                                            <MessageInput
                                                onEmojiToggle={handleEmojiToggle}
                                                handleEmojiSelect={handleEmojiSelect}
                                            />
                                    }
                                </div>
                            </div>
                            :
                            <Outlet />
                        }
                    </div>
                </div>
                <SingleChatPageSidebar
                    chatData={chatData}
                    isOpen={isSidebarOpen}
                    onClose={handleSidebarToggle}
                />
                {isEmojiSidebarOpen && (
                    <SingleChatPageEmojiSidebar
                        isOpen={isEmojiSidebarOpen}
                        onEmojiSelect={handleEmojiSelect}
                        onClose={handleEmojiToggle}
                    />
                )}
            </div>
        </div>
    );
};

export default SingleChatPage;