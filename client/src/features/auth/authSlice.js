import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { checkUser, createUser, signOut, getLoggedInUser } from './authAPI'
import { deleteProfileImage, updateProfile, updateProfileImage } from '../profile/profileAPI'

const initialState = {
    status: {
        isCheckingUser: false,
        isGettingLoggedInUser: false,
    },
    loggedInUser: null,
    error: null,
}

export const createUserAsync = createAsyncThunk(
    'user/createUser',
    async (userData) => {
        const response = await createUser(userData);
        return response.data;
    })

export const checkUserAsync = createAsyncThunk(
    'user/checkUser',
    async (loginInfo) => {
        const response = await checkUser(loginInfo);
        return response.data;
    })

export const getLoggedInUserAsync = createAsyncThunk(
    'user/getLoggedInUser',
    async () => {
        const response = await getLoggedInUser();
        return response.data;
    })

export const updateProfileAsync = createAsyncThunk(
    'user/updateProfile',
    async (update) => {
        const response = await updateProfile(update);
        return response.data;
    }
);

export const updateProfileImageAsync = createAsyncThunk(
    'user/updateProfileImage',
    async (formData) => {
        const response = await updateProfileImage(formData);
        return response.data;
    }
);

export const deleteProfileImageAsync = createAsyncThunk(
    'user/deleteProfileImage',
    async () => {
        const response = await deleteProfileImage();
        return response.data;
    }
);

export const signOutAsync = createAsyncThunk(
    'user/signOut',
    async () => {
        const response = await signOut();
        return response.data;
    }
);

export const authSlice = createSlice({
    name: 'user',
    initialState,
    extraReducers: (builder) => {
        builder
            .addCase(createUserAsync.pending, (state, action) => {
                state.status.isCheckingUser = true;
            })
            .addCase(createUserAsync.fulfilled, (state, action) => {
                state.status.isCheckingUser = false;
                state.loggedInUser = action.payload;
            })
            .addCase(createUserAsync.rejected, (state, action) => {
                state.status.isCheckingUser = false;
            })

            // checkUserAsync
            .addCase(checkUserAsync.pending, (state, action) => {
                state.status.isCheckingUser = true;
            })
            .addCase(checkUserAsync.fulfilled, (state, action) => {
                state.status.isCheckingUser = false;
                state.loggedInUser = action.payload;
            })
            .addCase(checkUserAsync.rejected, (state, action) => {
                state.status.isCheckingUser = false;
            })

            // getLoggedInUserAsync
            .addCase(getLoggedInUserAsync.pending, (state, action) => {
                state.status.isGettingLoggedInUser = true;
                state.loggedInUser = action.payload;
            })
            .addCase(getLoggedInUserAsync.fulfilled, (state, action) => {
                state.status.isGettingLoggedInUser = false;
                state.loggedInUser = action.payload;
            })
            .addCase(getLoggedInUserAsync.rejected, (state, action) => {
                state.status.isGettingLoggedInUser = false;
                state.loggedInUser = action.payload;
            })

            .addCase(updateProfileAsync.fulfilled, (state, action) => {
                state.loggedInUser = action.payload;
            })

            .addCase(updateProfileImageAsync.fulfilled, (state, action) => {
                state.loggedInUser = action.payload;
            })

            .addCase(signOutAsync.fulfilled, (state, action) => {
                state.loggedInUser = null;
            })
    }
})

export const selectLoggedInUser = (state) => state.auth.loggedInUser;
export const selectError = (state) => state.auth.error;
export const selectIsCheckingUser = (state) => state.auth.status.isCheckingUser;
export const selectIsGettingLoggedInUser = (state) => state.auth.status.isGettingLoggedInUser;
export const selectStatus = (state) => state.auth.status;

export default authSlice.reducer