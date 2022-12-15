export class Blog {
    name: string
    description: string
    websiteUrl: string
    createdAt: string
    blogOwnerInfo: BlogOwnerInfo
    banInfo: BanInfo
}

export class BlogOwnerInfo {
    userId: string
    userLogin: string
}

export class BanInfo {
    isBanned: boolean
    banDate: string
}