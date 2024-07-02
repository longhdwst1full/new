// App.jsx / App.tsx

import React, { useEffect, useState } from 'react';
import { ChatRoom,   ConnectionState } from 'amazon-ivs-chat-messaging';
import { fetchChatToken } from '@/commons/component/fetchChatToken';
import { SendButton } from '@/commons/component/SendButton';
import { MessageInput } from '@/commons/component/MessageInput';

type ChatToken = {
  token: string;
  sessionExpirationTime?: Date;
  tokenExpirationTime?: Date;
};
 

async function tokenProvider(): Promise<ChatToken> {
  // Call your backend to fetch chat token from IVS Chat endpoint:
  // e.g. const token = await appBackend.getChatToken()

  // Mocking the token and expiration times for illustration
  return {
    token: '<token>',
    sessionExpirationTime: new Date('<date-time>'),
    tokenExpirationTime: new Date('<date-time>'),
  };
}

export default function Page() {
    const [room] = useState(
      () =>
        new ChatRoom({
          regionOrUrl: process.env.CHAT_REGION as string,
          tokenProvider,
        }),
    );

    console.log(room);
    const [connectionState, setConnectionState] = useState<ConnectionState>('disconnected');

    useEffect(() => {
      const unsubscribeOnConnecting = room.addListener('connecting', () => {
        setConnectionState('connecting');
      });

      const unsubscribeOnConnected = room.addListener('connect', () => {
        setConnectionState('connected');
      });

      const unsubscribeOnDisconnected = room.addListener('disconnect', () => {
        setConnectionState('disconnected');
      });

      room.connect();

      return () => {
        unsubscribeOnConnecting();
        unsubscribeOnConnected();
        unsubscribeOnDisconnected();
      };
    }, [room]);
  const [messageToSend, setMessageToSend] = useState('');

    const onMessageSend = () => {};

    const isSendDisabled = connectionState !== 'connected';

   return (
     <div>
       <h4>Connection State: {connectionState}</h4>
       <MessageInput value={messageToSend} onValueChange={setMessageToSend} />
       <SendButton disabled={isSendDisabled} onPress={onMessageSend} />
     </div>
   );
   
}
