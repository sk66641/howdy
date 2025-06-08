import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { getDmContactList, getMessages, searchContacts, uploadFile } from './chatAPI'
// import { set } from 'mongoose';
// import { act } from 'react';
// import usestate
// import { deleteProfileImage, updateProfile, updateProfileImage } from '../profile/profileAPI'

const initialState = {
    contacts: null,
    status: 'idle',
    error: null,
    selectedChatType: null,
    selectedContact: null,
    selectedChatMessages: [],
    DmContactList: [],
    filePath: null,
    isDownloading: false,
    isUploading: false,
    fileUploadProgress: 0,
    fileDownloadProgress: 0,
}

export const searchContactsAsync = createAsyncThunk(
    'chat/searchContacts',
    async (searchTerm) => {
        const response = await searchContacts(searchTerm);
        // console.log("createAsyncThunk", response)
        return response.data.contacts;
    })

export const getMessagesAsync = createAsyncThunk(
    'chat/getMessages',
    async ({ senderId, receiverId }) => {
        console.log("getMessagesAsync", senderId, receiverId)
        const response = await getMessages(senderId, receiverId);
        // console.log("createAsyncThunk", response)
        return response.data;
    })

export const getDmContactListAsync = createAsyncThunk(
    'chat/getDmContactList',
    async (userId) => {
        const response = await getDmContactList(userId);
        // console.log("getdm", response)
        return response.data.contacts;
    })

export const uploadFileAsync = createAsyncThunk(
    'chat/uploadFile',
    async (formData) => {
        const response = await uploadFile(formData);
        // console.log("uploadFileAsync", response)
        return response.data.filePath;
    })

export const chatSlice = createSlice({
    name: 'chat',
    initialState,
    reducers: {
        setSelectedContact: (state, action) => {
            state.selectedContact = action.payload;
        },
        setContactsNull: (state) => {
            state.contacts = null;
        },
        setSelectedChatMessages: (state, action) => {
            const message = action.payload;
            if (state.selectedChatType === 'channel') {
                state.selectedChatMessages = [...state.selectedChatMessages, message]
            } else {
                state.selectedChatMessages = [
                    ...state.selectedChatMessages,
                    { ...message, sender: message.sender._id, receiver: message.receiver._id }
                ];
            }
        },
        EmptySelectedChatMessages: (state) => {
            state.selectedChatMessages = [];
        },
        setSelectedChatType: (state, action) => {
            console.log(action.payload, "setSelectedChatType")
            state.selectedChatType = action.payload;
        },
        setIsDownloading: (state, action) => {
            state.isDownloading = action.payload;
        },
        setIsUploading: (state, action) => {
            state.isUploading = action.payload;
        },
        setFileUploadProgress: (state, action) => {
            state.fileUploadProgress = action.payload;
        },
        setFileDownloadProgress: (state, action) => {
            state.fileDownloadProgress = action.payload;
        },
        // increment: (state) => {
        //     state.value += 1;
        // },
        // decrement: (state) => {
        //     state.value -= 1;
        // },
        // incrementByAmount: (state, action) => {
        //     state.value += action.payload;
        // },
    },
    extraReducers: (builder) => {
        builder
            .addCase(searchContactsAsync.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(searchContactsAsync.fulfilled, (state, action) => {
                state.status = 'idle';
                state.contacts = action.payload;
            })
            .addCase(searchContactsAsync.rejected, (state, action) => {
                state.status = 'error';
                state.error = action.error.message;
            })
            .addCase(getMessagesAsync.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(getMessagesAsync.fulfilled, (state, action) => {
                state.status = 'idle';
                state.selectedChatMessages = action.payload;
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
                state.status = 'loading';
            })
            .addCase(uploadFileAsync.fulfilled, (state, action) => {
                state.status = 'idle';
                state.filePath = action.payload;
            })
            .addCase(uploadFileAsync.rejected, (state, action) => {
                state.status = 'error';
                state.error = action.error.message;
            })
        // .addCase(checkUserAsync.pending, (state) => {
        //     state.status = 'loading';
        // })
    }
})

export const selectContacts = (state) => state.chat.contacts;
export const selectError = (state) => state.chat.error;
export const selectStatus = (state) => state.chat.status;
export const selectSelectedChatType = (state) => state.chat.selectedChatType;
export const selectSelectedContact = (state) => state.chat.selectedContact;
export const selectSelectedChatMessages = (state) => state.chat.selectedChatMessages;
export const selectDmContactList = (state) => state.chat.DmContactList;
export const selectFilePath = (state) => state.chat.filePath;
export const selectIsDownloading = (state) => state.chat.isDownloading;
export const selectIsUploading = (state) => state.chat.isUploading;
export const selectFileUploadProgress = (state) => state.chat.fileUploadProgress;
export const selectFileDownloadProgress = (state) => state.chat.fileDownloadProgress;
// export const { increment, decrement, incrementByAmount } = counterSlice.actions

export const { setSelectedContact, setContactsNull, setSelectedChatMessages, setSelectedChatType, EmptySelectedChatMessages, setIsDownloading, setIsUploading, setFileDownloadProgress, setFileUploadProgress } = chatSlice.actions;
export default chatSlice.reducer