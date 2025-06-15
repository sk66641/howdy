import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { addMembers, createChannel, deleteChannelMessage, deleteChannelMessageByAdmin, deleteDirectMessage, downloadFile, getChannelMembers, getChannelMessages, getChannels, getDmContactList, getMessages, removeMember, searchContacts, uploadFile } from './chatAPI'
import { deleteChannelProfileImage, updateChannelProfile, updateChannelProfileImage } from '../profile/profileAPI';

const initialState = {
    status: 'idle',
    error: null,
    contacts: [],
    chatType: null,
    isSearchingContacts: false,
    currentChat: null,
    chatMessages: [],
    DmContactList: [],
    filePath: null,
    isDownloading: false,
    isUploading: false,
    fileUploadProgress: 0,
    fileDownloadProgress: 0,
    channelList: [],
    channelMembers: [],
}

export const searchContactsAsync = createAsyncThunk(
    'chat/searchContacts',
    async (searchTerm) => {
        const response = await searchContacts(searchTerm);
        return response.data.contacts;
    })

export const getMessagesAsync = createAsyncThunk(
    'chat/getMessages',
    async ({ senderId, receiverId }) => {
        // console.log("getMessagesAsync", senderId, receiverId)
        const response = await getMessages(senderId, receiverId);
        return response.data;
    })

export const getDmContactListAsync = createAsyncThunk(
    'chat/getDmContactList',
    async () => {
        const response = await getDmContactList();
        return response.data.contacts;
    })

export const uploadFileAsync = createAsyncThunk(
    'chat/uploadFile',
    async (formData, { dispatch }) => {
        const response = await uploadFile(formData, dispatch);
        return response.data.filePath;
    })

export const downloadFileAsync = createAsyncThunk(
    'chat/downloadFile',
    async (filePath, { dispatch }) => {
        const response = await downloadFile(filePath, dispatch);
        return response.data;
    }
)

export const createChannelAsync = createAsyncThunk(
    'chat/createChannel',
    async ({ name, members }) => {
        const response = await createChannel(name, members);
        return response.data.channel;
    }
)

export const getChannelsAsync = createAsyncThunk(
    'chat/getChannels',
    async () => {
        const response = await getChannels();
        return response.data.channels;
    }
)

export const getChannelMessagesAsync = createAsyncThunk(
    'chat/getChannelMessages', async ({ channelId }) => {
        const response = await getChannelMessages(channelId);
        return response.data.channelMessages;
    }
)

export const getChannelMembersAsync = createAsyncThunk(
    'chat/getChannelMembers', async ({ channelId }) => {
        const response = await getChannelMembers(channelId);
        return response.data.members;
    }
)

export const removeMemberAsync = createAsyncThunk(
    'chat/removeMember', async ({ channelId, memberId }) => {
        const response = await removeMember(channelId, memberId);
        return response.data;
    })

export const addMembersAsync = createAsyncThunk(
    'chat/addMembers', async ({ channelId, members }) => {
        const reponse = await addMembers(channelId, members);
        return reponse.data;
    }
)

export const updateChannelProfileAsync = createAsyncThunk(
    'chat/updateChannelProfile', async (update) => {
        const response = await updateChannelProfile(update);
        return response.data;
    }
)

export const updateChannelProfileImageAsync = createAsyncThunk(
    'chat/updateChannelProfileImage', async ({ formData, channelId }) => {
        const response = await updateChannelProfileImage(formData, channelId);
        return response.data;
    }
)

export const deleteChannelProfileImageAsync = createAsyncThunk(
    'chat/deleteChannelProfileImage', async (channelId) => {
        const response = await deleteChannelProfileImage(channelId);
        return response.data;
    }
)

export const deleteDirectMessageAsync = createAsyncThunk(
    'chat/deleteDirectMessage',
    async (messageId) => {
        const response = await deleteDirectMessage(messageId);
        return response.data;
    }
)

