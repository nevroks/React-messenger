import classes from "./style.module.scss";
import { Dispatch, FC, SetStateAction, useState } from "react";


// ICONS
import CloseIcon from '../../../../assets/icons/close.svg';
import SettingIcon from '../../../../assets/icons/setting-2.svg';
import logout from '../../../../assets/icons/logout.svg';
import NotifyIcon from '../../../../assets/icons/notify.svg';
import GalleryIcon from '../../../../assets/icons/gallery.svg';
import VideoIcon from '../../../../assets/icons/video-square.svg';
import DocumentIcon from '../../../../assets/icons/document.svg';
import MicrophoneIcon from '../../../../assets/icons/microphone.svg';
import LinkIcon from '../../../../assets/icons/link.svg';
import UsersIcon from '../../../../assets/icons/participants.svg';
import AddUserIcon from '../../../../assets/icons/add-user-2.svg';
import Switch from "../../../../components/UI/Switch/Switch.tsx";

import { SingleChatPageSidebarDataType, SingleChatPageSidebarModeType } from "./SingleChatPageSidebar.tsx";
import ChatParticipantsModal from "../../../../components/Modals/ChatParticipantsModal/ChatParticipantsModal.tsx";
import { useQuery } from "@tanstack/react-query";
import { useUserDataStore } from "../../../../stores/UserDataStore";
import { getCompanyUsersList } from "../../../../utils/services/usersRest.service.ts";

type SingleChatPageSidebarInfoSideBarPropsType = {
    onClose: () => void;
    setSelectedTab: Dispatch<SetStateAction<SingleChatPageSidebarModeType>>;
    setSelectedParticipant: Dispatch<SetStateAction<ChatUserType | null>>;
    sideBarData: SingleChatPageSidebarDataType,
    isOpen?: boolean
}
import { ChatUserType } from "../../../../utils/types/ChatTypes.ts";
import useChats from "../../../../utils/hooks/Chats/useChats.ts";
import Button from "../../../../components/UI/Button/Button.tsx";


const SingleChatPageSidebarInfoSideBar: FC<SingleChatPageSidebarInfoSideBarPropsType> = ({
    onClose,
    setSelectedTab,
    setSelectedParticipant,
    sideBarData,
    isOpen
}) => {



    const { selectors: userDataSelectors } = useUserDataStore()
    const { leaveFromChat } = useChats()

    const { isLoading, error, data: companyParticipants } = useQuery({
        queryKey: ['companyData', userDataSelectors.getUserCompaniesSelector[0]],
        queryFn: () => getCompanyUsersList(userDataSelectors.getUserCompaniesSelector[0]),
    })

    const [isAddUserModalVisible, setIsAddUserModalVisible] = useState(false)

    const [isOnNotifications, setIsOnIsOnNotifications] = useState(false)

    return (
        <div>
            <div className={classes['top']}>
                <p>Информация о чате</p>
                <button className={classes['close-button']} onClick={onClose}>
                    <img src={CloseIcon} alt="Close" />
                </button>
            </div>
            <div className={classes['top-content']}>
                <div className={classes['left-side']}>
                    <div className={classes['chat-avatar']}>
                        {/* {sideBarData.title} */}
                    </div>
                    <div>
                        <p className={classes['chat-title']}>{sideBarData.title}</p>
                        {/* <span>{sideBarData.participants.length} участников</span> */}
                    </div>
                </div>
                <button>
                    <img src={SettingIcon} alt="Settings" />
                </button>
            </div>

            <div className={classes['media-info-content']}>
                <div className={classes['first-child']}>
                    <div className={classes['content']}>
                        <img src={NotifyIcon} alt="Notifications" />
                        <p>Уведомления</p>
                    </div>
                    <Switch isOn={isOnNotifications}
                        onToggle={() => setIsOnIsOnNotifications((prevState) => !prevState)} />
                </div>
                <div className={classes['second-container']}>
                    <div className={classes['container-item']} onClick={() => setSelectedTab('images')}>
                        <img src={GalleryIcon} alt="Images" />
                        <p>{sideBarData.attachmentCounts?.image}Изображения</p>
                    </div>
                    <div className={classes['container-item']} onClick={() => setSelectedTab('videos')}>
                        <img src={VideoIcon} alt="Videos" />
                        <p>{sideBarData.attachmentCounts?.video}Видеозаписей</p>
                    </div>
                    <div className={classes['container-item']} onClick={() => setSelectedTab('documents')}>
                        <img src={DocumentIcon} alt="Documents" />
                        <p>{sideBarData.attachmentCounts?.file}Документы</p>
                    </div>
                    <div className={classes['container-item']} onClick={() => setSelectedTab('voices')}>
                        <img src={MicrophoneIcon} alt="Voice messages" />
                        <p>{sideBarData.attachmentCounts?.audio}Голосовые сообщения</p>
                    </div>
                    <div className={classes['container-item']} onClick={() => setSelectedTab('links')}>
                        <img src={LinkIcon} alt="Links" />
                        <p>Ссылки</p>
                    </div>
                </div>
            </div>

            <div className={classes['participants-side']}>
                <div className={classes['participants-top']}>
                    <img src={UsersIcon} alt="Participants" />
                    <p>
                        {/* {sideBarData.participants.length} участников */}
                    </p>
                    <button onClick={() => setIsAddUserModalVisible(true)}>
                        <img src={AddUserIcon} alt="Add user" />
                    </button>
                </div>
                {sideBarData.participants.map((participant) => (
                    <div
                        key={participant.id}
                        className={classes['participant-item']}
                        onClick={() => {
                            if (userDataSelectors.getUserEmailSelector === participant.email) {
                                return
                            } else {
                                setSelectedTab("participant")
                                setSelectedParticipant(participant)
                            }
                        }}>
                        {participant.firstName ? participant.firstName : participant.email}
                    </div>
                ))}
            </div>
            {
                isOpen && <Button
                    icons={logout}
                    children='Покинуть чат'
                    positionIcons="left"
                    onClick={() => leaveFromChat({ chatId: sideBarData.chatId })}
                />
            }

            {!isLoading && !error &&
                <ChatParticipantsModal
                    chatId={sideBarData.chatId}
                    existingParticipants={sideBarData.participants}
                    participants={companyParticipants!}
                    isOpen={isAddUserModalVisible}
                    onClose={() => setIsAddUserModalVisible(false)}
                />
            }
        </div>
    );
};

export default SingleChatPageSidebarInfoSideBar;