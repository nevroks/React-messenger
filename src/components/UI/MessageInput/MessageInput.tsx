import React, { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { z } from 'zod';
import { zodResolver } from "@hookform/resolvers/zod";
import classNames from "classnames";
import { messageSchema } from "../../../utils/validation/messageSchema";
import styles from "./style.module.scss";

// ICONS

import StickerIcon from "../../../assets/icons/sticker.svg";
import DocumentIcon from "../../../assets/icons/document.svg"
import EmojiIcon from "../../../assets/icons/emoji.svg";

import { useParams } from "react-router-dom";
import useMessages from "../../../utils/hooks/Messages/useMessages";
import { useMessagesStore } from "../../../stores/Messages/MessagesStore";
import MessageInputAttachements from "./MessageInputAttachements";
import { MessageAttacmentsSendPropsType, MessageTypeType } from "../../../utils/types/MessagesTypes";
import { SendMessagePayloadType } from "../../../utils/hooks/Messages/useMessagesSocket";
import { convertFileToBase64 } from "../../../utils/helpers/convertFileToBase64";

interface MessageInputProps {
  onEmojiToggle?: () => void;
  handleEmojiSelect?: (emoji: string) => void;
}

const MessageInput: React.FC<MessageInputProps> = ({
  onEmojiToggle,
  handleEmojiSelect,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [inputValue, setInputValue] = useState<string>("")
  // const [voiceInputValue,setVoiceInputValue] = useState<string>("")
  const [messageType, setMessageType] = useState<MessageTypeType>("text")
  const [files, setFiles] = useState<FileList | null>(null)
  const [replyToMessageText, setReplyToMessageText] = useState<string | null>(null); 



  const { sendMessage, updateMessage, replyToMessage } = useMessages();
  const { selectors, actions } = useMessagesStore();
  const editingMessage = selectors.getEditingMessageSelector;



  useEffect(() => {
    if (editingMessage) {
      setInputValue(editingMessage.textMessage.content);
      if (inputRef.current) inputRef.current.focus();
    } else {
      setInputValue("");
    }
  }, [editingMessage]);


  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [handleEmojiSelect]);

  const { id } = useParams()
  const chatId = Number(id)
  
  const repliedToId = selectors.getRepliedToIdSelector;

  const replyText = selectors.getMessageByIdSelector(chatId, repliedToId);

  useEffect(() => {
    if (repliedToId > 0 && replyText) {
      setReplyToMessageText(replyText.textMessage.content);
    } else {
      setReplyToMessageText(null);
    }
  }, [repliedToId, replyText]);

  const handleSubmit = async () => {
    if (editingMessage) {
      const updatedMessage = {
        id: editingMessage.id,
        type: editingMessage.type,
        textMessage: inputValue,
        chatId: editingMessage.chatId
      }
      updateMessage(updatedMessage);
      actions.setEditingMessageAction(null);
    } else {

      try {
        if (repliedToId > 0) {
          replyToMessage(chatId, inputValue);
          handleCancelReplyId();
          setInputValue("");
          setFiles(null);
          return; 
        }
        switch (messageType) {
          case "text":
            const attachements: MessageAttacmentsSendPropsType[] | undefined = files !== null && files?.length !== 0 ? await Promise.all(
              Array.from(files).map(async (file) => {
                const base64Data = await convertFileToBase64(file) as string;
                let del = base64Data.indexOf(',');
                const finalBase64 = base64Data.slice(del + 1)
                return {
                  mimetype: file.type,
                  filename: file.name,
                  data: finalBase64,
                  isOpening: file.type === "image/png" ? true : false,
                  imageAsFile: file.type === "image/png" ? true : false
                }
              })
            ) : undefined;
            const newTextMessage: SendMessagePayloadType<"text"> = {
              chatId: chatId,
              type: "text",
              text: inputValue,
              attachments: attachements ? attachements : undefined
            };
            sendMessage<"text">(newTextMessage)
            handleCancelReplyId();
            setInputValue("");
            setFiles(null);
            break;
          case "voice":
            // const newVoiceMessage: SendMessagePayloadType<"voice"> = {
            //   chatId: chatId,
            //   type: "voice",
            //   voice: inputValue,
            // };

            // sendMessage<"voice">(newVoiceMessage)
            // handleCancelReplyId();
            // setInputValue("");
            // setFiles(null);
            break
          case "video":
            // const newVideoMessage: SendMessagePayloadType<"video"> = {
            //   chatId: chatId,
            //   type: "video",
            //   video: inputValue,
            // };

            // sendMessage<"video">(newVideoMessage)
            // handleCancelReplyId();
            // setInputValue("");
            // setFiles(null);
        }




      } catch (error) {
        console.error("Ошибка при отправке сообщения:", error);
      }
    }
  }


  const handleCancelEdit = () => {
    actions.setEditingMessageAction(null);
  };

  const handleCancelReplyId = () => {
    actions.setReplyId(0);
  };

  return (
    <div className={styles["message-input-body"]}>
      {files !== null && files?.length !== 0 &&
        <ul className={styles["message-input-attachements-list"]}>
          {Array.from(files).map((file) => {


            const isPreviewFile = file.type.includes("image") || file.type.includes("video");
            const url = isPreviewFile ? URL.createObjectURL(file) : null


            if (isPreviewFile) {
              return <li key={file.name} className={styles["message-input-attachements-list-item"]}>
                <img src={url!} />
              </li>
            }
            return <li className={styles["message-input-attachements-list-item"]}>
              <img className={styles['icon']} src={DocumentIcon} alt=""/>
              <p key={file.name}>{file.name}</p>
            </li>
          })}
        </ul>
      }
      {repliedToId > 0 &&
        <div className={styles["message-input-reply-panel"]}>
          <span>Ответить на: {replyToMessageText}</span>
          <button onClick={handleCancelReplyId}>Отмена</button>
        </div>}
      {editingMessage && (
        <div className={styles["message-input-editing-panel"]}>
          <span>Редактирование сообщения</span>
          <button onClick={handleCancelEdit}>Отмена</button>
        </div>
      )}
      <div className={classNames(styles["message-input-form"])}>
        <div className={styles["left-side"]}>
          <MessageInputAttachements files={files} setFiles={setFiles} />
          <input
            type="text"
            value={inputValue}
            placeholder="Сообщение"
            onChange={(e) => setInputValue(e.target.value)}
          />
          {/* {errors.text && <p className={styles["error-message"]}>{errors.text.message}</p>} */}
        </div>

        <div className={styles["actions"]}>
          <button onClick={handleSubmit} type="submit">Send</button>
          <button type="button">
            <img src={StickerIcon} alt="Sticker" />
          </button>
          <button type="button" onClick={onEmojiToggle}>
            <img src={EmojiIcon} alt="Emoji" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MessageInput;