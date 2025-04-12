import { FC } from 'react'
import { MessageType, MessageTypeType } from '../../utils/types/MessagesTypes'
import styles from './style.module.scss'
import DocumentIcon from '../../assets/icons/document.svg';
type MessageItemContentPropsType = {
  message: MessageType<"text" | "poll" | "video" | "voice">
}

const MessageItemContent: FC<MessageItemContentPropsType> = ({ message }) => {


  switch (message.type as MessageTypeType) {
    case 'text':
      const typedMessage = message as MessageType<"text">;
      
      const imgs = typedMessage.attachments ? typedMessage.attachments.map((item) => {
        return item.attachmentType==="image" ? item.link : null
      }) : null
      
      const anotherAttachments = typedMessage.attachments ? typedMessage.attachments.filter((item) => item.attachmentType!=="image") : null
      // console.log(anotherAttachments);
      
      return <div className={styles["MessageItemContent"]}>
        <div>
          {(imgs !== null) && imgs!.map((item) => {
            console.log(item);
            if(item === null) return
            return <img src={item!} alt="" />
          })}
        </div>
        <p>{typedMessage.textMessage.content}</p>
        <div>
          {anotherAttachments?.filter((item) => item.attachmentType === 'file').map((item) => {
            return <div key={item.key} className={styles['doc-wrapper']}>
              <img className={styles['icon']} src={DocumentIcon}/>
              <a href={item.link}>{item.key}</a>
            </div>
          })}
        </div>
      </div>

    case 'voice':
      return <div>MessageItemContent</div>
    case 'video':
      return <div>MessageItemContent</div>
  }
  return (
    <div>MessageItemContent</div>
  )
}

export default MessageItemContent