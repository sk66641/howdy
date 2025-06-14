import { createContext, useContext, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectLoggedInUser } from "../features/auth/authSlice";
import { io } from "socket.io-client";
import { selectContacts, selectCurrentChat, setChatMessages, selectChatType } from "../features/chat/chatSlice";

const SocketContext = createContext();

export const useSocket = () => {
    return useContext(SocketContext);
}

export const SocketProvider = ({ children }) => {
    const socket = useRef();
    const dispatch = useDispatch();

    // Why use useRef()?
    // -> useRef() doesn't cause a re-render when updated. 
    // -> You want to persist the socket connection across renders without triggering re-renders.
    // -> It acts like a box where you store a value (socket.current = io(...)) and reuse it anywhere.

    const user = useSelector(selectLoggedInUser);
    const currentChat = useSelector(selectCurrentChat);
    const chatType = useSelector(selectChatType);

    const selectedContactRef = useRef();
    const selectedChatTypeRef = useRef();
    // Why This Happens (stale state issue)?
    // -> The useEffect hook runs after the component mounts, and it sets up the Socket.IO connection and event listeners.
    // -> If the currentChat state is updated in the Redux store after the useEffect runs, the event listener for receiveMessage captures the initial value of currentChat (likely null or undefined).
    // -> Since event listeners are set up only once in the useEffect, they won't automatically update to reflect changes to currentChat unless you explicitly handle this.
    useEffect(() => {
        selectedContactRef.current = currentChat;
        selectedChatTypeRef.current = chatType;
    }, [currentChat]);



    useEffect(() => {
        if (user) {
            socket.current = io(import.meta.env.VITE_HOST, {
                withCredentials: true,
                query: {
                    userId: user._id,
                }
            })

            socket.current.on("connect", () => {
                console.log("connected to socket server", socket.current.id);
            });



            socket.current.on('receiveMessage', (message) => {
                if (selectedContactRef.current && (selectedContactRef.current._id === message.sender._id || selectedContactRef.current._id === message.receiver._id)) {
                    console.log("Received message for selected contact:", message);
                    { selectedChatTypeRef.current === "contact" && dispatch(setChatMessages(message)); }
                }
            });

            socket.current.on("receive-channel-message", (message) => {
                if (selectedContactRef.current && selectedContactRef.current._id === message.channelId) {
                    { selectedChatTypeRef.current === "channel" && dispatch(setChatMessages(message)); }
                    console.log("receiving channel message: ", message); 
                }
            })

        }
        return () => {
            if (socket.current) {
                socket.current.disconnect();
                console.log("Socket disconnected");
            }
        };
    }, [user]);

    return (
        <SocketContext.Provider value={socket.current}>
            {children}
        </SocketContext.Provider>
    );
}