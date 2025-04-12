
export type JWTTokenType = {
    accessToken: string;
    refreshToken: string;
}
export type UserDataType = {
    email: string;
    firstName: string;
    lastName: string;
    companies: number[];
}

export interface Author {
    id: number;
    email: string;
}

export interface Message {
    id: string;
    text: string;
    chatId: string;
    author: Author;
    timestamp: string;
}

export interface TokenResponse {
    accessToken: string;
    refreshToken: string;
    isDataRequired?: boolean;
}

export interface ValidationErrorResponse {
    message: string;
    isDataRequired?: boolean;
}

export interface Emoji {
    codes: string;
    char: string;
    name: string;
    category: string;
}

export interface Participant {
    id: number;
    name: string;
    username: string;
    phoneNumber: string;
    email: string;
}
