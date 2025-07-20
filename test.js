// src/features/auth/useAuth.js

import { useMemo } from 'react';
import {
    useGetLoggedInUserQuery,
    useLoginMutation,
    useLogoutMutation,
    useCreateUserMutation,
    // Import other hooks if you have them, e.g., for profile updates
    useUpdateProfileMutation,
} from './authApi';

export const useAuth = () => {
    // 1. Call all the hooks at the top level
    const { data: user, isLoading: isUserLoading, isError: isUserError, error: userError } = useGetLoggedInUserQuery();
    
    const [login, { isLoading: isLoginLoading, isError: isLoginError, error: loginError }] = useLoginMutation();
    
    const [logout, { isLoading: isLogoutLoading, isError: isLogoutError, error: logoutError }] = useLogoutMutation();
    
    const [createUser, { isLoading: isCreatingUserLoading, isError: isCreatingUserError, error: creatingUserError }] = useCreateUserMutation();
    
    const [updateProfile, { isLoading: isUpdatingProfileLoading }] = useUpdateProfileMutation();


    // 2. Consolidate the states into single, easy-to-use variables
    
    // The user is authenticated if the user query has successfully returned a user object
    const isAuthenticated = !!user;

    // The app is in a loading state if any of the auth-related operations are running
    const isLoading = isUserLoading || isLoginLoading || isLogoutLoading || isCreatingUserLoading || isUpdatingProfileLoading;

    // An error has occurred if any of the operations have failed
    const isError = isUserError || isLoginError || isLogoutError || isCreatingUserError;
    
    // Find the first error object to display (optional, but helpful)
    const error = userError || loginError || logoutError || creatingUserError;


    // 3. Return a single object with a clean API
    // useMemo ensures this object is not recreated on every render unless its dependencies change.
    return useMemo(() => ({
        // States
        user,
        isAuthenticated,
        isLoading,
        isError,
        error,

        // Functions (the trigger functions from the mutations)
        login,
        logout,
        createUser,
        updateProfile,

    }), [user, isAuthenticated, isLoading, isError, error, login, logout, createUser, updateProfile]);
};