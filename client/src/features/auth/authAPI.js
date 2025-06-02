export function createUser(userData) {
    return new Promise(async (resolve) => {
        //TODO: we will not hard-code server URL here
        // console.log(userData)
        const response = await fetch(`${import.meta.env.VITE_HOST}/auth/register`,
            {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'content-type': 'application/json',
                },
                body: JSON.stringify(userData)
            }
        )
        const data = await response.json();
        // console.log("createUser", data)
        resolve({ data })
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