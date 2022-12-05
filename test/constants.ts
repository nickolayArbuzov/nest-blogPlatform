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

class Variables {

    blogId = ''
    postId = ''
    commentId = ''
    userId = ''

    incorrectAnyEntityId = '638b5478fde32b4487e99999'

    setBlogId(blogId: string){
        this.blogId = blogId
    }
    setPostId(postId: string){
        this.postId = postId
    }
    setCommentId(commentId: string){
        this.commentId = commentId
    }
    setUserId(userId: string){
        this.userId = userId
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

    queryBlog, queryUser,

    variables,
}