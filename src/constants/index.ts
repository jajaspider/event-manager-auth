export const ErrorCodes = {
    USER: {
        ID_REQUIRED: {
            message: 'user_id is required',
            status: 400,
            error: 'Required parameter is missing'
        },
        PASSWORD_REQUIRED: {
            message: 'password is required',
            status: 400,
            error: 'Required parameter is missing'
        },
        NICKNAME_REQUIRED: {
            message: 'nickname is required',
            status: 400,
            error: 'Required parameter is missing'
        },
        USER_ID_TAKEN: {
            message: 'This user_id is already taken',
            status: 409,
            error: 'Resource already exists'
        },
        NICKNAME_TAKEN: {
            message: 'This nickname is already taken',
            status: 409,
            error: 'Resource already exists'
        },
        USER_NOT_FOUND: {
            message: 'User not found',
            status: 404
        },

    },
    AUTH: {
        INVALID_CREDENTIALS: {
            message: 'Invalid credentials',
            status: 401,
            error: 'Unauthorized'
        },
    }
} as const;
