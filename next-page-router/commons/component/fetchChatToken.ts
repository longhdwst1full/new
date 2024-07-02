// fetchChatToken.ts

import { ChatToken } from 'amazon-ivs-chat-messaging';

type UserCapability = 'DELETE_MESSAGE' | 'DISCONNECT_USER' | 'SEND_MESSAGE';

export async function fetchChatToken(
    userId: string,
    capabilities: UserCapability[] = [],
    attributes?: Record<string, string>,
    sessionDurationInMinutes?: number,
): Promise<ChatToken> {
    const response = await fetch(`${process.env.BACKEND_BASE_URL}/auth`, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            userId,
            roomIdentifier: process.env.CHAT_ROOM_ID,
            capabilities,
            sessionDurationInMinutes,
            attributes
        }),
    });

    const token = await response.json();

    return {
        ...token,
        sessionExpirationTime: new Date(token.sessionExpirationTime),
        tokenExpirationTime: new Date(token.tokenExpirationTime),
    };
}