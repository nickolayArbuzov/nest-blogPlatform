type User = {
    userId: string,
}

declare namespace Express {
    export interface Request {
        user: User | undefined
    }
}