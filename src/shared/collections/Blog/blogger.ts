export class Blog {
    name: string
    description: string
    websiteUrl: string
    createdAt: string
    blogOwnerInfo: BlogOwnerInfo
}

export class BlogOwnerInfo {
    userId: string
    userLogin: string
}