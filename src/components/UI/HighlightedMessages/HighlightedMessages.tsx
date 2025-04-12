import { useMessagesStore } from '../../../stores/Messages/MessagesStore';
import styles from './style.module.scss';


const HighlightedMessages = () => {

const {actions,selectors}=useMessagesStore()

const clearHandleMessag=()=>{    
    actions.ClearSelectedMessagesAction()
}

    return (
        <div className={styles["highlightedmessages"]}>
            <div className={styles["highlightedmessages-box"]}>
                <div className={styles["highlightedmessages-item"]}>
                    <div className={styles["highlightedmessages-text"]}>Переслать</div>
                    {selectors.getHandleMessagesSelector.length}
                </div>
                <div className={styles["highlightedmessages-item"]}>
                    <div className={styles["highlightedmessages-text"]}>Удалить</div>
                    {selectors.getHandleMessagesSelector.length}
                </div>
            </div>
            <div className={styles["highlightedmessages-cancellation"]}>
                <div onClick={clearHandleMessag} className={styles["highlightedmessages-text"]}>Отмена</div>
            </div>
        </div>
    )
}


export default HighlightedMessages