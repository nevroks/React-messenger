import create from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { devtools } from "zustand/middleware";
import {
  DeleteMessageResultType,
  UpdateReactionsResultType,
  PinMessageResultType,
  SendMessageResultType,
  IUpdatedReaction,
} from "../../../utils/hooks/Messages/useMessagesSocket";

import { IGetMessages, MessageType } from "../../../utils/types/MessagesTypes";

interface IChat {
  chatIds: number | number[];
  messages: MessageType<"text" | "poll" | "video" | "voice">[];
}
interface IReactionMessage {
  chatId: number;
  messageId: number;
  reactionCode: string;
}
interface IMessagesStoreState {
  MessagesStoreState: {
    isFetched: boolean;
    isPaginationLoading: boolean;
    error: null | Error;
    chats: IChat[];
    messages: MessageType<"text" | "poll" | "video" | "voice">[];
    chatId: number;
    limit: number;
    inView: boolean;
    page: number;
    endChat: boolean;
    reactions: { [messageId: number]: IUpdatedReaction[] };
    editingMessage: MessageType<"text" | "poll" | "video" | "voice"> | null;
    replyId: number;
    pinnedMessages: MessageType<"text" | "poll" | "video" | "voice">[];
    reactionMessag: IReactionMessage
  };
  addMessageAction: (message: SendMessageResultType) => void;
  setChatsAction: (chats: IGetMessages[]) => void;
  setChatsNextAction: (chat: IGetMessages[]) => void;
  changeMessagesIsFetchedAction: (isFetched: boolean) => void;
  setMessagesErrorAction: (error: Error) => void;
  setChatIdAction: (id: number) => void;
  setInViewAction: (inView: boolean) => void;
  endChatAction: (endChat: boolean) => void;
  setNewMessageAction: (newMessage: MessageType<"text" | "poll" | "video" | "voice">) => void;
  deleteMessageAction: (deletedMessage: DeleteMessageResultType) => void;
  setEditingMessageAction: (message: MessageType<"text" | "poll" | "video" | "voice">) => void;
  pinMessageAction: ({ messageId, isPinned }: PinMessageResultType) => void;
  clearLastMessageAction: () => void;
  setReplyId: (id: number) => void;
  setReactionsMessageAction: (chatId: number, messageId: number, reactionCode: string) => void;
  updateMessageReactions: (data: UpdateReactionsResultType) => void;
  changeMessagesIsPaginationLoadingAction: (
    isPaginationLoading: boolean
  ) => void;
  updateMessageAction: (
    id: number,
    textMessage: string,
    chatId: number
  ) => void;
}

