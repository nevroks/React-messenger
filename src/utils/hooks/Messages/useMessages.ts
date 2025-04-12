import { useMessagesStore } from "../../../stores/Messages/MessagesStore";
import useMessagesSocket, { SendMessagePayloadType } from "./useMessagesSocket";
import { MessageType, MessageTypeType } from "../../types/MessagesTypes";
import { number } from "zod";

const useMessages = () => {
  const { actions: socketActions } = useMessagesSocket();
  const { actions: storeActions, selectors: storeSelectors } = useMessagesStore();

  const repliedToId = storeSelectors.getRepliedToIdSelector;
  // Если хочется изменить чтото то можно так
  // ----------------------------------------
  // const modifiedCreateNewChat = (props) => {
  //     const changedProps = {...props}.filter(some filter)
  //     actions.createNewChat(changedProps)
  // }
  // ----------------------------------------

  function sendMessage<T extends MessageTypeType>(messageData: SendMessagePayloadType<T>,) {
    try {
      switch (messageData.type) {
        case "text":
          let typedMessageData = messageData as SendMessagePayloadType<"text">
          socketActions.sendNewMessage(typedMessageData);
          break;
        case "voice":
          const typedVoiceMessageData = messageData as SendMessagePayloadType<"voice">
          socketActions.sendNewMessage(typedVoiceMessageData);
          break;
        case "video":
          const typedVideoMessageData = messageData as SendMessagePayloadType<"video">
          socketActions.sendNewMessage(typedVideoMessageData);
          break;
        default:
          console.error("Неправильный тип сообщения");
      }

    } catch (error) {
      console.error("Ошибка при отправке сообщения:", error);
    }
  };

  const deleteMessage = (messageId: number) => {
    try {
      socketActions.sendDeleteMessage({ messageId });
    } catch (error) {
      console.error("Ошибка при удалении сообщения:", error);
    }
  };

  const updateMessage = async ({
    id,
    type,
    textMessage,
    chatId,
  }: {
    id: number;
    type: MessageTypeType;
    textMessage: string;
    chatId: number;
  }) => {
    try {
      storeActions.updateMessageAction(id, textMessage, chatId);
      socketActions.sendUpdateMessage({
        messageId: id,
        type,
        text: textMessage,
      });
    } catch (error) {
      console.error("Ошибка при обновлении сообщения:", error);
    }
  };

  const pinMessage = (pinnedMessage: MessageType<"poll" | "text" | "video" | "voice">) => {
    const { chatId, id } = pinnedMessage;
    try {
      socketActions.sendPinMessage({ chatId, messageId: id, isPinned: true });
    } catch (error) {
      console.error("Ошибка при закреплении сообщения:", error);
    }
  };

  const unpinMessage = (unpinnedMessage: MessageType<"poll" | "text" | "video" | "voice">) => {
    const { chatId, id } = unpinnedMessage;
    try {
      socketActions.sendPinMessage({ chatId, messageId: id, isPinned: false });
      storeActions.clearLastMessageAction();
    } catch (error) {
      console.error("Ошибка при откреплении сообщения:", error);
    }
  };

  const addReaction = (
    chatId: number,
    messageId: number,
    reactionCode: string
  ) => {
    try {
      socketActions.sendAddReaction({ chatId, messageId, reactionCode });
    } catch (error) {
      console.error("Ошибка при добавлении реакции:", error);
    }
  };


  const replyToMessage = (chatId: number, text: string) => {
    const messageData: SendMessagePayloadType<"text"> = {
      chatId,
      type: "text",
      text,
      repliedTo: repliedToId,
    };

    try {
      sendMessage(messageData);
      storeActions.setReplyId(0);
    } catch (error) {
      console.error("Ошибка при отправке ответа:", error);
    }
  };

  const actions = {
    ...socketActions,
    sendMessage,
    deleteMessage,
    updateMessage,
    pinMessage,
    unpinMessage,
    addReaction,
    replyToMessage,
  };

  return { ...actions };
};

export default useMessages;