export const deleteChannelMessageAsync = createAsyncThunk(
    'chat/deleteChannelMessage',
    async (channelMessageId) => {
        const response = await deleteChannelMessage(channelMessageId);
        return response.data;
    }
)

export const deleteChannelMessageByAdminAsync = createAsyncThunk(
    'chat/deleteChannelMessageByAdmin',
    async (channelMessageId) => {
        const response = await deleteChannelMessageByAdmin(channelMessageId);
        return response.data;
    }
)

export const chatSlice = createSlice({
    name: 'chat',
    initialState,
    reducers: {
        setCurrentChat: (state, action) => {
            state.currentChat = action.payload;
        },
        setContactsEmpty: (state) => {
            state.contacts = [];
        },
        setChatMessages: (state, action) => {
            const message = action.payload;
            if (state.chatType === 'channel') {
                state.chatMessages = [...state.chatMessages, message]
            } else {
                state.chatMessages = [
                    ...state.chatMessages,
                    { ...message, sender: message.sender._id, receiver: message.receiver._id }
                ];
            }
        },
        setChatMessagesEmpty: (state) => {
            state.chatMessages = [];
        },
        setChatType: (state, action) => {
            state.chatType = action.payload;
        },
        setFileUploadProgress: (state, action) => {
            state.fileUploadProgress = action.payload;
        },
        setFileDownloadProgress: (state, action) => {
            state.fileDownloadProgress = action.payload;
        },
        updateDmContactList: (state, action) => {
            if (action.payload.currentChat) {
                state.DmContactList.unshift(action.payload.currentChat);
            }
            else if (action.payload.index) {
                state.DmContactList.splice(action.payload.index, 1);
                state.DmContactList.unshift(state.currentChat);
            }
        },
        updateChannelList: (state, action) => {
            state.channelList.splice(action.payload, 1);
            state.channelList.unshift(state.currentChat);
        },
        setChannelMembersEmpty: (state, action) => {
            state.channelMembers = [];
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(searchContactsAsync.pending, (state) => {
                state.isSearchingContacts = true;
            })
            .addCase(searchContactsAsync.fulfilled, (state, action) => {
                state.isSearchingContacts = false;
                state.contacts = action.payload;
            })
            .addCase(searchContactsAsync.rejected, (state, action) => {
                state.isSearchingContacts = false;
                state.error = action.error.message;
            })
            .addCase(getMessagesAsync.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(getMessagesAsync.fulfilled, (state, action) => {
                state.status = 'idle';
                state.chatMessages = action.payload;
            })
            .addCase(getMessagesAsync.rejected, (state, action) => {
                state.status = 'error';
                state.error = action.error.message;
            })
            .addCase(getDmContactListAsync.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(getDmContactListAsync.fulfilled, (state, action) => {
                state.status = 'idle';
                state.DmContactList = action.payload;
            })
            .addCase(getDmContactListAsync.rejected, (state, action) => {
                state.status = 'error';
                state.error = action.error.message;
            })
            .addCase(uploadFileAsync.pending, (state) => {
                state.isUploading = true;
            })
            .addCase(uploadFileAsync.fulfilled, (state, action) => {
                state.isUploading = false;
                state.filePath = action.payload;
            })
            .addCase(uploadFileAsync.rejected, (state, action) => {
                state.isUploading = false;
                state.error = action.error.message;
            })
            .addCase(downloadFileAsync.pending, (state) => {
                state.isDownloading = true;
            })
            .addCase(downloadFileAsync.fulfilled, (state, action) => {
                state.isDownloading = false;
            })
            .addCase(downloadFileAsync.rejected, (state, action) => {
                state.isDownloading = false;
                state.error = action.error.message;
            })
            .addCase(createChannelAsync.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(createChannelAsync.fulfilled, (state, action) => {
                state.status = 'idle';
                state.channelList.unshift(action.payload);
            })
            .addCase(createChannelAsync.rejected, (state, action) => {
                state.status = 'error';
                state.error = action.error.message;
            })
            .addCase(getChannelsAsync.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(getChannelsAsync.fulfilled, (state, action) => {
                state.status = 'idle';
                state.channelList = action.payload;
            })
            .addCase(getChannelsAsync.rejected, (state, action) => {
                state.status = 'error';
                state.error = action.error.message;
            })
            .addCase(getChannelMessagesAsync.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(getChannelMessagesAsync.fulfilled, (state, action) => {
                state.status = 'idle';
                state.chatMessages = action.payload;
            })
            .addCase(getChannelMessagesAsync.rejected, (state) => {
                state.status = 'error';
            })
            .addCase(getChannelMembersAsync.fulfilled, (state, action) => {
                state.channelMembers = action.payload;
            })
            .addCase(removeMemberAsync.fulfilled, (state, action) => {
                state.channelMembers = state.channelMembers.filter(member => member._id !== action.payload.memberId);
            })
            .addCase(addMembersAsync.fulfilled, (state, action) => {
                state.channelMembers = action.payload.members;
            })
            .addCase(updateChannelProfileAsync.fulfilled, (state, action) => {
                const updatedChannel = action.payload;
                const index = state.channelList.findIndex(channel => channel._id === updatedChannel._id);
                if (index !== -1) {
                    state.channelList[index] = updatedChannel;
                }
                state.currentChat = updatedChannel;
            })
            .addCase(updateChannelProfileImageAsync.fulfilled, (state, action) => {
                const updatedChannel = action.payload;
                const index = state.channelList.findIndex(channel => channel._id === updatedChannel._id);
                if (index !== -1) {
                    state.channelList[index] = updatedChannel;
                }
                state.currentChat = updatedChannel;
            })
            .addCase(deleteChannelProfileImageAsync.fulfilled, (state, action) => {
                const { channelId } = action.payload;
                const index = state.channelList.findIndex(channel => channel._id === channelId);
                if (index !== -1) {
                    state.channelList[index].profileImage = null;
                }
                state.currentChat.profileImage = null;
            })
            .addCase(deleteDirectMessageAsync.fulfilled, (state, action) => {
                const { messageId } = action.payload;
                state.chatMessages = state.chatMessages.filter(message => message._id !== messageId);
            })
            .addCase(deleteChannelMessageAsync.fulfilled, (state, action) => {
                const { channelMessageId } = action.payload;
                state.chatMessages = state.chatMessages.filter(message => message._id !== channelMessageId);
            })
            .addCase(deleteChannelMessageByAdminAsync.fulfilled, (state, action) => {
                const channelMessageId = action.payload._id;
                const index = state.chatMessages.findIndex(message => message._id === channelMessageId);
                if (index !== -1) {
                    state.chatMessages[index] = action.payload;
                }
            })
    }
})

export const selectContacts = (state) => state.chat.contacts;
export const selectError = (state) => state.chat.error;
export const selectStatus = (state) => state.chat.status;
export const selectChatType = (state) => state.chat.chatType;
export const selectCurrentChat = (state) => state.chat.currentChat;
export const selectChatMessages = (state) => state.chat.chatMessages;
export const selectDmContactList = (state) => state.chat.DmContactList;
export const selectFilePath = (state) => state.chat.filePath;
export const selectIsDownloading = (state) => state.chat.isDownloading;
export const selectIsUploading = (state) => state.chat.isUploading;
export const selectFileUploadProgress = (state) => state.chat.fileUploadProgress;
export const selectFileDownloadProgress = (state) => state.chat.fileDownloadProgress;
export const selectIsSearchingContacts = (state) => state.chat.isSearchingContacts;
export const selectChannelList = (state) => state.chat.channelList;
export const selectChannelMembers = (state) => state.chat.channelMembers

export const { setCurrentChat, setContactsEmpty, setChatMessages, setChatType, setChatMessagesEmpty, setFileDownloadProgress, setFileUploadProgress, updateDmContactList, updateChannelList, setChannelMembersEmpty } = chatSlice.actions;
export default chatSlice.reducer