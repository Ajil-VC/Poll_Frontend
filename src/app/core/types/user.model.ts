export interface User {

    name: string,
    email: string,
    password: string,
    profilePicUrl: {
        type: {
            public_id: string,
            url: string
        }
    }
}