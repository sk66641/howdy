import { createContext, useContext, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { io } from "socket.io-client";
import { useGetLoggedInUserQuery } from "../features/auth/authApi2";
import { chatApi } from "../features/chat/chatApi2"; // 👈 Import the chatApi object
import { selectCurrentChat, selectChatType, setCurrentChat, setChatType } from "../features/chat/chatSlice2"; // 👈 Keep only the UI state actions

const SocketContext = createContext();

export const useSocket = () => {
    return useContext(SocketContext);
}

export const SocketProvider = ({ children }) => {
    const socket = useRef();
    const dispatch = useDispatch();

    const { data: user } = useGetLoggedInUserQuery();
    const currentChat = useSelector(selectCurrentChat);
    const chatType = useSelector(selectChatType);

    // This logic for avoiding stale closures remains correct and necessary
    const currentChatRef = useRef(currentChat);
    useEffect(() => {
        currentChatRef.current = currentChat;
    }, [currentChat]);

    useEffect(() => {
        if (user) {
            socket.current = io(import.meta.env.VITE_HOST, {
                withCredentials: true,
                query: { userId: user._id },
            });

            socket.current.on("connect", () => console.log("Connected to socket server:", socket.current.id));

            // --- Real-time Message Updates ---
            socket.current.on('receiveMessage', (message) => {
                // Manually update the message cache for the relevant chat
                dispatch(
                    chatApi.util.updateQueryData('getMessages', { receiverId: message.sender._id }, (draft) => {
                        draft.push(message);
                    })
                );
            });

            socket.current.on("receive-channel-message", (message) => {
                dispatch(
                    chatApi.util.updateQueryData('getChannelMessages', message.channelId, (draft) => {
                        draft.push(message);
                    })
                );
            });

            // --- Real-time Deletion Updates ---
            socket.current.on('direct-message-deleted', ({ messageId, chatId }) => {
                dispatch(
                    chatApi.util.updateQueryData('getMessages', { receiverId: chatId }, (draft) => {
                        return draft.filter((msg) => msg._id !== messageId);
                    })
                );
            });
            
            socket.current.on('channel-message-deleted-by-admin', (updatedMessage) => {
                dispatch(
                    chatApi.util.updateQueryData('getChannelMessages', updatedMessage.channelId, (draft) => {
                         const index = draft.findIndex(msg => msg._id === updatedMessage._id);
                         if (index !== -1) draft[index] = updatedMessage;
                    })
                );
            });


            // --- Real-time Channel List Updates ---
            const invalidateChannelsList = () => dispatch(chatApi.util.invalidateTags([{ type: 'Channels', id: 'LIST' }]));

            socket.current.on('channel-created', invalidateChannelsList);
            socket.current.on('member-added', invalidateChannelsList);
            socket.current.on('channel-deleted', (channelId) => {
                invalidateChannelsList();
                if (currentChatRef.current?._id === channelId) {
                    dispatch(setCurrentChat(null));
                    dispatch(setChatType(null));
                }
            });
             socket.current.on('member-removed', ({channelId}) => {
                invalidateChannelsList();
                 // Also invalidate the specific channel's member list
                dispatch(chatApi.util.invalidateTags([{ type: 'ChannelMembers', id: channelId }]));

                if (currentChatRef.current?._id === channelId) {
                    dispatch(setCurrentChat(null));
                    dispatch(setChatType(null));
                }
            })

            // --- Real-time Updates for a Specific Channel ---
            socket.current.on('channel-updated', (channel) => {
                // Invalidate both the list and the specific channel to force refetches
                dispatch(chatApi.util.invalidateTags([{ type: 'Channels', id: 'LIST' }, { type: 'Channels', id: channel._id }]));
                if (currentChatRef.current?._id === channel._id) {
                    dispatch(setCurrentChat(channel)); // Update the UI state
                }
            });
        }
        return () => {
            if (socket.current) {
                socket.current.disconnect();
                console.log("Socket disconnected");
            }
        };
    }, [user, dispatch]);

    return (
        <SocketContext.Provider value={socket.current}>
            {children}
        </SocketContext.Provider>
    );
}