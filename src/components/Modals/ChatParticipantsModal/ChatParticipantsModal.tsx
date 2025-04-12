import Modal from "../../UI/Modal/Modal";
import styles from "./style.module.scss";
import SearchIcon from "../../../assets/icons/search.svg";
import XMarkIcon from "../../../assets/icons/x-mark.svg";
import classNames from "classnames";
import { FC, useMemo, useState } from "react";

import ExampleAvatar from "../../../assets/avatar-example.jpeg";
import { ChatUserType } from "../../../utils/types/ChatTypes";
import useChats from "../../../utils/hooks/Chats/useChats";

interface ChatParticipantsModalProps {
    isOpen: boolean;
    onClose: () => void;
    participants: ChatUserType[];
    existingParticipants: ChatUserType[];
    chatId: number
}


const ChatParticipantsModal: FC<ChatParticipantsModalProps> = ({
                                                                   isOpen,
                                                                   onClose,
                                                                   participants,
                                                                   existingParticipants,
                                                                   chatId
                                                               }) => {
    const {addNewUsersToChat}=useChats()

    const [searchQuery, setSearchQuery] = useState("")
    const [addedParticipants, setAddedParticipants] = useState<ChatUserType[]>([]);


    const memoizedValues = useMemo(() => {
        const isEveryoneAdded = participants.length === existingParticipants.length &&
            participants.every(participant =>
                existingParticipants.some(existing => existing.email === participant.email));

                const filteredParticipants = participants
                .filter(participant =>
                    !addedParticipants.some(addedParticipant => addedParticipant.id === participant.id) &&
                    !existingParticipants.some(addedParticipant => addedParticipant.id === participant.id)
                )
                .filter(participant => {
                    const firstName = participant.firstName || ''; 
                    const lastName = participant.lastName || '';   
                    const isParticipantRight = `${firstName.toLowerCase()} ${lastName.toLowerCase()}`.includes(searchQuery.toLowerCase());
                    
                    return isParticipantRight; 
                });


        return { isEveryoneAdded, filteredParticipants }
    }, [participants.length, chatId])

    const handleCancel = () => {
        setSearchQuery('')
        setAddedParticipants([])
        onClose()
    }
    const handleConfirm = () => {
        const userIds = addedParticipants.map(addedParticipant => addedParticipant.id)    
        addNewUsersToChat({userIds: userIds, chatId: chatId})
    }
    const handleAddParticipant = (participant: ChatUserType) => {
        setAddedParticipants(prevState => [...prevState, participant])
    }
    const handleRemoveParticipant = (id: number) => {
        setAddedParticipants((prev) => prev.filter((p) => p.id !== id));
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <h3 className={styles["modal-title"]}>Добавьте участников</h3>
            {addedParticipants.length > 0 ? (
                <ul className={styles["modal-additions"]}>
                    {addedParticipants.map((participant) => (
                        <li
                            className={styles["modal-additions-item"]}
                            key={participant.id}
                            onClick={() => handleRemoveParticipant(participant.id)}
                        >
                            <div className={styles["item-wrapper"]}>
                                {" "}
                                <img
                                    className={styles["item-wrapper-img"]}
                                    src={participant.avatar || ExampleAvatar}
                                    alt=""
                                />{" "}
                                <img
                                    src={XMarkIcon}
                                    alt=""
                                    className={styles["remove-icon"]}
                                    onClick={() => handleRemoveParticipant(participant.id)}
                                />
                            </div>

                            {participant.firstName ? participant.firstName : participant.email}
                        </li>
                    ))}
                    <input
                        onChange={event => setSearchQuery(event.target.value)}
                        value={searchQuery}
                        className={styles["modal-additions-search"]}
                        type="search" />
                </ul>
            ) : (
                <div className={styles["modal-wrapper"]}>
                    <input
                        className={styles["modal-wrapper-search"]}
                        type="search"
                        placeholder="Найти"
                        onChange={event => setSearchQuery(event.target.value)}
                        value={searchQuery}
                    />
                    <img
                        className={styles["modal-wrapper-icon"]}
                        src={SearchIcon}
                        alt=""
                    />
                </div>
            )}
            <div className={styles["modal-outline"]}>
                {memoizedValues.isEveryoneAdded ?
                    <p>Выглядит так будто бы все уже добавлены</p>
                    :
                    <ul className={styles["modal-list"]}>
                        {memoizedValues.filteredParticipants.length > 0 ? memoizedValues.filteredParticipants.map((participant) => {
                            return (
                                <li
                                    key={participant.id}
                                    className={styles["modal-list-item"]}
                                    onClick={() => handleAddParticipant(participant)}
                                >
                                    <img
                                        className={styles["modal-list-item-avatar"]}
                                        src={participant.avatar || ExampleAvatar}
                                        alt=""
                                    />
                                    <div className={styles["modal-list-item-info"]}>
                                        {" "}
                                        <h4
                                            className={styles["info-name"]}
                                        >{`${participant.firstName} ${participant.lastName}`}</h4>
                                        {/*<p className={styles["info-position"]}>*/}
                                        {/*    {participant.position}*/}
                                        {/*</p>*/}
                                    </div>
                                </li>
                            );
                        }) :
                            <p>Никого не найдено</p>
                        }
                    </ul>
                }

            </div>

            <div className={styles["modal-buttons"]}>
                <button onClick={handleCancel} className={styles["modal-buttons-btn"]} type="button">
                    Отмена
                </button>
                <button
                    onClick={handleConfirm}
                    className={classNames(styles["modal-buttons-btn"], styles["text-blue"])}
                    type="button"
                >
                    Далее
                </button>
            </div>
        </Modal>
    );
};

export default ChatParticipantsModal;
