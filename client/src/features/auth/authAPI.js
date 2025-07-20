// export function createUser(userData) {
//     return new Promise(async (resolve, reject) => {
//         try {
//             const response = await fetch(`${import.meta.env.VITE_HOST}/auth/register`,
//                 {
//                     method: 'POST',
//                     credentials: 'include',
//                     headers: {
//                         'content-type': 'application/json',
//                     },
//                     body: JSON.stringify(userData)
//                 }
//             )
//             if (!response.ok) {
//                 const err = await response.json();
//                 // console.log("from createuser", err);
//                 throw err;
//             }
//             const data = await response.json();
//             // console.log("createUser", data)
//             resolve({ data });
//         } catch (error) {
//             reject(error);
//         }
//     })
// }

// export function checkUser(loginInfo) {
//     return new Promise(async (resolve, reject) => {
//         try {
//             const response = await fetch(`${import.meta.env.VITE_HOST}/auth/login`, {
//                 method: 'POST',
//                 credentials: 'include',
//                 headers: {
//                     'content-type': 'application/json',
//                 },
//                 body: JSON.stringify(loginInfo)
//             })
//             if (!response.ok) {
//                 const err = await response.json();
//                 throw err;
//             }
//             const data = await response.json();
//             // console.log("checkUser", data)
//             resolve({ data });
//         } catch (error) {
//             reject(error);
//         }
//     })
// }

// export function getLoggedInUser() {
//     return new Promise(async (resolve, reject) => {
//         try {
//             const response = await fetch(`${import.meta.env.VITE_HOST}/auth`, {
//                 method: 'GET',
//                 credentials: 'include',
//             })

//             if (!response.ok) {
//                 const err = await response.json();
//                 throw err;
//             }

//             const data = await response.json();
//             // console.log("getLoggedInUser", data)
//             resolve({ data });
//         } catch (error) {
//             reject(error);
//         }

//     })
// }

// export function signOut() {
//     return new Promise(async (resolve) => {

//         try {
//             const response = await fetch(`${import.meta.env.VITE_HOST}/auth/logout`, {
//                 method: 'GET',
//                 credentials: 'include',
//             })
//             if (!response.ok) {
//                 const err = await response.json();
//                 throw err;
//             }
//             const data = await response.json();
//             // console.log("signOut", data)
//             resolve({ data });
//         } catch (error) {
//             reject(error);
//         }
//     })
// }