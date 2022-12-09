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
    let correctInputModelAuth = {
        loginOrEmail: 'nickarbuzov@yandex.by',
        password: "password-1",
    }
    let correctInputModelAuth2 = {
        loginOrEmail: 'login-2',
        password: "password-2",
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
    let cookie1 = ''
    let cookie2 = ''

    it('should delete all data', async () => {
        await request(app).delete('/testing/all-data').expect(204)
    })

    it('should seed start data', async () => {
        // create two registration
        await request(app).post('/auth/registration').send(inputModelUser1)
        await request(app).post('/auth/registration').send(inputModelUser2)

        // create two login and get some access-tokens and cookies
        const auth1 = await request(app).post('/auth/login').send(correctInputModelAuth)
        accessToken1 = auth1.body.accessToken
        cookie1 = auth1.header['set-cookie']
        const auth2 = await request(app).post('/auth/login').send(correctInputModelAuth2)
        accessToken2 = auth2.body.accessToken
        cookie2 = auth2.header['set-cookie']

        // create one blog
        const blog = await request(app).post('/blogs').set('Authorization', 'Basic YWRtaW46cXdlcnR5').send(inputModelBlog1)
        blogId = blog.body.id

        // create two posts for this blog and get postId's
        const post1 = await request(app).post(`/blogs/${blogId}/posts`).set('Authorization', 'Basic YWRtaW46cXdlcnR5').send(inputModelPost1)
        postId1 = post1.body.id
        const post2 = await request(app).post(`/blogs/${blogId}/posts`).set('Authorization', 'Basic YWRtaW46cXdlcnR5').send(inputModelPost2)
        postId2 = post2.body.id

        // create two comments for one of the post and get commentId's
        const comment1 = await request(app).post(`/posts/${postId1}/comments`).set('Authorization', `Bearer ${accessToken1}`).send(inputModelComment1)
        commentId1 = comment1.body.id
        const comment2 = await request(app).post(`/posts/${postId1}/comments`).set('Authorization', `Bearer ${accessToken2}`).send(inputModelComment2)
        commentId2 = comment2.body.id
    })

    it('should return one comment after likes from first-user for both users', async () => {
        // create like for post and comment from first user
        await request(app).put(`/posts/${postId1}/like-status`).set('Authorization', `Bearer ${accessToken1}`).send(like)
        await request(app).put(`/comments/${commentId1}/like-status`).set('Authorization', `Bearer ${accessToken1}`).send(like)

        const commentForFirstUser = await request(app).get(`/comments/${commentId1}`).set('Authorization', `Bearer ${accessToken1}`)
        expect(commentForFirstUser.body).toStrictEqual({
            id: expect.any(String),
            content: expect.any(String),
            userId: expect.any(String),
            userLogin: expect.any(String),
            createdAt: expect.any(String),
            likesInfo: {
                likesCount: 1,
                dislikesCount: 0,
                myStatus: "Like",
            }
        })
        const commentForSecondUser = await request(app).get(`/comments/${commentId1}`).set('Authorization', `Bearer ${accessToken2}`)
        expect(commentForSecondUser.body).toStrictEqual({
            id: expect.any(String),
            content: expect.any(String),
            userId: expect.any(String),
            userLogin: expect.any(String),
            createdAt: expect.any(String),
            likesInfo: {
                likesCount: 1,
                dislikesCount: 0,
                myStatus: "None",
            }
        })

    })

    it('should return one comment after dislikes-likes from first-user for both users', async () => {
        // create dislike after like for post and comment from first user
        await request(app).put(`/posts/${postId1}/like-status`).set('Authorization', `Bearer ${accessToken1}`).send(dislike)
        await request(app).put(`/comments/${commentId1}/like-status`).set('Authorization', `Bearer ${accessToken1}`).send(dislike)

        const commentForFirstUser = await request(app).get(`/comments/${commentId1}`).set('Authorization', `Bearer ${accessToken1}`)
        expect(commentForFirstUser.body).toStrictEqual({
            id: expect.any(String),
            content: expect.any(String),
            userId: expect.any(String),
            userLogin: expect.any(String),
            createdAt: expect.any(String),
            likesInfo: {
                likesCount: 0,
                dislikesCount: 1,
                myStatus: "Dislike",
            }
        })
        const commentForSecondUser = await request(app).get(`/comments/${commentId1}`).set('Authorization', `Bearer ${accessToken2}`)
        expect(commentForSecondUser.body).toStrictEqual({
            id: expect.any(String),
            content: expect.any(String),
            userId: expect.any(String),
            userLogin: expect.any(String),
            createdAt: expect.any(String),
            likesInfo: {
                likesCount: 0,
                dislikesCount: 1,
                myStatus: "None",
            }
        })
    })

    it('should return one comment after dislikes from first-user for both users', async () => {
        // create dislike for post and comment from first user
        await request(app).put(`/posts/${postId1}/like-status`).set('Authorization', `Bearer ${accessToken1}`).send(dislike)
        await request(app).put(`/comments/${commentId1}/like-status`).set('Authorization', `Bearer ${accessToken1}`).send(dislike)

        const commentForFirstUser = await request(app).get(`/comments/${commentId1}`).set('Authorization', `Bearer ${accessToken1}`)
        expect(commentForFirstUser.body).toStrictEqual({
            id: expect.any(String),
            content: expect.any(String),
            userId: expect.any(String),
            userLogin: expect.any(String),
            createdAt: expect.any(String),
            likesInfo: {
                likesCount: 0,
                dislikesCount: 1,
                myStatus: "Dislike",
            }
          })
        const commentForSecondUser = await request(app).get(`/comments/${commentId1}`).set('Authorization', `Bearer ${accessToken2}`)
        expect(commentForSecondUser.body).toStrictEqual({
            id: expect.any(String),
            content: expect.any(String),
            userId: expect.any(String),
            userLogin: expect.any(String),
            createdAt: expect.any(String),
            likesInfo: {
                likesCount: 0,
                dislikesCount: 1,
                myStatus: "None",
            }
          })
    })

    it('should return posts with comments for both users', async () => {
        const commentsByPostForFirstUser = await request(app).get(`/posts/${postId1}/comments`).set('Authorization', `Bearer ${accessToken1}`)
        expect(commentsByPostForFirstUser.body).toStrictEqual({
            pagesCount: 1,
            page: 1,
            pageSize: 10,
            totalCount: 2,
            items: [
                {id: expect.any(String),
                    content: expect.any(String),
                    userId: expect.any(String),
                    userLogin: expect.any(String),
                    createdAt: expect.any(String),
                    likesInfo: {
                        likesCount: 0,
                        dislikesCount: 0,
                        myStatus: "None",
                    }
                },
                {id: expect.any(String),
                    content: expect.any(String),
                    userId: expect.any(String),
                    userLogin: expect.any(String),
                    createdAt: expect.any(String),
                    likesInfo: {
                        likesCount: 0,
                        dislikesCount: 1,
                        myStatus: "Dislike",
                    }
                },
            ]
        })

        const commentsByPostForSecondUser = await request(app).get(`/posts/${postId1}/comments`).set('Authorization', `Bearer ${accessToken2}`)
        expect(commentsByPostForSecondUser.body).toStrictEqual({
            pagesCount: 1,
            page: 1,
            pageSize: 10,
            totalCount: 2,
            items: [
                {id: expect.any(String),
                    content: expect.any(String),
                    userId: expect.any(String),
                    userLogin: expect.any(String),
                    createdAt: expect.any(String),
                    likesInfo: {
                        likesCount: 0,
                        dislikesCount: 0,
                        myStatus: "None",
                    }
                },
                {id: expect.any(String),
                    content: expect.any(String),
                    userId: expect.any(String),
                    userLogin: expect.any(String),
                    createdAt: expect.any(String),
                    likesInfo: {
                        likesCount: 0,
                        dislikesCount: 1,
                        myStatus: "None",
                    }
                },
            ]
        })
    })

    // check some other standart validation
    it('should return 404 for creating like by incorrect comment', async () => {
        await request(app).put(`/comments/${incorrectCommentId}/like-status`).set('Authorization', `Bearer ${accessToken1}`).send(like).expect(404)
    })

    it('should return 400 for creating like by incorrect input-data', async () => {
        await request(app).put(`/comments/${incorrectCommentId}/like-status`).set('Authorization', `Bearer ${accessToken1}`).send().expect(400)
    })

    it('should return 401 for creating like without auth', async () => {
        await request(app).put(`/comments/${incorrectCommentId}/like-status`).send(like).expect(401)
    })

})*/