const MessagesStore = create<IMessagesStoreState>()(
  persist(
    immer(
      devtools(
        (set) => ({
          MessagesStoreState: {
            isFetched: false,
            isPaginationLoading: false,
            error: null,
            chats: [],
            messages: [],
            chatId: 0,
            limit: 20,
            inView: false,
            page: 2,
            endChat: false,
            editingMessage: null,
            replyId: 0,
            reactions: [],
            pinnedMessages: [],
            reactionMessag: {
              chatId: 0,
              messageId: 0,
              reactionCode: ''
            }
          },

          addMessageAction: (newMessage: SendMessageResultType) =>

            set(({ MessagesStoreState }) => {
              const { chatId } = newMessage
              if (!chatId) {
                console.error("Message does not contain chatId.");
                return;
              }

              const chat = MessagesStoreState.chats.find(
                (chat) => Number(chat.chatIds) === chatId
              );

              if (chat) {
                chat.messages.unshift(newMessage);
              } else {
                MessagesStoreState.chats.push({
                  chatIds: chatId,
                  messages: [newMessage],
                });
              }
            }),

          setChatsAction: (chats: IGetMessages[]) =>
            set(({ MessagesStoreState }) => {
              chats.forEach((chat) => {
                const existingChatIndex = MessagesStoreState.chats.findIndex(
                  (existingChat) =>
                    Array.isArray(existingChat.chatIds) &&
                    Array.isArray(chat.chatIds) &&
                    existingChat.chatIds.length === chat.chatIds.length &&
                    existingChat.chatIds.every(chatId => chat.chatIds.includes(chatId))
                );

                if (existingChatIndex > -1) {
                  const existingChat = MessagesStoreState.chats[existingChatIndex];
                  existingChat.messages.push(
                    ...(chat.messages || []).filter(
                      (message) =>
                        !existingChat.messages.some(
                          (existingMessage: MessageType<"text" | "poll" | "video" | "voice">) =>
                            existingMessage.id === message.id
                        )
                    )
                  );
                } else {
                  const newMessages = chat.messages || [];
                  MessagesStoreState.chats.push({
                    chatIds: chat.chatIds,
                    messages: newMessages,
                  });
                }
              });
            }),
          setChatsNextAction: (chats: IGetMessages[]) =>
            set(({ MessagesStoreState }) => {
              chats.forEach((chat) => {
                const existingChatIndex = MessagesStoreState.chats.findIndex(
                  (existingChat) => Number(existingChat.chatIds) === Number(chat.chatIds)
                );

                if (existingChatIndex > -1) {
                  const existingChat =
                    MessagesStoreState.chats[existingChatIndex];
                  existingChat.messages.push(
                    ...(chat.messages || []).filter(
                      (message) =>
                        !existingChat.messages.some(
                          (existingMessage: MessageType<"text" | "poll" | "video" | "voice">) =>
                            existingMessage.id === message.id
                        )
                    )
                  );
                } else {
                  const newMessages = chat.messages || [];
                  MessagesStoreState.chats.push({
                    chatIds: chat.chatIds,
                    messages: newMessages,
                  });
                }
              });
            }),
          changeMessagesIsFetchedAction: (isFetched: boolean) =>
            set(({ MessagesStoreState }) => {
              MessagesStoreState.isFetched = isFetched;
            }),

          changeMessagesIsPaginationLoadingAction: (
            isPaginationLoading: boolean
          ) =>
            set(({ MessagesStoreState }) => {
              MessagesStoreState.isPaginationLoading = isPaginationLoading;
            }),
          endChatAction: (endChat: boolean) =>
            set(({ MessagesStoreState }) => {
              MessagesStoreState.endChat = endChat;
            }),
          setMessagesErrorAction: (error: Error) =>
            set(({ MessagesStoreState }) => {
              MessagesStoreState.error = error;
            }),
          setChatIdAction: (id: number) =>
            set(({ MessagesStoreState }) => {
              MessagesStoreState.chatId = id;
            }),

          setInViewAction: (inView: boolean) =>
            set(({ MessagesStoreState }) => {
              MessagesStoreState.inView = inView;
            }),

          setNewMessageAction: (newMessage: MessageType<"text" | "poll" | "video" | "voice">) =>
            set(({ MessagesStoreState }) => {
              MessagesStoreState.messages.push(newMessage);
            }),

          deleteMessageAction: ({
            deletedMessage,
          }: DeleteMessageResultType) => {
            const { chatId, id } = deletedMessage;
            set(({ MessagesStoreState }) => {
              const chat = MessagesStoreState.chats.find(
                (chat) => chat.chatIds === chatId
              );
              if (chat) {
                chat.messages = chat.messages.filter(
                  (msg: MessageType<"text" | "poll" | "video" | "voice">) => msg.id !== id
                );
              }
            });
          },
          updateMessageAction: (
            id: number,
            textMessage: string,
            chatId: number
          ) => {
            set(({ MessagesStoreState }) => {
              const chat = MessagesStoreState.chats.find((chat) =>
                Array.isArray(chat.chatIds)
                  ? chat.chatIds.includes(chatId)
                  : chat.chatIds === chatId
              );

              if (chat) {
                chat.messages.forEach((msg: MessageType<"text" | "poll" | "video" | "voice">) => {
                  if (msg.id === id) {
                    const typedTextMessage = msg as MessageType<"text">
                    typedTextMessage.textMessage.content = textMessage;
                  }
                });
              }
            });
          },
          pinMessageAction: ({ messageId, isPinned }: PinMessageResultType) =>
            set(({ MessagesStoreState }) => {
              const targetMessage = MessagesStoreState.chats
                .flatMap((chat) => chat.messages)
                .find((msg: MessageType<"text" | "poll" | "video" | "voice">) => msg.id === messageId);

              if (targetMessage) {
                const alreadyPinned = MessagesStoreState.pinnedMessages.some(
                  (pinnedMessage: MessageType<"text" | "poll" | "video" | "voice">) => pinnedMessage.id === targetMessage.id
                );

                if (!alreadyPinned && isPinned) {
                  MessagesStoreState.pinnedMessages.push(targetMessage);
                } else if (alreadyPinned && !isPinned) {
                  MessagesStoreState.pinnedMessages = MessagesStoreState.pinnedMessages.filter(
                    (pinnedMessage: MessageType<"text" | "poll" | "video" | "voice">) => pinnedMessage.id !== targetMessage.id
                  );
                }
              }
            }),

          clearLastMessageAction: () =>
            set(({ MessagesStoreState }) => {
              MessagesStoreState.pinnedMessages.pop();
            }),

          setEditingMessageAction: (message: MessageType<"text" | "poll" | "video" | "voice"> | null) =>
            set(({ MessagesStoreState }) => {
              MessagesStoreState.editingMessage = message;
            }),

          setReplyId: (id: number) =>
            set(({ MessagesStoreState }) => {
              MessagesStoreState.replyId = id;
            }),
          setReactionsMessageAction: (chatId: number, messageId: number, reactionCode: string) =>
            set(({ MessagesStoreState }) => {
              MessagesStoreState.reactionMessag = {
                chatId: chatId,
                messageId: messageId,
                reactionCode: reactionCode
              }
            }),
          updateMessageReactions: ({ messageId, updatedReactions }) => {
            set(({ MessagesStoreState }) => {
              MessagesStoreState.reactions[messageId] = updatedReactions;
            });
          },
        }),
        { name: "MessagesStore" }
      )
    ),
    {
      name: "messages",
      getStorage: () => localStorage,
    }
  )
);

