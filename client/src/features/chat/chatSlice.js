import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { searchContacts } from './chatAPI'
// import { deleteProfileImage, updateProfile, updateProfileImage } from '../profile/profileAPI'

const initialState = {
    contacts: null,
    status: 'idle',
    error: null,
    selectedContact: null,
}

export const searchContactsAsync = createAsyncThunk(
    'chat/searchContacts',
    async (searchTerm) => {
        const response = await searchContacts(searchTerm);
        // console.log("createAsyncThunk", response)
        return response.data.contacts;
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
            // .addCase(checkUserAsync.pending, (state) => {
            //     state.status = 'loading';
            // })
    }
})

export const selectContacts = (state) => state.chat.contacts;
export const selectError = (state) => state.chat.error;
export const selectStatus = (state) => state.chat.status;
export const selectSelectedContact = (state) => state.chat.selectedContact;
// export const { increment, decrement, incrementByAmount } = counterSlice.actions

export const { setSelectedContact, setContactsNull } = chatSlice.actions;
export default chatSlice.reducer