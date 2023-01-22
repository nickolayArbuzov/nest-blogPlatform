import { BadRequestException, INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { useContainer } from 'class-validator';
import * as request from 'supertest';
import { HttpExceptionFilter } from '../src/helpers/filters/http-exeption.filter';
import { AppModule } from '../src/app.module'
import * as constants from './constants';

jest.setTimeout(60000)
describe('AppController', () => {
  let app: INestApplication
  let server: any
  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    useContainer(app.select(AppModule), { fallbackOnErrors: true });
    app.useGlobalPipes(new ValidationPipe({
    stopAtFirstError: true,
    transform: true,
    exceptionFactory: (errors) => {
      const customErrors = [];
      errors.forEach(e => {
        const keys = Object.keys(e.constraints)
        keys.forEach(k => {
          customErrors.push({
            message: e.constraints[k],
            field: e.property,
          })
        })
      })
      throw new BadRequestException(customErrors)
    }
  }))
  app.useGlobalFilters(new HttpExceptionFilter())
    await app.init()
    server = app.getHttpServer()
  });

  afterAll(async () => {
    app.close()
  })

  describe('post-like-controller', () => {
    it('should delete all data', async () => {
      await request(server).delete('/testing/all-data').expect(204)
    })

    it('should seed start data', async () => {
        // create two registration
        await request(server).post('/auth/registration').send(constants.createUser1)
        await request(server).post('/auth/registration').send(constants.createUser2)
        await request(server).post('/auth/registration').send(constants.createUser3)
        await request(server).post('/auth/registration').send(constants.createUser4)

        // create two login and get some access-tokens and cookies
        const auth1 = await request(server).post('/auth/login').send(constants.correctLoginUser)
        constants.variables.setAccessToken(auth1.body.accessToken)
        constants.variables.setCookie(auth1.header['set-cookie'])
        const auth2 = await request(server).post('/auth/login').send(constants.correctLoginUser2)
        constants.variables.setAccessToken2(auth2.body.accessToken)
        constants.variables.setCookie2(auth2.header['set-cookie'])
        const auth3 = await request(server).post('/auth/login').send(constants.correctLoginUser3)
        constants.variables.setAccessToken3(auth3.body.accessToken)
        const auth4 = await request(server).post('/auth/login').send(constants.correctLoginUser4)
        constants.variables.setAccessToken4(auth4.body.accessToken)

        // create one blog
        const blog = await request(server).post('/blogger/blogs').set('Authorization', `Bearer ${constants.variables.accessToken}`).send(constants.createBlog1)
        constants.variables.setBlogId(blog.body.id)

        // create two posts for this blog and get postId's
        const post1 = await request(server).post(`/blogger/blogs/${constants.variables.blogId}/posts`).set('Authorization', `Bearer ${constants.variables.accessToken}`).send(constants.createPost1)
        constants.variables.setPostId(post1.body.id)
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
        const post2 = await request(server).post(`/blogger/blogs/${constants.variables.blogId}/posts`).set('Authorization', `Bearer ${constants.variables.accessToken}`).send(constants.createPost2)
        constants.variables.setPostId2(post2.body.id)
        // create two comments for one of the post and get commentId's
        const comment1 = await request(server).post(`/posts/${constants.variables.postId}/comments`).set('Authorization', `Bearer ${constants.variables.accessToken}`).send(constants.createComment)
        constants.variables.setCommentId(comment1.body.id)
        const comment2 = await request(server).post(`/posts/${constants.variables.postId}/comments`).set('Authorization', `Bearer ${constants.variables.accessToken2}`).send(constants.createComment)
        constants.variables.setCommentId2(comment2.body.id)
    })

    it('should return postsbyId after likes', async () => {
        // create like/dislike for post from both users
        await request(server).put(`/posts/${constants.variables.postId}/like-status`).set('Authorization', `Bearer ${constants.variables.accessToken}`).send(constants.like)
        await request(server).put(`/posts/${constants.variables.postId}/like-status`).set('Authorization', `Bearer ${constants.variables.accessToken2}`).send(constants.like)
        await request(server).put(`/posts/${constants.variables.postId}/like-status`).set('Authorization', `Bearer ${constants.variables.accessToken3}`).send(constants.like)
        await request(server).put(`/posts/${constants.variables.postId}/like-status`).set('Authorization', `Bearer ${constants.variables.accessToken4}`).send(constants.like)

        const PostByIdForFirstUser = await request(server).get(`/posts/${constants.variables.postId}`).set('Authorization', `Bearer ${constants.variables.accessToken}`)
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
                            login: 'login-4',
                        },
                        {
                            addedAt: expect.any(String),
                            userId: expect.any(String),
                            login: 'login-3',
                        },
                        {
                            addedAt: expect.any(String),
                            userId: expect.any(String),
                            login: 'login-2',
                        }
                    ],
                }
            },
        )

        const PostByIdForSecondUser = await request(server).get(`/posts/${constants.variables.postId}`).set('Authorization', `Bearer ${constants.variables.accessToken2}`)
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
                            login: 'login-4',
                        },
                        {
                            addedAt: expect.any(String),
                            userId: expect.any(String),
                            login: 'login-3',
                        },
                        {
                            addedAt: expect.any(String),
                            userId: expect.any(String),
                            login: 'login-2',
                        }
                    ],
                }
            }
        )
    })

    it('should return posts by blogId', async () => {
        const posts = await request(server).get(`/blogs/${constants.variables.blogId}/posts`).set('Authorization', `Bearer ${constants.variables.accessToken}`)
        expect(posts.body).toStrictEqual({
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
                        likesCount: 4,
                        dislikesCount: 0,
                        myStatus: "Like",
                        newestLikes: [
                            {
                                addedAt: expect.any(String),
                                userId: expect.any(String),
                                login: 'login-4',
                            },
                            {
                                addedAt: expect.any(String),
                                userId: expect.any(String),
                                login: 'login-3',
                            },
                            {
                                addedAt: expect.any(String),
                                userId: expect.any(String),
                                login: 'login-2',
                            },
                        ],
                    }
                },
            ]
        })
    })
    it('should return postsbyId after dislikes', async () => {
        // create dislike/like for post from both users
        await request(server).put(`/posts/${constants.variables.postId}/like-status`).set('Authorization', `Bearer ${constants.variables.accessToken}`).send(constants.dislike)
        await request(server).put(`/posts/${constants.variables.postId}/like-status`).set('Authorization', `Bearer ${constants.variables.accessToken2}`).send(constants.like)

        const PostByIdForFirstUser = await request(server).get(`/posts/${constants.variables.postId}`).set('Authorization', `Bearer ${constants.variables.accessToken}`)
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
                            login: 'login-4',
                        },
                        {
                            addedAt: expect.any(String),
                            userId: expect.any(String),
                            login: 'login-3',
                        },
                        {
                            addedAt: expect.any(String),
                            userId: expect.any(String),
                            login: 'login-2',
                        }
                    ],
                }
            }
        )

        const PostByIdForSecondUser = await request(server).get(`/posts/${constants.variables.postId}`).set('Authorization', `Bearer ${constants.variables.accessToken2}`)
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
                            login: 'login-4',
                        },
                        {
                            addedAt: expect.any(String),
                            userId: expect.any(String),
                            login: 'login-3',
                        },
                        {
                            addedAt: expect.any(String),
                            userId: expect.any(String),
                            login: 'login-2',
                        }
                    ],
                }
            }
        )
    })

    it('should return all posts after cancel likes', async () => {
        // create dislike for post and comment from first user
        await request(server).put(`/posts/${constants.variables.postId}/like-status`).set('Authorization', `Bearer ${constants.variables.accessToken}`).send(constants.none)
        await request(server).put(`/posts/${constants.variables.postId}/like-status`).set('Authorization', `Bearer ${constants.variables.accessToken2}`).send(constants.none)

        const PostByIdForFirstUser = await request(server).get(`/posts`).set('Authorization', `Bearer ${constants.variables.accessToken}`)
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
                                login: 'login-4',
                            },
                            {
                                addedAt: expect.any(String),
                                userId: expect.any(String),
                                login: 'login-3',
                            },
                        ],
                    }
                },
            ]
        })

        const PostByIdForSecondUser = await request(server).get(`/posts`).set('Authorization', `Bearer ${constants.variables.accessToken2}`)
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
                                login: 'login-4',
                            },
                            {
                                addedAt: expect.any(String),
                                userId: expect.any(String),
                                login: 'login-3',
                            },
                        ],
                    }
                },
            ]
        })
    })

    it('should return all posts', async () => {
        const PostsForFirstUser = await request(server).get(`/posts`).set('Authorization', `Bearer ${constants.variables.accessToken}`)
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
                                login: 'login-4',
                            },
                            {
                                addedAt: expect.any(String),
                                userId: expect.any(String),
                                login: 'login-3',
                            },
                        ],
                    }
                },
            ]
        })

        const PostsForSecondUser = await request(server).get(`/posts`).set('Authorization', `Bearer ${constants.variables.accessToken2}`)
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
                                login: 'login-4',
                            },
                            {
                                addedAt: expect.any(String),
                                userId: expect.any(String),
                                login: 'login-3',
                            },
                        ],
                    }
                },
            ]
        })
    })

    // check some other standart validation
    it('should return 404 for creating like by incorrect post', async () => {
        await request(server).put(`/posts/${constants.variables.incorrectAnyUUID}/like-status`).set('Authorization', `Bearer ${constants.variables.accessToken}`).send(constants.like).expect(404)
    })

    it('should return 400 for creating like by incorrect input-data', async () => {
        await request(server).put(`/posts/${constants.variables.incorrectAnyUUID}/like-status`).set('Authorization', `Bearer ${constants.variables.accessToken}`).send().expect(400)
    })

    it('should return 401 for creating like without auth', async () => {
        await request(server).put(`/posts/${constants.variables.incorrectAnyUUID}/like-status`).send(constants.like).expect(401)
    })

  })
});
