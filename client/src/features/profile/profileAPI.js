export function updateProfile(update) {
    return new Promise(async (resolve) => {
        //TODO: we will not hard-code server URL here
        // console.log(update)
        // console.log(update,update.id)
        const response = await fetch(`${import.meta.env.VITE_HOST}/profile/` + update._id,
            {
                method: 'PATCH',
                headers: {
                    'content-type': 'application/json',
                },
                body: JSON.stringify(update)
            }
        )
        const data = await response.json();
        // console.log(data)
        // console.log("createUser", data)
        resolve({ data })
    })
}

export function updateProfileImage(formData, id) {
    return new Promise(async (resolve) => {
        const response = await fetch(`${import.meta.env.VITE_HOST}/profile/image/` + id,
            {
                method: 'POST',
                body: formData
            }
        )
        const data = await response.json();
        // console.log(data)
        // console.log("createUser", data)
        resolve({ data })
    })
}

export function deleteProfileImage(id) {
    return new Promise(async (resolve) => {
        const response = await fetch(`${import.meta.env.VITE_HOST}/profile/image/` + id,
            {
                method: 'DELETE',
            }
        )
        const data = await response.json();
        // console.log(data)
        // console.log("createUser", data)
        resolve({ data })
    })
}