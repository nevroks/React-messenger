import React, { useRef, useState, useEffect, useCallback } from "react";

import { motion } from 'framer-motion';
import ContextMenu from '../UI/ContextMenu/ContextMenu';
import styles from './style.module.scss';
import { useMessagesStore } from "../../stores/Messages/MessagesStore";
import { useUserDataStore } from '../../stores/UserDataStore';
import MessageItemContent from "./MessageItemContent";
import { MessageType } from "../../utils/types/MessagesTypes";


interface MessageItemProps {
  message: MessageType<"text" | "poll" | "video" | "voice">;
  onUserClick: (userId: string) => void;
  pinnedMessageId: string | null;
  contextMenuMessageId: string | null;
  setContextMenuMessageId: (messageId: string | null) => void;
  onDelete: () => void;
  onEdit: () => void;
  onSelect: () => void;
  onPin: () => void;
  onReply: () => void;
  replyId: number | undefined;
  selectedMessages: number[];
  vieved: (node?: Element | null | undefined) => void;
}

const MessageItem: React.FC<MessageItemProps> = ({
  message,
  onUserClick,
  pinnedMessageId,
  contextMenuMessageId,
  setContextMenuMessageId,
  onDelete,
  onEdit,
  onSelect,
  onPin,
  onReply,
  replyId,
  selectedMessages,
  vieved
}) => {
  const [contextMenuPosition, setContextMenuPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const messageBodyRef = useRef<HTMLDivElement>(null);
  const contextMenuRef = useRef<HTMLDivElement>(null);

  const { selectors: userDataSelectors } = useUserDataStore()
  // const { addReaction } = useMessages();


  const { selectors,actions } = useMessagesStore();

  const handleRightClick = (e: React.MouseEvent) => {
    e.preventDefault();

    // if (contextMenuMessageId === (message.id)) {
    //   return;
    // }

    const rect = messageBodyRef.current?.getBoundingClientRect();
    const scrollY = window.scrollY || window.pageYOffset;
    const scrollX = window.scrollX || window.pageXOffset;
    const x = e.clientX - (rect?.left || 0) + scrollX;
    const y = e.clientY - (rect?.top || 0) + scrollY;

    setContextMenuPosition({ x, y });
    setContextMenuMessageId(String(message.id));
  };

  const handleContextMenuClose = useCallback(() => {
    setContextMenuMessageId(null);
    setContextMenuPosition(null);
  }, [setContextMenuMessageId]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        contextMenuRef.current &&
        !contextMenuRef.current.contains(e.target as Node)
      ) {
        handleContextMenuClose();
      }
    };

    const handleWindowEvents = () => handleContextMenuClose();

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("scroll", handleWindowEvents, true);
    window.addEventListener("resize", handleWindowEvents, true);
    window.addEventListener("blur", handleWindowEvents);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleWindowEvents, true);
      window.removeEventListener("resize", handleWindowEvents, true);
      window.removeEventListener("blur", handleWindowEvents);
    };
  }, [handleContextMenuClose]);

  const handleEmojiClick = (emoji: string) => {
    if (message.chatId && message.id && emoji) {
      actions.setReactionsMessageAction(
        message.chatId,  
        message.id,      
        emoji           
      );
    }
    handleContextMenuClose();
  };


  const reactionEmojiVariant = {
    hidden: {
      opacity: 0,
      y: -10,
      scale: 0.8,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20,
      },
    },
  };

  const reactionNumberVariant = {
    hidden: {
      opacity: 0,
      scale: 0.9,
    },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 15,
      },
    },
  };

  const repliedMessage = selectors.getMessageByIdSelector(
    message.chatId,
    replyId
  );
  const reactionsForCurrentMessage = selectors.getReactionsForMessageSelector(message.id);


  return (
    <div ref={vieved} onContextMenu={handleRightClick} className={`${styles['message-item']} ${message.author ? message.author.email === userDataSelectors.getUserEmailSelector ? styles['flex-start'] : styles['flex-end'] : null}`}>
      <div className={styles["user-avatar"]}></div>
      <div
        ref={messageBodyRef}
        className={`${styles["message-item-body"]} ${selectedMessages.includes(message.id) ? styles["selected"] : ""
          }`}
      // onContextMenu={handleRightClick}
      >
        {repliedMessage && repliedMessage.author && message.replied && (
          <div className={styles["replied-message"]}>
            <strong>{repliedMessage?.author.firstName}</strong>
            <p className={styles["replied-message-content"]}>
              {repliedMessage?.textMessage.content}
            </p>
          </div>
        )}
        <strong
          className={styles["author-email"]}
          onClick={() => onUserClick(message.author!.id.toString())}
        >
          {message.author!.firstName} {message.author!.lastName} :
        </strong>{" "}
        <MessageItemContent message={message} />
        <div className={styles["reaction-list"]}>
        {reactionsForCurrentMessage?.flat().map((reaction, index) => (
            <motion.div
              key={`${reaction.reactionCode}-${index}`} 
              className={styles["reaction-emoji"]}
              initial="hidden"
              animate="visible"
              variants={reactionEmojiVariant}
            >
              {reaction.reactionCode}
              <motion.span
                className={styles["reaction-count"]}
                initial="hidden"
                animate="visible"
                exit="hidden"
                variants={reactionNumberVariant}
              >
                {reaction.users.length}
              </motion.span>
            </motion.div>
          ))}
        </div>
      </div>
      {contextMenuMessageId === String(message.id) && contextMenuPosition && (
        <ContextMenu
          position={contextMenuPosition}
          onClose={handleContextMenuClose}
          onAction={(action) => {
            switch (action) {
              case "copy":
                if (message.type === "text") {
                  const typedMessage = message as MessageType<"text">
                  navigator.clipboard.writeText(typedMessage.textMessage.content);
                }
                break;
              case "reply":
                onReply();
                break;
              case "edit":
                onEdit();
                break;
              case "delete":
                onDelete();
                break;
              case "pin":
                onPin();
                break;
              case "select":
                onSelect();
                break;
              default:
                break;
            }
            handleContextMenuClose();
          }}
          onEmojiClick={handleEmojiClick}
          menuItems={[
            { label: "Ответить", action: "reply" },
            { label: "Изменить", action: "edit" },
            {
              label:
                pinnedMessageId === String(message.id)
                  ? "Открепить"
                  : "Закрепить",
              action: "pin",
            },
            { label: "Копировать текст", action: "copy" },
            { label: "Переслать", action: "forward" },
            { label: "Удалить", action: "delete" },
            { label: "Выделить", action: "select" },
          ]}
          ref={contextMenuRef}
        />
      )}
    </div>
  );
};

export default MessageItem;
