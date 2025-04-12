import { FC, useState } from "react";
import Modal from "../../UI/Modal/Modal";

import { useUserDataStore } from "../../../stores/UserDataStore";

import classes from "./style.module.scss"
import cn from "classnames"
import Toast from "../../UI/Toast/Toast";
import Select, { SelectOptionType } from "../../UI/Select/Select";

import useChats from "../../../utils/hooks/Chats/useChats";
import { ChatTypeUserAbleToCreateType } from "../../../utils/types/ChatTypes";


type CreateNewChatModalPropsType = {
    isOpen: boolean;
    onClose: () => void;
}


const chatTypeSelectorValues: SelectOptionType<ChatTypeUserAbleToCreateType>[] = [
    {
        value: "public",
        text: "Групповой чат"
    }, {
        value: "private",
        text: "Личный чат"
    }
]


const CreateNewChatModal: FC<CreateNewChatModalPropsType> = ({
    isOpen,
    onClose,
}) => {
    const [chatTypeOption, setChatTypeOption] = useState<SelectOptionType<ChatTypeUserAbleToCreateType>>({
        value: "public",
        text: "Групповой чат"
    },)
    const [chatTitle, setChatTitle] = useState("");
    const { createNewChat } = useChats()
    const [error, setError] = useState<string | null>(null);
    const [isToastVisible, setIsToastVisible] = useState(false);


    const { selectors: userDataSelectors } = useUserDataStore();

    const companyId = userDataSelectors.getUserCompaniesSelector[0]

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (chatTitle.trim() === "") {
            setError("Chat title cannot be empty");
            return;
        }

        try {
            createNewChat({ chatType: chatTypeOption.value, companyId: companyId, title: chatTitle })
        } catch (error) {
            console.warn(error)
            setError("Failed to create chat. Please try again.");
        } finally {
            onClose();
            setChatTitle("");
            setError(null);
            setIsToastVisible(true);
        }
    }


    return (
        <>
            <Modal isOpen={isOpen} onClose={onClose}>
                <div
                    className={classes['create-chat-modal-content']}>
                    <button className={classes['modal-close-button']} onClick={onClose}>
                        &times;
                    </button>
                    <h2>Create a New Chat</h2>
                    <Select selectedOption={chatTypeOption} setSelectedOption={setChatTypeOption} optionsArr={chatTypeSelectorValues}>
                        <Select.Button defaultText="Выберите тип чата" />
                        <Select.Menu>
                            {chatTypeSelectorValues.map((chatTypeSelectorValue, index) => {
                                return <Select.Menu.Option option={chatTypeSelectorValue} key={index} />
                            })}
                        </Select.Menu>
                    </Select>
                    <form
                        onSubmit={handleSubmit}
                        className={cn(classes["create-chat-form"], {
                            [classes.error]: error
                        })}
                    >
                        <input
                            type="text"
                            value={chatTitle}
                            onChange={(e) => setChatTitle(e.target.value)}
                            placeholder="Enter chat title"
                            className={classes['chat-title-input']}
                        />
                        {error && <p className={classes['error-message']}>{error}</p>}
                        <button type="submit" className={classes['create-chat-button']}>
                            Create Chat
                        </button>
                    </form>
                </div>
            </Modal>
            {isToastVisible && (
                <Toast
                    message="Chat created successfully!"
                    onClose={() => setIsToastVisible(false)}
                />
            )}
        </>
    );
};
export default CreateNewChatModal;