import { configureStore } from '@reduxjs/toolkit';
// 👇 1. Import the new authApi
import { authApi } from '../features/auth/authApi2'; 
import chatReducer from '../features/chat/chatSlice';
import { chatApi } from '../features/chat/chatApi2';

export default configureStore({
    reducer: {
        // 👇 2. Add the API reducer under its reducerPath
        [authApi.reducerPath]: authApi.reducer,
        [chatApi.reducerPath]: chatApi.reducer,
        // You can keep your other reducers
        chat: chatReducer,
    },
    // 👇 3. Add the RTK Query middleware for both APIs
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(authApi.middleware, chatApi.middleware),
});