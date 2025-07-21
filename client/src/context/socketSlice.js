import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    isSendingMessage: false,
    isDeletingDmMessage: false,
    isDeletingChannelMessage: false,
    deletingDmMessageId: null, 
    deletingChannelMessageId: null,
}

export const socketSlice = createSlice({
    name: 'socket',
    initialState,
    reducers: {
        setIsSendingMessage: (state, action) => {
            state.isSendingMessage = action.payload;
        },
        setIsDeletingDmMessage: (state, action) => {
            state.isDeletingDmMessage = action.payload;
        },
        setIsDeletingChannelMessage: (state, action) => {
            state.isDeletingChannelMessage = action.payload;
        },
        setDeletingDmMessageId: (state, action) => {
            state.deletingDmMessageId = action.payload;
        },
        setDeletingChannelMessageId: (state, action) => {
            state.deletingChannelMessageId = action.payload;
        },
    },
});


export const selectIsSendingMessage = (state) => state.socket.isSendingMessage;
export const selectIsDeletingDmMessage = (state) => state.socket.isDeletingDmMessage;
export const selectIsDeletingChannelMessage = (state) => state.socket.isDeletingChannelMessage;
export const selectDeletingDmMessageId = (state) => state.socket.deletingDmMessageId;
export const selectDeletingChannelMessageId = (state) => state.socket.deletingChannelMessageId

export const { setIsSendingMessage, setIsDeletingDmMessage, setIsDeletingChannelMessage, setDeletingDmMessageId, setDeletingChannelMessageId } = socketSlice.actions;
export default socketSlice.reducer