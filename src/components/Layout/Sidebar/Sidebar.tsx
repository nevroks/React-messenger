import React, { useMemo, useState, useRef } from "react";
import { useDebounce } from "../../../utils/hooks/useDebounce";
import styles from "./style.module.scss";


// ICONS
import RevampIcon from "../../../assets/revamp-it.svg";
import NotifyIcon from "../../../assets/icons/notification.svg";
import CallIcon from "../../../assets/icons/call-calling.svg";
import SearchIcon from "../../../assets/icons/search.svg";
import ArrowDownIcon from "../../../assets/icons/arrow-down.svg";
import PersonalIcon from "../../../assets/icons/personal.svg";
import AddIcon from "../../../assets/icons/add-square.svg";
// import DeviceIcon from "../../../assets/icons/device-message.svg";
import SecurUserIcon from "../../../assets/icons/security-user.svg";
import VolumeSlashIcon from '../../../assets/icons/volume-slash.svg';
import ClockIcon from '../../../assets/icons/clock.svg';
import CPUIcon from '../../../assets/icons/cpu_2.svg';
import UserCountIco from "./../../../assets/icons/user-count.svg";

import { NavLink } from "react-router-dom";

import Popover from "../../UI/Popover/Popover.tsx";
import TimePopover from "../../TimePopover/TimePopover.tsx";
import { useChatsStore } from "../../../stores/ChatsStore";
import CreateNewChatModal from "../../Modals/CreateNewChatModal/CreateNewChatModal.tsx";
import ChatsSkelets from "../../Skelets/ChatsSkelets/ChatsSkelets.tsx";

import { useMessagesStore } from "../../../stores/Messages/MessagesStore/index.ts";
import { useJWTTokenStore } from "../../../stores/JWTStore/index.ts";
import { Chat } from "../../../utils/types/ChatTypes.ts";
import useCompany from "../../../utils/hooks/useCompany.ts";
import classNames from "classnames";

