import axios from 'axios';
import { setFileUploadProgress } from './chatSlice';
import { useDispatch } from 'react-redux';

export function searchContacts(searchQuery) {
    return new Promise(async (resolve) => {
        //TODO: we will not hard-code server URL here
        // console.log(searchQuery)
        const response = await fetch(`${import.meta.env.VITE_HOST}/chat/contacts`,
            {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'content-type': 'application/json',
                },
                body: JSON.stringify(searchQuery)
            }
        )
        const data = await response.json();
        // console.log("createUser", data)
        resolve({ data });
    })
}

export function checkUser(loginInfo) {
    return new Promise(async (resolve, reject) => {
        // const email = loginInfo.email;
        // const password = loginInfo.password;
        //TODO: we will not hard-code server URL here
        // console.log(userData)


        try {
            const response = await fetch(`${import.meta.env.VITE_HOST}/auth/login`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'content-type': 'application/json',
                },
                body: JSON.stringify(loginInfo)
            })
            if (!response.ok) {
                const err = await response.json();
                throw err;
            }
            const data = await response.json();
            resolve({ data });
        } catch (error) {
            reject(error);
        }
        // if (data.length) {
        //     if (password === data[0].password) {
        //         resolve({ data: data[0] })
        //     }
        //     else {
        //         reject({ message: 'invalid credentials' })
        //     }
        // }
        // else {
        //     reject({ message: 'user not found' })
        // }
        // console.log("createUser", data)
        // resolve({ data })
    })
}

export function checkToken() {
    return new Promise(async (resolve, reject) => {
        // const email = loginInfo.email;
        // const password = loginInfo.password;
        //TODO: we will not hard-code server URL here
        // console.log(userData)


        try {
            const response = await fetch(`${import.meta.env.VITE_HOST}/auth`, {
                method: 'GET',
                credentials: 'include',
            })
            if (!response.ok) {
                const err = await response.json();
                throw err;
            }
            const data = await response.json();
            // console.log("client here", data);
            resolve({ data });
        } catch (error) {
            reject(error);
        }
        // if (data.length) {
        //     if (password === data[0].password) {
        //         resolve({ data: data[0] })
        //     }
        //     else {
        //         reject({ message: 'invalid credentials' })
        //     }
        // }
        // else {
        //     reject({ message: 'user not found' })
        // }
        // console.log("createUser", data)
        // resolve({ data })
    })
}

export function signOut() {
    return new Promise(async (resolve) => {

        try {
            const response = await fetch(`${import.meta.env.VITE_HOST}/auth/logout`, {
                method: 'GET',
                credentials: 'include',
            })
            if (!response.ok) {
                const err = await response.json();
                throw err;
            }
            const data = await response.json();
            resolve({ data });
        } catch (error) {
            reject(error);
        }
    })
}

export function getMessages(senderId, receiverId) {
    return new Promise(async (resolve, reject) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_HOST}/messages?senderId=${senderId}&receiverId=${receiverId}`, {
                method: 'GET',
                credentials: 'include',
            })
            if (!response.ok) {
                const err = await response.json();
                throw err;
            }
            const data = await response.json();
            resolve({ data });
        } catch (error) {
            reject(error);
        }
    })
}

export function getDmContactList(userId) {
    return new Promise(async (resolve, reject) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_HOST}/chat/getdmcontacts?userId=${userId}`, {
                method: 'GET',
                credentials: 'include',
            })
            if (!response.ok) {
                const err = await response.json();
                throw err;
            }
            const data = await response.json();
            resolve({ data });
        } catch (error) {
            reject(error);
        }
    })
}

export function uploadFile(formData, dispatch) {
    // const dispatch = useDispatch();
    // console.log("uploadFile called", formData);

    return new Promise(async (resolve, reject) => {
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_HOST}/messages/uploadFile`, formData,
                {
                    withCredentials: true,
                    onUploadProgress: (progressEvent) => {
                        const { loaded, total } = progressEvent;
                        const percentCompleted = Math.round((loaded * 100) / total);
                        dispatch(setFileUploadProgress(percentCompleted));
                    }
                }
            );
            resolve({ data: response.data });
        } catch (error) {
            reject(error);
        }
    });
}


// import axios from 'axios';
// import { setFileDownloadProgress, setIsDownloading } from './chatSlice';

export function downloadFile(filePath, dispatch) {
    return new Promise(async (resolve, reject) => {
        try {
            //   dispatch(setIsDownloading(true));

            const response = await axios.get(`${import.meta.env.VITE_HOST}/${filePath}`, {
                responseType: 'blob',
                withCredentials: true,
                onDownloadProgress: (progressEvent) => {
                    const { loaded, total } = progressEvent;
                    if (total) {
                        const percentCompleted = Math.round((loaded * 100) / total);
                        dispatch(setFileUploadProgress(percentCompleted));
                    }
                }
            });

            const blob = response.data;
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = filePath.split('/').pop(); // Get the filename
            document.body.appendChild(link);
            link.click();

            // Cleanup
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);

            //   dispatch(setIsDownloading(false));
            resolve({ data: { message: "success" } }); // Resolve the Promise on success
        } catch (error) {
            //   dispatch(setIsDownloading(false));
            console.error('File download failed:', error);
            reject(error); // Reject on error
        }
    });
}


export function createChannel(name, members, userId) {
    return new Promise(async (resolve, reject) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_HOST}/channels`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'content-type': 'application/json',
                },
                body: JSON.stringify({ name, members, userId })
            });
            if (!response.ok) {
                const err = await response.json();
                throw err;
            }
            const data = await response.json();
            resolve({ data });
        } catch (error) {
            reject(error);
        }
    });
}

export const getChannels = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_HOST}/channels/${userId}`, {
                method: 'GET',
                credentials: 'include',
            });
            if (!response.ok) {
                const err = await response.json();
                throw err;
            }
            const data = await response.json();
            resolve({ data });
        } catch (error) {
            reject(error);
        }
    });
}

export const getChannelMessages = (channelId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_HOST}/channels/messages/${channelId}`, {
                method: "GET",
                credentials: 'include',
            })
            if (!response.ok) {
                const err = await response.json();
                throw err;
            }
            const data = await response.json();
            resolve({ data });
        } catch (error) {
            reject(error);
        }
    })
}