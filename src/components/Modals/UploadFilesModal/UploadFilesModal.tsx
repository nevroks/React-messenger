import { Dispatch, FC, SetStateAction, useRef, useState } from "react"
import Modal from "../../UI/Modal/Modal"
import styles from "./style.module.scss"

type UploadFilesModalPropsType = {
    isOpen: boolean,
    onClose: () => void,
    attacmentType: string;
    files: FileList | null;
    setFiles: Dispatch<SetStateAction<FileList | null>>
}
const UploadFilesModal: FC<UploadFilesModalPropsType> = ({ isOpen, onClose, attacmentType, files, setFiles }) => {
    const FileInputRef = useRef<HTMLInputElement | null>(null)
    const [filesToApply,setFilesToApply]=useState<FileList | null>(null)

    const handleApply=()=>{
        setFiles(filesToApply)
    }
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className={styles['modal-upload']}>
                <p className={styles["text"]}>Загрузите {attacmentType}</p>
                <div>
                    <button className={styles['button']} onClick={() => FileInputRef.current?.click()}>Выбрать файл</button>
                    {filesToApply !== null && filesToApply?.length !== 0 && Array.from(filesToApply).map((file) => {
                        return <p className={styles['file-name']} key={file.name}>{file.name}</p>
                    })}
                    <input ref={FileInputRef} type="file" multiple hidden onChange={(e) => setFilesToApply(e.target.files)} />
                </div>
                <button className={styles['button']} disabled={filesToApply === null || filesToApply?.length === 0} onClick={handleApply}>Выбрать</button>
            </div>
        </Modal>
    )
}

export default UploadFilesModal