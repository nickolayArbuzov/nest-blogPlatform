type User = {
    id: string,
    login: string
}

declare namespace Express {
    export interface Request {
        user: User | undefined
    }
}