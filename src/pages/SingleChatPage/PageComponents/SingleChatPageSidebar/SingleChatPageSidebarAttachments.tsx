import{Dispatch, FC, SetStateAction} from 'react';
import {SingleChatPageSidebarModeType} from "./SingleChatPageSidebar.tsx";
import styles from "./style.module.scss";

import BackIcon from "../../../../assets/icons/arrow-down_2.svg";

type SingleChatPageSidebarAttachmentsPropsType={
    selectedTab:SingleChatPageSidebarModeType;
    setSelectedTab: Dispatch<SetStateAction<SingleChatPageSidebarModeType>>;
}

const SingleChatPageSidebarAttachments:FC<SingleChatPageSidebarAttachmentsPropsType> = ({selectedTab,setSelectedTab}) => {

    const handleGoBack=()=>{
        setSelectedTab(null)
    }

    switch (selectedTab) {
        case 'images':
            return (
                <div className={styles['media-content-full']}>
                    <div className={styles['section-header']}>
                        <button className={styles['back-button']} onClick={handleGoBack}>
                            <img src={BackIcon} alt="Back"/>
                        </button>
                        <p>Изображения</p>
                    </div>
                </div>
            );
        case 'videos':
            return (
                <div className={styles['media-content-full']}>
                    <div className={styles['section-header']}>
                        <button className={styles['back-button']} onClick={handleGoBack}>
                            <img src={BackIcon} alt="Back"/>
                        </button>
                        <p>Видеозаписей</p>
                    </div>
                </div>
            );
        case 'documents':
            return (
                <div className={styles['media-content-full']}>
                    <div className={styles['section-header']}>
                        <button className={styles['back-button']} onClick={handleGoBack}>
                            <img src={BackIcon} alt="Back"/>
                        </button>
                        <p>Документы</p>
                    </div>
                </div>
            );
        case 'voices':
            return (
                <div className={styles['media-content-full']}>
                    <div className={styles['section-header']}>
                        <button className={styles['back-button']} onClick={handleGoBack}>
                            <img src={BackIcon} alt="Back"/>
                        </button>
                        <p>Голосовые сообщения</p>
                    </div>
                </div>
            );
        case 'links':
            return (
                <div className={styles['media-content-full']}>
                    <div className={styles['section-header']}>
                        <button className={styles['back-button']} onClick={handleGoBack}>
                            <img src={BackIcon} alt="Back"/>
                        </button>
                        <p>Ссылки</p>
                    </div>
                </div>
            );
    }
};

export default SingleChatPageSidebarAttachments;