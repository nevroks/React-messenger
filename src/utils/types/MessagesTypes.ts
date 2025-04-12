
export type MessageTypeType = "text" | "voice" | "video" | "poll";

export interface IChatUser {
  avatarUrl: string | null;
  email: string;
  firstName: string;
  id: number;
  lastName: string;
  username: string;
}

export type MessageType<T extends MessageTypeType> = T extends 'text'
  ? TextMessageType
  : T extends 'voice'
  ? VoiceMessageType
  : T extends 'video'
  ? VideoMessageType
  : never;

type TextMessageType = {
  id: number;
  createdAt: string;
  editedAt: string | null;
  deletedAt: string | null;
  isPinned: boolean;
  isImportant: boolean;
  type: MessageTypeType;
  isForwardedMessage: boolean;
  isResource: boolean;
  chatId: number;
  authorId: number;
  author?: IChatUser;
  replied?: number;
  attachments?: MessageAttacmentsType[];
  textMessage: MessageTextMessageType;
}
type VoiceMessageType = {
  id: number;
  createdAt: string;
  editedAt: string | null;
  deletedAt: string | null;
  isPinned: boolean;
  isImportant: boolean;
  type: MessageTypeType;
  isForwardedMessage: boolean;
  isResource: boolean;
  chatId: number;
  authorId: number;
  author?: IChatUser;
  replied?: number;
  voiceMessage: MessageVoiceMessageType;
}
type VideoMessageType = {
  id: number;
  createdAt: string;
  editedAt: string | null;
  deletedAt: string | null;
  isPinned: boolean;
  isImportant: boolean;
  type: MessageTypeType;
  isForwardedMessage: boolean;
  isResource: boolean;
  chatId: number;
  authorId: number;
  author?: IChatUser;
  replied?: number;
  videoMessage: MessageVideoMessageType;
}

export type MessageAttacmentsType = {
  attachmentType:MessageAttacmentsTypeType
  id:number
  isOpening:boolean
  isPreviewAllowed:boolean
  key:string
  link:string
  size:number
}
export type MessageAttacmentsTypeType =   "image"

/// удалить нахуй
interface IMessage {
  id: number;
  createdAt: string;
  editedAt: string | null;
  deletedAt: string | null;
  isPinned: boolean;
  isImportant: boolean;
  type: MessageTypeType;
  isForwardedMessage: boolean;
  isResource: boolean;
  chatId: number;
  authorId: number;
  author?: IChatUser;
  replied?: number;
  attachments: MessageAttacmentsSendPropsType;
  textMessage: MessageTextMessageType;
  voiceMessage: MessageVoiceMessageType;
  videoMessage: MessageVideoMessageType;
}
export interface INewMessage extends IMessage {
  repliedTo?: number,
  text: string
}

export type MessageTextMessageType = {
  id: number;
  content: string;
};
export type MessageVoiceMessageType = {
  id: number;
  mimetype: string;
  filename: string;
  data: string;
  theme: string;
  length: number;
};
export type MessageVideoMessageType = {
  id: number;
  mimetype: string;
  filename: string;
  data: string;
  theme: string;
  length: number;
};
export type MessageAttacmentsSendPropsType = {
  mimetype: string;
  filename: string;
  data: string;
  isOpening: boolean;
  imageAsFile: boolean;
};

export interface IGetMessages {
  chatIds: number[];
  messages: MessageType<"text" | "poll" | "video" | "voice">[];
}

export interface IMessageReaction {
  chatId: number;
  messageId: number;
  reactionCode: string;
}



