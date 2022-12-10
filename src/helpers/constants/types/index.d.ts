type User = {
    userId: string,
    userLogin: string,
}

declare namespace Express {
    export interface Request {
        user: User | undefined
    }
}