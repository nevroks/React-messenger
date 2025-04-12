import { FC } from "react";
import Modal from "../../UI/Modal/Modal";
import { ChatUserType } from "../../../utils/types/ChatTypes";
import useChats from "../../../utils/hooks/Chats/useChats";


type ExcludeChatParticipantsModalPropsType = {
    isOpen: boolean;
    onClose: () => void;
    participantToExclude: ChatUserType;
    chatId: number;
}

const ExcludeChatParticipantsModal: FC<ExcludeChatParticipantsModalPropsType> = ({ isOpen, onClose, participantToExclude, chatId }) => {
    const {excludeUsersFromChat}=useChats()
    const handleExclude = () => {
        excludeUsersFromChat({ chatId: chatId, userIds: [participantToExclude.id] })        
        onClose()
    }
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <p>вот этого лоха {participantToExclude.email}?</p>
            <button onClick={handleExclude}>Точно?</button>
        </Modal>
    );
};
export default ExcludeChatParticipantsModal;