import {jwtDecode} from "jwt-decode";

interface JwtPayload {
    exp: number;
    iat: number;
    sub: string;
    name: string;
    companies:number[];
    [key: string]: unknown;
}

/**
 * Декодирует JWT токен и возвращает его payload.
 * @param token Строка JWT токена.
 * @returns Объект с данными из payload токена.
 */
export function decodeJwt(token: string): JwtPayload {
    try {
        return jwtDecode<JwtPayload>(token);
    } catch (error) {
        console.error("Ошибка при декодировании JWT: ", error);
        throw new Error("Невозможно декодировать токен.");
    }
}