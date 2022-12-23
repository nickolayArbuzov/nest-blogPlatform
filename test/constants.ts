const createBlog1 = {
    name: "blog-1",
    description: "description-1",
    websiteUrl: "https://siteBlog.com"
}
const createBlog2 = {
    name: "blogg-2",
    description: "description-2",
    websiteUrl: "https://siteBlog.com"
}
const createBlog3 = {
    name: "blogg-3",
    description: "description-3",
    websiteUrl: "https://siteBlog.com"
}
const createBlog4 = {
    name: "blogg-4",
    description: "description-4",
    websiteUrl: "https://siteBlog.com"
}
const updateBlog = {
    name: "update-blogg-4",
    description: "update-description-4",
    websiteUrl: "https://update-siteBlog.com"
}
const incorrectUpdateBlog = {
    name: "     ",
    description: "update-description-4",
    websiteUrl: "https://update-siteBlog.com"
}
const incorrectCreateBlog = {
    name: "",
    description: "",
    websiteUrl: "siteBlog.com"
}

const createPost1 = {
    title: "post-1",
    shortDescription: "shortDescription-1",
    content: "content-1",
}
const createPost2 = {
    title: "post-2",
    shortDescription: "shortDescription-2",
    content: "content-2",
}
const createPost3 = {
    title: "post-3",
    shortDescription: "shortDescription-3",
    content: "content-3",
}
const createPost4 = {
    title: "post-4",
    shortDescription: "shortDescription-4",
    content: "content-4",
}
const updatePost = {
    title: "update-post-4",
    shortDescription: "update-shortDescription-4",
    content: "update-content-4",
}
const incorrectCreatePost = {
    title: "",
    shortDescription: "shortDescription-4",
    content: "content-4",
}
const incorrectUpdatePost = {
    title: "",
    shortDescription: "shortDescription-4",
    content: "content-4",
}

const createUser1 = {
    login: 'login-1',
    password: "password-1",
    email: "email-1@mail.com"
}
const createUser2 = {
    login: 'login-2',
    password: "password-2",
    email: "email-2@mail.com"
}
const createUser3 = {
    login: 'login-3',
    password: "password-3",
    email: "email-3@mail.com"
}
const createUser4 = {
    login: 'login-4',
    password: "password-4",
    email: "email-4@mail.com"
}
const incorrectCreateUser = {
    login: "",
    password: "",
    email: "siteBlog.com"
}

const correctRegistartionUser = {
    login: 'login-5',
    password: "password-5",
    email: "email-5@mail.com"
}

const incorrectRegistartionUser = {
    login: 'login-1',
    password: "password-1",
    email: "email-1@mail.com"
}

const correctLoginUser = {
    loginOrEmail: 'login-1',
    password: "password-1",
}

const correctLoginUser2 = {
    loginOrEmail: 'login-2',
    password: "password-2",
}

const correctLoginUser3 = {
    loginOrEmail: 'login-3',
    password: "password-3",
}

const correctLoginUser4 = {
    loginOrEmail: 'login-4',
    password: "password-4",
}

const incorrectLoginUser = {
    loginOrEmail: 'login-1',
    password: "password-10",
}
const notExistLoginUser = {
    loginOrEmail: 'login-10',
    password: "password-10",
}

const createComment = {
    content: 'content-content-content'
}

const updateComment = {
    content: 'content-content-content-update'
}

const incorrectCreateComment = {
    content: 'content'
}

const queryBlog = {
    pageNumber: '2',
    pageSize: '2', 
    sortBy: 'createdAt', 
    sortDirection: 'asc',
    searchNameTerm: 'gg',
}

const queryUser = {
    pageNumber: '1',
    pageSize: '2', 
    sortBy: 'createdAt', 
    sortDirection: 'asc',
    searchLoginTerm: '4',
    searchEmailTerm: '3',
}

let like = {
    likeStatus: 'Like'
}
let dislike = {
    likeStatus: 'Dislike'
}
let none = {
    likeStatus: 'None'
}

let ban = {
    isBanned: true,
    banReason: "stringstringstringst",
}
let unban = {
    isBanned: false,
    banReason: "stringstringstringst",
}

class Variables {

    blogId = ''
    blogId2 = ''
    postId = ''
    postId2 = ''
    commentId = ''
    commentId2 = ''
    commentId3 = ''
    userId = ''
    userId2 = ''
    accessToken = ''
    accessToken2 = ''
    accessToken3 = ''
    accessToken4 = ''
    // cookies for different users
    cookie = ''
    cookie2 = ''
    // cookies for one user in refresh-tokens case
    cookiePrev = ''
    cookieAfter = ''

    deviceId = ''

    incorrectAnyObjectId = '638b5478fde32b4487e99999'
    incorrectAnyUUID = 'b252c185-7777-4444-7777-8b6f242a2ff8'
    incorrectToken = '77777GciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MzkyM2I5NTVlZTgwZDRkZGIyYzdlMjEiLCJkZXZpY2VJZCI6IjEwNzMxMjFjLTM1YWQtNGMyMi04ZTFhLWM2NTNmMzhkYmJmMyIsImlzc3VlZEF0IjoxNjcwNTI3ODkzMjg5LCJpYXQiOjE2NzA1Mjc4OTMsImV4cCI6MTY3MDUyODE5M30.53_vG0GlhTqXosc2sq2-TnzxEyItCLrDHw8ZJjWRSQc'

    setBlogId(blogId: string){
        this.blogId = blogId
    }
    setBlogId2(blogId2: string){
        this.blogId2 = blogId2
    }
    setPostId(postId: string){
        this.postId = postId
    }
    setPostId2(postId2: string){
        this.postId2 = postId2
    }
    setCommentId(commentId: string){
        this.commentId = commentId
    }
    setCommentId2(commentId2: string){
        this.commentId2 = commentId2
    }
    setCommentId3(commentId3: string){
        this.commentId3 = commentId3
    }
    setUserId(userId: string){
        this.userId = userId
    }
    setUserId2(userId2: string){
        this.userId2 = userId2
    }
    setAccessToken(accessToken: string){
        this.accessToken = accessToken
    }
    setAccessToken2(accessToken2: string){
        this.accessToken2 = accessToken2
    }
    setAccessToken3(accessToken3: string){
        this.accessToken3 = accessToken3
    }
    setAccessToken4(accessToken4: string){
        this.accessToken4 = accessToken4
    }
    setCookie(cookie: string){
        this.cookie = cookie
    }
    setCookie2(cookie2: string){
        this.cookie2 = cookie2
    }
    setDeviceId(deviceId: string){
        this.deviceId = deviceId
    }
    setCookiePrev(cookiePrev: string){
        this.cookiePrev = cookiePrev
    }
    setCookieAfter(cookieAfter: string){
        this.cookieAfter = cookieAfter
    }
}

const variables = new Variables()

export {
    createBlog1, createBlog2, createBlog3, createBlog4, 
    incorrectCreateBlog, 
    updateBlog, 
    incorrectUpdateBlog,

    createPost1, createPost2, createPost3, createPost4,
    incorrectCreatePost,
    updatePost,
    incorrectUpdatePost,

    createUser1, createUser2, createUser3, createUser4,
    incorrectCreateUser,

    correctRegistartionUser, incorrectRegistartionUser,

    correctLoginUser, correctLoginUser2, correctLoginUser3, correctLoginUser4, incorrectLoginUser, notExistLoginUser,

    createComment, updateComment, incorrectCreateComment,

    queryBlog, queryUser,

    like, dislike, none,

    ban, unban,

    variables,
}
