export type ChatTypeType = "personal" | "direct" | "private" | "public"

export type ChatTypeUserAbleToCreateType = Exclude<ChatTypeType, 'direct' | 'personal'>
export interface Chat {
    avatarUrl: string | null;
    attachmentCounts:ChatAttachmentCountsType;
    company: number;
    createAt: string;
    creator: ChatCreatorType
    deletedAt:string | null;
    id: number;
    inviteToken:string;
    title: string;
    totalMessages:number;
    type:string;
    updateAt: string;
    users:ChatUserType[];
}
export type ChatAttachmentCountsType={
    audio:number;
    document:number;
    file:number;
    image:number;
    video:number;
}
type ChatCreatorType = {
    email: string;
    firstName: string;
    id: number;
    lastName: string;
    username: string;
}
export type UserDataType = {
    email: string;
    firstName: string;
    lastName: string;
    companies: number[];
}
export type ChatUserType = {
    avatar: string | null;
    email: string;
    firstName: string;
    id: number;
    lastName: string;
    username: string;
}
export interface Chat {
    attachmentCounts: ChatAttachmentCountsType
    avatarUrl: string | null;
    company: number;
    createAt: string;
    creator: ChatCreatorType
    deletedAt: string | null;
    id: number;
    inviteToken: string;
    title: string;
    type: string;
    updateAt: string;
    users: ChatUserType[];
    totalMessages: number
}

export type RequiredDataToCreatenewChatType = {
    title: string;
    chatType: ChatTypeType;
    companyId: number
}