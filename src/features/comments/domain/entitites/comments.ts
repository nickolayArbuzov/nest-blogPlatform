export class Comment {
    blogOwnerUserId: string
    content: string
    createdAt: string
    commentatorInfo: CommentatorInfo
    postInfo: PostInfo
}

export class CommentatorInfo {
    userId: string
    userLogin: string
}

export class PostInfo {
    id: string
    title: string
    blogId: string
    blogName: string
}