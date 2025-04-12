import React, { useEffect, useRef, useState } from 'react';
import styles from './style.module.scss';

// ICONS
import SearchIcon from '../../../../assets/icons/search.svg';
import SidebarIcon from '../../../../assets/icons/sidebar.svg';
import SidebarOpenIcon from '../../../../assets/icons/sidebar-open.svg';
import MoreIcon from '../../../../assets/icons/more.svg';
import SmsStarIcon from '../../../../assets/icons/sms-star.svg';
import StarIcon from '../../../../assets/icons/star.svg';
import CpuIcon from '../../../../assets/icons/cpu.svg';
import Popover from '../../../../components/UI/Popover/Popover';
import { useDebounce } from '../../../../utils/hooks/useDebounce';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { APP_PATHS } from '../../../../utils/consts/AppConsts';

interface SingleChatPageHeaderProps {
    messageCount: number;
    isSidebarOpen: boolean;
    onSidebarToggle: () => void;
}

const SingleChatPageHeader: React.FC<SingleChatPageHeaderProps> = ({
    messageCount,
    isSidebarOpen,
    onSidebarToggle,
}) => {

    const {id:chatId}=useParams()
    const anchorRef = useRef<HTMLButtonElement | null>(null);
    const [isSearchPopoverOpen, setIsSearchPopoverOpen] = useState(false);
  
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate()
    const deboucedSearchQuery = useDebounce(searchQuery, 300);
    const [urlSearchQuery, setUrlSearchQuery] = useSearchParams();

    const handleSearchClick = () => {
        setIsSearchPopoverOpen((prev) => !prev);
    };


    useEffect(() => {
        if (isSearchPopoverOpen) {
            if (deboucedSearchQuery.length === 0) {
                navigate(`${APP_PATHS.CHAT_PAGE}/${chatId}`)
            } else {
                navigate("search")
                setUrlSearchQuery({ search: deboucedSearchQuery })
                
            }
        }

    }, [deboucedSearchQuery]);

    return (
        <div className={styles['chat-header']}>
            <div className={styles['left-side-body']}>
                {/* <div className={styles['chat-avatar']}>{generateAvatar(chatTitle)}</div> */}
                <div className={styles['chat-info']}>
                    {/* <h2 className={styles['chat-title']}>{chatTitle}</h2> */}
                    <span className={styles['message-count']}>
                        {messageCount} {messageCount === 1 ? 'сообщение' : 'сообщений'}
                    </span>
                </div>
            </div>
            <div className={styles['chat-actions']}>
                <button aria-label="CPU">
                    <img src={CpuIcon} alt="CPU" />
                </button>
                <button aria-label="Star">
                    <img src={StarIcon} alt="Star" />
                </button>
                <button aria-label="">
                    <img src={SmsStarIcon} alt="" />
                </button>
                <button onClick={handleSearchClick} ref={anchorRef} aria-label="Toggle Search">
                    <img src={SearchIcon} alt="Search" />
                </button>
                <button className={styles['sidebar-button']} onClick={onSidebarToggle}>
                    <img src={isSidebarOpen ? SidebarOpenIcon : SidebarIcon} alt="Sidebar" />
                </button>
                <button className={styles['more']}>
                    <img src={MoreIcon} alt="More" />
                </button>
            </div>
            <Popover
                isOpen={isSearchPopoverOpen}
                anchorRef={anchorRef}
                anchorPosition={{ top: 116, left: 0 }}
                onClose={() => setIsSearchPopoverOpen(false)}
                className={styles['full-width']} 
            >
                <div className={styles['search-input-container']}>
                    <img src={SearchIcon} alt="Search" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={event => setSearchQuery(event.target.value)}
                        placeholder="Поиск сообщений..."
                        className={styles['search-input']}
                    />
                </div>
            </Popover>


        </div>
    );
};

export default SingleChatPageHeader;