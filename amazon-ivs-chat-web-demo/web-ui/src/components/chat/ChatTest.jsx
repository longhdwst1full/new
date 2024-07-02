import { ChatRoom } from 'amazon-ivs-chat-messaging';
import axios from "axios";
import { createRef, useEffect, useRef, useState } from "react";
import * as config from '../../config';
import { uuidv4 } from '../../helpers';
import { MessageInput } from "./MessageInput";
import { SendButton } from "./SendButton";
import SignIn from './SignIn';

export default function Page() {
  const socket = "wss://edge.ivschat.us-east-1.amazonaws.com";
 
   const tokenProvider = async (selectedUsername, isModerator, avatarUrl) => {
    const uuid = uuidv4();
    const permissions = isModerator
      ? ['SEND_MESSAGE', 'DELETE_MESSAGE', 'DISCONNECT_USER']
      : ['SEND_MESSAGE'];

    const data = {
      arn: config.CHAT_ROOM_ID,
      userId: `${selectedUsername}.${uuid}`,
      attributes: {
        username: `${selectedUsername}`,
        avatar: `${avatarUrl.src}`,
      },
      capabilities: permissions,
    };

    var token;
    console.log(data)
    try {
      const response = await axios.post(`${config.API_URL}/auth`, data);
      token = {
        token: response.data.token,
        sessionExpirationTime: new Date(response.data.sessionExpirationTime),
        tokenExpirationTime: new Date(response.data.tokenExpirationTime),
      };
    } catch (error) {
      console.error('Error:', error);
    }

    return token;
  };

  const [showSignIn, setShowSignIn] = useState(true);
  const [token, settoken] = useState("true");
   
  const [room, setChatRoom] = useState( () =>
      new ChatRoom({
        regionOrUrl: config.CHAT_REGION,
        tokenProvider,
      }));
 
  const [messageToSend, setMessageToSend] = useState("");

  // Fetches a chat token
 
  

  console.log(room);
  const [connectionState, setConnectionState] =
    useState("disconnected");

  useEffect(() => {
    const connection = new WebSocket(socket, token);

    const unsubscribeOnConnecting = room.addListener("connecting", () => {
      setConnectionState("connecting");
    });

    const unsubscribeOnConnected = room.addListener("connect", () => {
      setConnectionState("connected");
    });

    const unsubscribeOnDisconnected = room.addListener("disconnect", () => {
      setConnectionState("disconnected");
    });

    room.connect();

    return () => {
      unsubscribeOnConnecting();
      unsubscribeOnConnected();
      unsubscribeOnDisconnected();
    };
  }, [room, token]);


  const onMessageSend = () => {};

  const isSendDisabled = connectionState !== "connected";

const handleSignIn = (selectedUsername, isModerator, avatarUrl) => {
    // Set application state
   
console.log(selectedUsername,"::::", isModerator, avatarUrl)
    // Instantiate a chat room
    const room = new ChatRoom({
      regionOrUrl: config.CHAT_REGION,
      tokenProvider: () =>
        tokenProvider(selectedUsername, isModerator, avatarUrl),
    });
    settoken()
    setChatRoom(room);
setShowSignIn( tokenProvider(selectedUsername, isModerator, avatarUrl))
    // // Connect to the chat room
    room.connect();
  };
  return (
    <div>
      <h4>Connection State: {connectionState}</h4>
      <MessageInput value={messageToSend} onValueChange={setMessageToSend} />
      <SendButton disabled={isSendDisabled} onPress={onMessageSend} />
       {showSignIn && <SignIn handleSignIn={handleSignIn} />}
    </div>
  );
}