export const useMessagesStore = () => {
  const {
    addMessageAction,
    setChatsAction,
    changeMessagesIsFetchedAction,
    setMessagesErrorAction,
    setNewMessageAction,
    setChatIdAction,
    setInViewAction,
    setChatsNextAction,
    changeMessagesIsPaginationLoadingAction,
    endChatAction,
    deleteMessageAction,
    updateMessageAction,
    setEditingMessageAction,
    pinMessageAction,
    clearLastMessageAction,
    setReplyId,
    updateMessageReactions,
    setReactionsMessageAction
  } = MessagesStore();

  const getAllChatsSelector = MessagesStore(
    (state) => state.MessagesStoreState.chats
  );
  const getMessagesIsFetchedSelector = MessagesStore(
    (state) => state.MessagesStoreState.isFetched
  );
  const getIsPaginationLoadingSelector = MessagesStore(
    (state) => state.MessagesStoreState.isPaginationLoading
  );
  const getIdChat = MessagesStore((state) => state.MessagesStoreState.chatId);
  const getEndChatSelector = MessagesStore(
    (state) => state.MessagesStoreState.endChat
  );
  const getEditingMessageSelector = MessagesStore(
    (state) => state.MessagesStoreState.editingMessage
  );
  const getRepliedToIdSelector = MessagesStore(
    (state) => state.MessagesStoreState.replyId
  );
  const getReactionMessagSelector = MessagesStore(
    (state) => (state.MessagesStoreState.reactionMessag)
  );
  const getLastPinnedMessageSelector = MessagesStore((state) => {
    const { pinnedMessages } = state.MessagesStoreState;

    if (Array.isArray(pinnedMessages) && pinnedMessages.length > 0) {
      return pinnedMessages[pinnedMessages.length - 1];
    }

    return null;
  });


  const getDateNextMessagesSelector = MessagesStore((state) => ({
    chatId: state.MessagesStoreState.chatId,
    limit: state.MessagesStoreState.limit,
    inView: state.MessagesStoreState.inView,
    page: state.MessagesStoreState.page,
  }));

  const getReactionsForMessageSelector = (messageId: number) => {
    return MessagesStore(
      (state) => state.MessagesStoreState.reactions[messageId]
    );
  };

  const getMessageByIdSelector = (
    chatId: number,
    messageId: number
  ): MessageType<"text" | "poll" | "video" | "voice"> | undefined => {
    return MessagesStore((state) => {
      const chat = state.MessagesStoreState.chats.find(
        (chat) => chat.chatIds === chatId
      );
      return chat
        ? chat.messages.find((message) => message.id === messageId)
        : undefined;
    });
  };

  const getMessagesOneChatSelector = (id: number): MessageType<"text" | "poll" | "video" | "voice">[] | undefined => {
    return MessagesStore((state) => {
      const chat = state.MessagesStoreState.chats.find(
        (chat) => Number(chat.chatIds) === id
        // (chat) => console.log(Number(chat.chatIds))
      );

      return chat ? chat.messages : undefined;
    });
  };

  const getReversedMessagesOneChatSelector = (
    id: number
  ): MessageType<"text" | "poll" | "video" | "voice">[] | undefined => {
    const chatMessages = getMessagesOneChatSelector(id);
    return chatMessages ? [...chatMessages].reverse() : undefined;
  };

  const getLastMessagesSelector = () => {
    return MessagesStore((state) => {
      return state.MessagesStoreState.chats.map((chat) => {
        const lastMessage = chat.messages.length > 0 ? chat.messages[0] : null;
        switch (lastMessage?.type) {
          case "text":
            {
              const typedLastMessage = lastMessage as MessageType<"text">;

              return {
                chatId: chat.chatIds,
                lastMessage: typedLastMessage.textMessage.content,
              };
            }
        }
      });
    });
  };

  const getLengthMessagesSelector = () => {
    return MessagesStore((state) => {
      return state.MessagesStoreState.chats.map((chat) => {
        const lastMessage =
          chat.messages.length > 0 ? chat.messages.length : null;

        return {
          chatId: chat.chatIds,
          lastMessage: lastMessage ? chat.messages.length : undefined,
        };
      });
    });
  };

  return {
    actions: {
      addMessageAction,
      setChatsAction,
      changeMessagesIsFetchedAction,
      setMessagesErrorAction,
      setNewMessageAction,
      setChatIdAction,
      setInViewAction,
      setChatsNextAction,
      changeMessagesIsPaginationLoadingAction,
      endChatAction,
      deleteMessageAction,
      updateMessageAction,
      setEditingMessageAction,
      pinMessageAction,
      clearLastMessageAction,
      setReplyId,
      updateMessageReactions,
      setReactionsMessageAction
    },
    selectors: {
      getAllChatsSelector,
      getMessagesIsFetchedSelector,
      getMessagesOneChatSelector,
      getReversedMessagesOneChatSelector,
      getDateNextMessagesSelector,
      getIsPaginationLoadingSelector,
      getIdChat,
      getLastMessagesSelector,
      getLengthMessagesSelector,
      getEndChatSelector,
      getEditingMessageSelector,
      getLastPinnedMessageSelector,
      getRepliedToIdSelector,
      getMessageByIdSelector,
      getReactionsForMessageSelector,
      getReactionMessagSelector
    },
  };
};
