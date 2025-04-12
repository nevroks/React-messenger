import { FC } from "react";
import Modal from "../../UI/Modal/Modal";
import useCompany from "../../../utils/hooks/useCompany";
import CopyIco from "./../../../assets/icons/copy.svg";
import CloseIco from "./../../../assets/icons/close.svg";
import styles from "./style.module.scss";
type InviteTeamModalPropsType = {
    isOpen: boolean,
    onClose: () => void
}

const InviteTeamModal: FC<InviteTeamModalPropsType> = ({ isOpen, onClose }) => {

    const { companyData, isCompanyDataPending } = useCompany()

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className={styles['InviteTeamModal-content']}>
                <button onClick={onClose} className={styles['InviteTeamModal-content-close']}><img src={CloseIco} alt="" /></button>
                <h2 className={styles['InviteTeamModal-content-title']}>Пригласить в команду</h2>
                <p>Пригласить пользователя в команду</p>
                <div className={styles['InviteTeamModal-content-copy']}>
                    <p className={styles['InviteTeamModal-content-copy-text']}>Код: <span>{isCompanyDataPending ? "Загрузка..." : companyData!.companyCode}</span></p>
                    <button
                        disabled={isCompanyDataPending || !companyData}
                        onClick={() => navigator.clipboard.writeText(companyData!.companyCode)}
                        className={styles['InviteTeamModal-content-copy-button']}
                    >
                        <img src={CopyIco} alt="" />
                    </button>
                </div>
            </div>
        </Modal>
    );
};
export default InviteTeamModal;