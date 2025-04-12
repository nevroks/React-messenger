import React, { useMemo, useState } from 'react';
import SingleChatPageSidebarInfoSideBar from "./SingleChatPageSidebarInfoSideBar.tsx";
import SingleChatPageSidebarAttachments from "./SingleChatPageSidebarAttachments.tsx";
import classes from "./style.module.scss";
import cn from "classnames"

// ICONS
import BackIcon from "./../../../../assets/icons/arrow-down_2.svg";
import MoreIcon from "./../../../../assets/icons/more.svg"
import ExcludeChatParticipantsModal from '../../../../components/Modals/ExcludeChatParticipantsModal/ExcludeChatParticipantsModal.tsx';
import { Chat, ChatAttachmentCountsType, ChatUserType } from '../../../../utils/types/ChatTypes.ts';


interface SingleChatPageSidebarProps {
    isOpen: boolean;
    onClose: () => void;
    chatData: Chat
}

export type SingleChatPageSidebarModeType =
    'images'
    | 'videos'
    | 'documents'
    | 'voices'
    | 'links'
    | 'participant'
    | null
export type SingleChatPageSidebarDataType = {
    participants: ChatUserType[];
    title: string;
    messagesCount: number;
    chatId: number;
    attachmentCounts:ChatAttachmentCountsType;
}

const SingleChatPageSidebar: React.FC<SingleChatPageSidebarProps> = ({ isOpen, onClose, chatData }) => {

    const [selectedTab, setSelectedTab] = useState<SingleChatPageSidebarModeType>(null);
    const [selectedParticipant, setSelectedParticipant] = useState<ChatUserType | null>(null);
    
    const [isExcludeUserModalVisible, setIsExcludeUserModalVisible] = useState(false)
    
    const sideBarData: SingleChatPageSidebarDataType = useMemo(() => {
        const participants = chatData.users.map(user => {
            return {
                id: user.id,
                email: user.email,
                avatar: user.avatar,
                firstName: user.firstName,
                lastName: user.lastName,
                username: user.username,
            }
        })

        return {
            participants: participants,
            title: chatData.title,
            messagesCount: chatData.totalMessages,
            chatId: chatData.id,
            attachmentCounts:chatData.attachmentCounts
        }

    }, [chatData.id,chatData.users.length,chatData.attachmentCounts,chatData.totalMessages,chatData.title])

    const getSidebarComponent = () => {
        switch (selectedTab) {
            case null:
                return (
                    <SingleChatPageSidebarInfoSideBar
                        sideBarData={sideBarData}
                        setSelectedParticipant={setSelectedParticipant}
                        setSelectedTab={setSelectedTab}
                        onClose={onClose}
                        isOpen={isOpen}
                    />
                );
            case "participant":
                return (
                    <div className={classes['participant-profile']}>
                        <div className={classes['section-header']}>
                            <div className={classes['left-side']}>
                                <button className={classes['back-button']} onClick={() => {
                                    setSelectedTab(null)
                                    setSelectedParticipant(null)
                                }}>
                                    <img src={BackIcon} alt="Back" />
                                </button>
                                <p>Информация</p>
                            </div>
                            <img src={MoreIcon} alt="" />
                        </div>
                        <div className={classes['participant-info']}>
                            <img src='https://mdbcdn.b-cdn.net/img/new/avatars/2.webp' alt="Avatar"
                                className={classes['avatar']} />
                            <h3>{selectedParticipant?.firstName}</h3>
                            <p>{selectedParticipant?.username}</p>
                            <p>{selectedParticipant?.username}</p>
                            <p>{selectedParticipant?.email}</p>
                        </div>
                        <button onClick={()=>setIsExcludeUserModalVisible(true)}>Выгнать пидораса</button>
                        <ExcludeChatParticipantsModal
                            participantToExclude={selectedParticipant!}
                            isOpen={isExcludeUserModalVisible}
                            onClose={() => setIsExcludeUserModalVisible(false)}
                            chatId={sideBarData.chatId}
                        />
                    </div>
                )
            default:
                return (
                    <SingleChatPageSidebarAttachments
                        setSelectedTab={setSelectedTab}
                        selectedTab={selectedTab}
                    />
                );
        }
    };

    return <div className={cn(classes['info-sidebar'], {
        [classes.open]: isOpen
    })}>
        {getSidebarComponent()}
    </div>


};

export default SingleChatPageSidebar;
