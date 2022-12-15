export class Blog {
    name: string
    description: string
    websiteUrl: string
    createdAt: string
    blogOwnerInfo: BlogOwnerInfo
    banInfo: BanBlogInfo
}

export class BlogOwnerInfo {
    userId: string
    userLogin: string
}

export class BanBlogInfo {
    isBanned: boolean
    banDate: string
}