import { Dispatch, FC, SetStateAction, useRef, useState } from "react";
import Popover from "../Popover/Popover";
import styles from "./style.module.scss";

// ICONS
import PaperclipIcon from "../../../assets/icons/paperclip-2.svg";
import GalleryIcon from "../../../assets/icons/gallery.svg";
import DocumentIcon from "../../../assets/icons/document.svg";
import SurveyIcon from "../../../assets/icons/chart-2.svg";
import GeoIcon from "../../../assets/icons/location.svg";
import GenerationIcon from "../../../assets/icons/cpu_2.svg";
import UploadFilesModal from "../../Modals/UploadFilesModal/UploadFilesModal";


const AttacmentPopoverOptions = [
    { text: "Фото или видео", attacmentType: "photoVideo", icon: GalleryIcon },
    { text: "Документ", attacmentType: "document", icon: DocumentIcon },
    { text: "Создать опрос", attacmentType: "survey", icon: SurveyIcon },
    { text: "Геопозиция", attacmentType: "geo", icon: GeoIcon },
    { text: "Генерация сообщений", attacmentType: "generation", icon: GenerationIcon },
];

type MessageInputAttachementsPropsType = {
    files: FileList | null;
    setFiles:Dispatch<SetStateAction<FileList | null>>
}

const MessageInputAttachements: FC<MessageInputAttachementsPropsType> = ({files, setFiles}) => {
    const [isAttachmentPopoverVisible, setIsAttachmentPopoverVisible] = useState(false);
    const popOverRef = useRef<HTMLButtonElement | null>(null)
    const [selectedAttacmentType, setSelectedAttacmentType] = useState<string>("");
    const [isUploadFilesModalVisible,setIsUploadFilesModalVisible]=useState(false)


    return (
        <div className={styles["dropdown-container"]}>
            <button ref={popOverRef} type="button" onClick={() => setIsAttachmentPopoverVisible(true)}>
                <img src={PaperclipIcon} alt="Attach" />
            </button>
            <Popover transformOrigin={{ vertical: "bottom", horizontal: "left" }} anchorPosition={{ top: -240, left: 0 }} isOpen={isAttachmentPopoverVisible} anchorRef={popOverRef} onClose={() => setIsAttachmentPopoverVisible(false)}>
                <div className={styles["file-dropdown"]}>
                    {AttacmentPopoverOptions.map((item) => (
                        <div key={item.attacmentType} onClick={() => {
                            setSelectedAttacmentType(item.attacmentType)
                            setIsAttachmentPopoverVisible(false)
                            setIsUploadFilesModalVisible(true)
                        }} className={styles["dropdown-item"]}>
                            <img src={item.icon} alt={item.text} /> <p>{item.text}</p>
                        </div>
                    ))}
                </div>
            </Popover>
            <UploadFilesModal files={files} setFiles={setFiles} isOpen={isUploadFilesModalVisible} onClose={() => setIsUploadFilesModalVisible(false)} attacmentType={selectedAttacmentType}/>
        </div>
    );
};
export default MessageInputAttachements