const Sidebar = () => {
    const { selectors } = useChatsStore();
    const { selectors: select } = useMessagesStore();


    const { companyData, isCompanyDataPending } = useCompany()

    const [searchTerm, setSearchTerm] = useState("");
    const debouncedSearchTerm = useDebounce(searchTerm, 300);
    const [isCreateChatOpen, setIsCreateChatOpen] = useState(false);
    const anchorRef = useRef(null);

    const { selectors: { getChatsIsFetchedSelector: isChatsFetched, getAllChatsSelector: chats } } = useChatsStore();

    const [isPopoverOpen, setIsPopoverOpen] = useState(false);
    const [isTimePopoverOpen, setIsTimePopoverOpen] = useState(false);

    const { setCurrentJWTAccessTokenAction: resetToken } = useJWTTokenStore()



    const messages = select.getLastMessagesSelector()



    const filteredChats = useMemo(() => {
        if (isChatsFetched && chats.length > 0) {
            return chats.map((chat: Chat) => {
                const lastMessage = messages.find(message =>
                    Array.isArray(message?.chatId) ?
                        message.chatId.includes(chat.id) :
                        message?.chatId === chat.id
                );
                return {
                    ...chat,
                    lastMessage: lastMessage ? lastMessage : undefined,
                };
            }).filter((chat) =>
                chat.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
            );
        } else {
            return [];
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [chats, messages, debouncedSearchTerm, isChatsFetched, select.getLastMessagesSelector]);




    const generateAvatar = (chatName: string) => {
        const words = chatName.split(" ");
        const initials = words.map((word) => word.charAt(0).toUpperCase()).join("");
        return initials.substring(0, 2);
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    const highlightSearchTerm = (text: string, term: string) => {
        const parts = text.split(new RegExp(`(${term})`, "gi"));
        return (
            <>
                {parts.map((part, index) =>
                    part.toLowerCase() === term.toLowerCase() ? (
                        <span key={index} style={{ backgroundColor: "#ffff00" }}>
                            {part}
                        </span>
                    ) : (
                        part
                    )
                )}
            </>
        );
    };

    const handleClick = () => {
        setIsTimePopoverOpen(false);
        setIsPopoverOpen(prev => !prev);

    };

    const handleTimePopoverClick = (event: React.MouseEvent<HTMLElement>) => {
        event.stopPropagation();
        setIsTimePopoverOpen(prev => !prev);
        setIsPopoverOpen(false);
    };


    const handleClose = () => {
        setIsTimePopoverOpen(false);
        setIsPopoverOpen(false);
    };

    return (
        <div className={styles["chat-sidebar"]}>
            <div className={styles["workspace-bar"]}>
                <div className={styles["workspace-info"]}>
                    <img src={RevampIcon} alt="" />
                    <div className={styles.info}>
                        <p>Рабочее пространство</p>
                        <h3>{isCompanyDataPending ? "Имя" : companyData!.name}</h3>
                    </div>
                </div>
                <div className={styles.notify} onClick={handleClick} ref={anchorRef}>
                    <img src={NotifyIcon} alt="" />
                    <Popover
                        isOpen={isPopoverOpen}
                        anchorRef={anchorRef}
                        onClose={handleClose}
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    >
                        <ul className={styles["list"]}>
                            <li className={styles["list-item"]}>
                                <img className={styles["list-item-icon"]} src={VolumeSlashIcon} alt="" />
                                Отключить уведомления
                            </li>
                            <li className={styles["list-item"]} onClick={handleTimePopoverClick}>
                                <img className={styles["list-item-icon"]} src={ClockIcon} alt="" />
                                Отключить на время
                            </li>
                        </ul>
                    </Popover>
                    {isTimePopoverOpen && (
                        <TimePopover
                            isOpen={isTimePopoverOpen}
                            anchorRef={anchorRef}
                            onClose={handleClose} />
                    )}
                </div>
            </div>
            <div className={styles.actions}>
                <button onClick={() => resetToken("")} className={styles["create-call"]}>
                    <img src={CallIcon} alt="" />
                    <p>Создать конференцию</p>
                </button>
                <div className={styles["search-field"]}>
                    <input
                        type="text"
                        placeholder="Найти"
                        value={searchTerm}
                        onChange={handleSearchChange}
                    />
                    <img src={SearchIcon} alt="" />
                </div>
            </div>
            <div className={styles["chats-sections"]}>
                <div className={styles["selected-chats"]}>
                    <h4 className={styles["chat-type-title"]}>
                        ИЗБРАННЫЕ <img src={ArrowDownIcon} alt="" />
                    </h4>
                    <div className={styles["selected-chats-list"]}>
                        <div className={styles["chat-item"]}>
                            <div className={styles["chat-avatar"]}>
                                <img src={PersonalIcon} alt="" />
                            </div>
                            <div className={styles["chat-info"]}>
                                <h4>Личное</h4>
                                <p className={styles["chat-dsc"]}>Это ваш личный чат!</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={styles["all-chats"]}>
                    <div className={styles["chat-title"]}>
                        <h4 className={styles["chat-type-title"]}>
                            ВСЕ ЧАТЫ <img src={ArrowDownIcon} alt="" />
                        </h4>
                        <button
                            className={styles["create-chat-button"]}
                            onClick={() => setIsCreateChatOpen(true)}
                        >
                            <img src={AddIcon} alt="" />
                        </button>
                    </div>
                    <div className={styles["all-chats-list"]}>
                        {!selectors.getChatsIsFetchedSelector ? (
                            <div className={styles['message-skeleton-container']}>
                                {Array.from({ length: 6 }, (_, index) => (
                                    <div className={styles['message-skeleton-box']} key={`skeleton-${index}`}>
                                        <ChatsSkelets className={styles['message-skeleton']} />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            filteredChats.map(chat => {
                                return (
                                    <div key={chat.id} className={styles["chat-item"]}>
                                        <NavLink
                                            className={({ isActive }) => classNames(styles["chat-item-body"], {
                                                [styles.active]: isActive
                                            })}
                                            to={`/chat/${chat.id}`}
                                        >
                                            <div className={styles["chat-avatar"]}>
                                                {generateAvatar(chat.title)}
                                            </div>
                                            <div className={styles["chat-details"]}>
                                                <h4>
                                                    {highlightSearchTerm(chat.title, debouncedSearchTerm)}
                                                </h4>
                                                <div className={styles["last-child"]}>
                                                    <p>
                                                        {chat.lastMessage?.lastMessage
                                                            ? (chat.lastMessage.lastMessage.length > 20
                                                                ? chat.lastMessage.lastMessage.slice(0, 20) + '...'
                                                                : chat.lastMessage.lastMessage)
                                                            : ''}
                                                    </p>
                                                    <div className={styles["number-people"]}>
                                                        <img alt="" src={UserCountIco} />
                                                        <span>{chat.users.length}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </NavLink>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            </div>
            <div className={styles["bottom-side"]}>
                <div className={styles["bottom-body"]}>

                    {/* <div className={styles["bottom-item"]}>
                        <div className={styles["pic"]}>
                            <img src={DeviceIcon} alt=""/>
                        </div>
                        <div>
                            <p>Комментарии</p>
                            <span>Нет новых</span>
                        </div>
                    </div> */}

                    <div className={styles["bottom-item"]}>
                        <div className={styles["pic"]}>
                            <img src={CPUIcon} alt="" />
                        </div>
                        <div>
                            <p>ИИ-чат</p>
                            <span>Нет новых</span>
                        </div>
                    </div>

                    <div className={styles["bottom-item"]}>
                        <div className={styles["pic"]}>
                            <img src={SecurUserIcon} alt="" />
                        </div>
                        <div>
                            <p>Служба поддержки</p>
                            <span>Личный менеджер</span>
                        </div>
                    </div>
                </div>
            </div>
            <CreateNewChatModal isOpen={isCreateChatOpen} onClose={() => setIsCreateChatOpen(false)} />
        </div>
    );
};

export default Sidebar;