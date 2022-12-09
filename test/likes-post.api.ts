/*import request from 'supertest'
import { app } from '../app'

jest.setTimeout(10000)
describe('/users', () => {

    let inputModelBlog1 = {
        name: 'blog-1',
        description: 'blogDescription',
        websiteUrl: 'https://someurl1.com',
    }

    let inputModelPost1 = {
        title: "title-1",
        shortDescription: "postDescription",
        content: "content-1",
    }
    
    let inputModelPost2 = {
        title: "title-2",
        shortDescription: "postDescription2",
        content: "content-2",
    }

    let inputModelComment1 = {
        content: "commentContent-commentContent1"
    }

    let inputModelComment2 = {
        content: "commentContent-commentContent2"
    }

    let inputModelUser1 = {
        login: 'login-1',
        password: "password-1",
        email: "nickarbuzov@yandex.by",
    }
    let inputModelUser2 = {
        login: 'login-2',
        password: "password-2",
        email: "www.mail-2@mail.com",
    }
    let inputModelUser3 = {
        login: 'login-3',
        password: "password-3",
        email: "www.mail-3@mail.com",
    }
    let inputModelUser4 = {
        login: 'login-4',
        password: "password-4",
        email: "www.mail-4@mail.com",
    }
    let correctInputModelAuth = {
        loginOrEmail: 'nickarbuzov@yandex.by',
        password: "password-1",
    }
    let correctInputModelAuth2 = {
        loginOrEmail: 'login-2',
        password: "password-2",
    }
    let correctInputModelAuth3 = {
        loginOrEmail: 'login-3',
        password: "password-3",
    }
    let correctInputModelAuth4 = {
        loginOrEmail: 'login-4',
        password: "password-4",
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

    let blogId = ''
    let postId1 = ''
    let postId2 = ''
    let incorrectPostId = '00069c64a0c81fa0b9b26070'
    let commentId1 = ''
    let commentId2 = ''
    let incorrectCommentId = '99969c64a0c81fa0b9b26070'
    let accessToken1 = ''
    let accessToken2 = ''
    let accessToken3 = ''
    let accessToken4 = ''
    let cookie1 = ''
    let cookie2 = ''

    it('should delete all data', async () => {
        await request(app).delete('/testing/all-data').expect(204)
    })

    it('should seed start data', async () => {
        // create two registration
        await request(app).post('/auth/registration').send(inputModelUser1)
        await request(app).post('/auth/registration').send(inputModelUser2)
        await request(app).post('/auth/registration').send(inputModelUser3)
        await request(app).post('/auth/registration').send(inputModelUser4)

        // create two login and get some access-tokens and cookies
        const auth1 = await request(app).post('/auth/login').send(correctInputModelAuth)
        accessToken1 = auth1.body.accessToken
        cookie1 = auth1.header['set-cookie']
        const auth2 = await request(app).post('/auth/login').send(correctInputModelAuth2)
        accessToken2 = auth2.body.accessToken
        cookie2 = auth2.header['set-cookie']
        const auth3 = await request(app).post('/auth/login').send(correctInputModelAuth3)
        accessToken3 = auth3.body.accessToken
        const auth4 = await request(app).post('/auth/login').send(correctInputModelAuth4)
        accessToken4 = auth4.body.accessToken

        // create one blog
        const blog = await request(app).post('/blogs').set('Authorization', 'Basic YWRtaW46cXdlcnR5').send(inputModelBlog1)
        blogId = blog.body.id

        // create two posts for this blog and get postId's
        const post1 = await request(app).post(`/blogs/${blogId}/posts`).set('Authorization', 'Basic YWRtaW46cXdlcnR5').send(inputModelPost1)
        postId1 = post1.body.id
        expect(post1.body).toStrictEqual(
            {
                id: expect.any(String),
                title: expect.any(String),
                shortDescription: expect.any(String),
                content: expect.any(String),
                blogId: expect.any(String),
                blogName: expect.any(String),
                createdAt: expect.any(String),
                extendedLikesInfo: {
                    likesCount: 0,
                    dislikesCount: 0,
                    myStatus: "None",
                    newestLikes: [],
                }
            }
          )
        const post2 = await request(app).post(`/blogs/${blogId}/posts`).set('Authorization', 'Basic YWRtaW46cXdlcnR5').send(inputModelPost2)
        postId2 = post2.body.id

        // create two comments for one of the post and get commentId's
        const comment1 = await request(app).post(`/posts/${postId1}/comments`).set('Authorization', `Bearer ${accessToken1}`).send(inputModelComment1)
        commentId1 = comment1.body.id
        const comment2 = await request(app).post(`/posts/${postId1}/comments`).set('Authorization', `Bearer ${accessToken2}`).send(inputModelComment2)
        commentId2 = comment2.body.id
    })

    it('should return postsbyId after likes', async () => {
        // create like/dislike for post from both users
        await request(app).put(`/posts/${postId1}/like-status`).set('Authorization', `Bearer ${accessToken1}`).send(like)
        await request(app).put(`/posts/${postId1}/like-status`).set('Authorization', `Bearer ${accessToken2}`).send(like)
        await request(app).put(`/posts/${postId1}/like-status`).set('Authorization', `Bearer ${accessToken3}`).send(like)
        await request(app).put(`/posts/${postId1}/like-status`).set('Authorization', `Bearer ${accessToken4}`).send(like)

        const PostByIdForFirstUser = await request(app).get(`/posts/${postId1}`).set('Authorization', `Bearer ${accessToken1}`)
        expect(PostByIdForFirstUser.body).toStrictEqual(
            {
                id: expect.any(String),
                title: expect.any(String),
                shortDescription: expect.any(String),
                content: expect.any(String),
                blogId: expect.any(String),
                blogName: expect.any(String),
                createdAt: expect.any(String),
                extendedLikesInfo: {
                    likesCount: 4,
                    dislikesCount: 0,
                    myStatus: "Like",
                    newestLikes: [
                        {
                            addedAt: expect.any(String),
                            userId: expect.any(String),
                            login: 'login-4'
                        },
                        {
                            addedAt: expect.any(String),
                            userId: expect.any(String),
                            login: "login-3"
                        },
                        {
                            addedAt: expect.any(String),
                            userId: expect.any(String),
                            login: "login-2"
                        }
                    ],
                }
            },
        )

        const PostByIdForSecondUser = await request(app).get(`/posts/${postId1}`).set('Authorization', `Bearer ${accessToken2}`)
        expect(PostByIdForSecondUser.body).toStrictEqual(
            {
                id: expect.any(String),
                title: expect.any(String),
                shortDescription: expect.any(String),
                content: expect.any(String),
                blogId: expect.any(String),
                blogName: expect.any(String),
                createdAt: expect.any(String),
                extendedLikesInfo: {
                    likesCount: 4,
                    dislikesCount: 0,
                    myStatus: "Like",
                    newestLikes: [
                        {
                            addedAt: expect.any(String),
                            userId: expect.any(String),
                            login: "login-4"
                        },
                        {
                            addedAt: expect.any(String),
                            userId: expect.any(String),
                            login: "login-3"
                        },
                        {
                            addedAt: expect.any(String),
                            userId: expect.any(String),
                            login: "login-2"
                        }
                    ],
                }
            }
        )
    })

    it('should return postsbyId after dislikes', async () => {
        // create dislike/like for post from both users
        await request(app).put(`/posts/${postId1}/like-status`).set('Authorization', `Bearer ${accessToken1}`).send(dislike)
        await request(app).put(`/posts/${postId1}/like-status`).set('Authorization', `Bearer ${accessToken2}`).send(like)

        const PostByIdForFirstUser = await request(app).get(`/posts/${postId1}`).set('Authorization', `Bearer ${accessToken1}`)
        expect(PostByIdForFirstUser.body).toStrictEqual(
            {
                id: expect.any(String),
                title: expect.any(String),
                shortDescription: expect.any(String),
                content: expect.any(String),
                blogId: expect.any(String),
                blogName: expect.any(String),
                createdAt: expect.any(String),
                extendedLikesInfo: {
                    likesCount: 3,
                    dislikesCount: 1,
                    myStatus: "Dislike",
                    newestLikes: [
                        {
                            addedAt: expect.any(String),
                            userId: expect.any(String),
                            login: "login-4"
                        },
                        {
                            addedAt: expect.any(String),
                            userId: expect.any(String),
                            login: "login-3"
                        },
                        {
                            addedAt: expect.any(String),
                            userId: expect.any(String),
                            login: "login-2"
                        }
                    ],
                }
            }
        )

        const PostByIdForSecondUser = await request(app).get(`/posts/${postId1}`).set('Authorization', `Bearer ${accessToken2}`)
        expect(PostByIdForSecondUser.body).toStrictEqual(
            {
                id: expect.any(String),
                title: expect.any(String),
                shortDescription: expect.any(String),
                content: expect.any(String),
                blogId: expect.any(String),
                blogName: expect.any(String),
                createdAt: expect.any(String),
                extendedLikesInfo: {
                    likesCount: 3,
                    dislikesCount: 1,
                    myStatus: "Like",
                    newestLikes: [
                        {
                            addedAt: expect.any(String),
                            userId: expect.any(String),
                            login: "login-4"
                        },
                        {
                            addedAt: expect.any(String),
                            userId: expect.any(String),
                            login: "login-3"
                        },
                        {
                            addedAt: expect.any(String),
                            userId: expect.any(String),
                            login: "login-2"
                        }
                    ],
                }
            }
        )
    })

    it('should return all posts after cancel likes', async () => {
        // create dislike for post and comment from first user
        await request(app).put(`/posts/${postId1}/like-status`).set('Authorization', `Bearer ${accessToken1}`).send(none)
        await request(app).put(`/posts/${postId1}/like-status`).set('Authorization', `Bearer ${accessToken2}`).send(none)

        const PostByIdForFirstUser = await request(app).get(`/posts`).set('Authorization', `Bearer ${accessToken1}`)
        expect(PostByIdForFirstUser.body).toStrictEqual({
            pagesCount: 1,
            page: 1,
            pageSize: 10,
            totalCount: 2,
            items: [
                {
                    id: expect.any(String),
                    title: expect.any(String),
                    shortDescription: expect.any(String),
                    content: expect.any(String),
                    blogId: expect.any(String),
                    blogName: expect.any(String),
                    createdAt: expect.any(String),
                    extendedLikesInfo: {
                        likesCount: 0,
                        dislikesCount: 0,
                        myStatus: "None",
                        newestLikes: [],
                    }
                },
                {
                    id: expect.any(String),
                    title: expect.any(String),
                    shortDescription: expect.any(String),
                    content: expect.any(String),
                    blogId: expect.any(String),
                    blogName: expect.any(String),
                    createdAt: expect.any(String),
                    extendedLikesInfo: {
                        likesCount: 2,
                        dislikesCount: 0,
                        myStatus: "None",
                        newestLikes: [
                            {
                                addedAt: expect.any(String),
                                userId: expect.any(String),
                                login: "login-4"
                            },
                            {
                                addedAt: expect.any(String),
                                userId: expect.any(String),
                                login: "login-3"
                            },
                        ],
                    }
                },
            ]
        })

        const PostByIdForSecondUser = await request(app).get(`/posts`).set('Authorization', `Bearer ${accessToken2}`)
        expect(PostByIdForSecondUser.body).toStrictEqual({
            pagesCount: 1,
            page: 1,
            pageSize: 10,
            totalCount: 2,
            items: [
                {
                    id: expect.any(String),
                    title: expect.any(String),
                    shortDescription: expect.any(String),
                    content: expect.any(String),
                    blogId: expect.any(String),
                    blogName: expect.any(String),
                    createdAt: expect.any(String),
                    extendedLikesInfo: {
                        likesCount: 0,
                        dislikesCount: 0,
                        myStatus: "None",
                        newestLikes: [],
                    }
                },
                {
                    id: expect.any(String),
                    title: expect.any(String),
                    shortDescription: expect.any(String),
                    content: expect.any(String),
                    blogId: expect.any(String),
                    blogName: expect.any(String),
                    createdAt: expect.any(String),
                    extendedLikesInfo: {
                        likesCount: 2,
                        dislikesCount: 0,
                        myStatus: "None",
                        newestLikes: [
                            {
                                addedAt: expect.any(String),
                                userId: expect.any(String),
                                login: "login-4"
                            },
                            {
                                addedAt: expect.any(String),
                                userId: expect.any(String),
                                login: "login-3"
                            },
                        ],
                    }
                },
            ]
        })
    })

    it('should return all posts', async () => {
        const PostsForFirstUser = await request(app).get(`/posts`).set('Authorization', `Bearer ${accessToken1}`)
        expect(PostsForFirstUser.body).toStrictEqual({
            pagesCount: 1,
            page: 1,
            pageSize: 10,
            totalCount: 2,
            items: [
                {
                    id: expect.any(String),
                    title: expect.any(String),
                    shortDescription: expect.any(String),
                    content: expect.any(String),
                    blogId: expect.any(String),
                    blogName: expect.any(String),
                    createdAt: expect.any(String),
                    extendedLikesInfo: {
                        likesCount: 0,
                        dislikesCount: 0,
                        myStatus: "None",
                        newestLikes: [],
                    }
                },
                {
                    id: expect.any(String),
                    title: expect.any(String),
                    shortDescription: expect.any(String),
                    content: expect.any(String),
                    blogId: expect.any(String),
                    blogName: expect.any(String),
                    createdAt: expect.any(String),
                    extendedLikesInfo: {
                        likesCount: 2,
                        dislikesCount: 0,
                        myStatus: "None",
                        newestLikes: [
                            {
                                addedAt: expect.any(String),
                                userId: expect.any(String),
                                login: "login-4"
                            },
                            {
                                addedAt: expect.any(String),
                                userId: expect.any(String),
                                login: "login-3"
                            },
                        ],
                    }
                },
            ]
        })

        const PostsForSecondUser = await request(app).get(`/posts`).set('Authorization', `Bearer ${accessToken2}`)
        expect(PostsForSecondUser.body).toStrictEqual({
            pagesCount: 1,
            page: 1,
            pageSize: 10,
            totalCount: 2,
            items: [
                {
                    id: expect.any(String),
                    title: expect.any(String),
                    shortDescription: expect.any(String),
                    content: expect.any(String),
                    blogId: expect.any(String),
                    blogName: expect.any(String),
                    createdAt: expect.any(String),
                    extendedLikesInfo: {
                        likesCount: 0,
                        dislikesCount: 0,
                        myStatus: "None",
                        newestLikes: [],
                    }
                },
                {
                    id: expect.any(String),
                    title: expect.any(String),
                    shortDescription: expect.any(String),
                    content: expect.any(String),
                    blogId: expect.any(String),
                    blogName: expect.any(String),
                    createdAt: expect.any(String),
                    extendedLikesInfo: {
                        likesCount: 2,
                        dislikesCount: 0,
                        myStatus: "None",
                        newestLikes: [
                            {
                                addedAt: expect.any(String),
                                userId: expect.any(String),
                                login: "login-4"
                            },
                            {
                                addedAt: expect.any(String),
                                userId: expect.any(String),
                                login: "login-3"
                            },
                        ],
                    }
                },
            ]
        })
    })

    // check some other standart validation
    it('should return 404 for creating like by incorrect post', async () => {
        await request(app).put(`/posts/${incorrectPostId}/like-status`).set('Authorization', `Bearer ${accessToken1}`).send(like).expect(404)
    })

    it('should return 400 for creating like by incorrect input-data', async () => {
        await request(app).put(`/posts/${incorrectPostId}/like-status`).set('Authorization', `Bearer ${accessToken1}`).send().expect(400)
    })

    it('should return 401 for creating like without auth', async () => {
        await request(app).put(`/posts/${incorrectPostId}/like-status`).send(like).expect(401)
    })

})*/