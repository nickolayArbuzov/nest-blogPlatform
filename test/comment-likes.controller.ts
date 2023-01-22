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

  describe('comment-like-controller', () => {
    it('should delete all data', async () => {
      await request(server).delete('/testing/all-data').expect(204)
      const user = await request(server).get('/sa/users').set('Authorization', 'Basic YWRtaW46cXdlcnR5')
    })

    it('should seed start data', async () => {
        // create two users and get userId
        const user = await request(server).post('/sa/users').set('Authorization', 'Basic YWRtaW46cXdlcnR5').send(constants.createUser1)
        constants.variables.setUserId(user.body.id)
        await request(server).post('/sa/users').set('Authorization', 'Basic YWRtaW46cXdlcnR5').send(constants.createUser2)

        // create two login and get some access-tokens and cookies
        const auth1 = await request(server).post('/auth/login').send(constants.correctLoginUser)
        constants.variables.setAccessToken(auth1.body.accessToken)
        constants.variables.setCookie(auth1.header['set-cookie'])
        const auth2 = await request(server).post('/auth/login').send(constants.correctLoginUser2)
        constants.variables.setAccessToken2(auth2.body.accessToken)
        constants.variables.setCookie2(auth2.header['set-cookie'])
        // create one blog
        const blog = await request(server).post('/blogger/blogs')
            .set('Authorization', `Bearer ${constants.variables.accessToken}`)
            .send(constants.createBlog1)
        constants.variables.setBlogId(blog.body.id)
       
        // create two posts for this blog and get postId's
        const post1 = await request(server).post(`/blogger/blogs/${constants.variables.blogId}/posts`)
            .set('Authorization', `Bearer ${constants.variables.accessToken}`)
            .send(constants.createPost1)
        constants.variables.setPostId(post1.body.id)

        const post2 = await request(server).post(`/blogger/blogs/${constants.variables.blogId}/posts`)
            .set('Authorization', `Bearer ${constants.variables.accessToken}`)
            .send(constants.createPost2)
        constants.variables.setPostId2(post2.body.id)

        // create two comments for one of the post and get commentId's
        const comment1 = await request(server).post(`/posts/${constants.variables.postId}/comments`)
            .set('Authorization', `Bearer ${constants.variables.accessToken}`)
            .send(constants.createComment)
        constants.variables.setCommentId(comment1.body.id)

        const comment2 = await request(server).post(`/posts/${constants.variables.postId}/comments`)
            .set('Authorization', `Bearer ${constants.variables.accessToken}`)
            .send(constants.createComment)
        constants.variables.setCommentId2(comment2.body.id)
    })

    it('should return one comment after likes from first-user for both users', async () => {
        // create like for post and comment from first user
        await request(server).put(`/posts/${constants.variables.postId}/like-status`).set('Authorization', `Bearer ${constants.variables.accessToken}`).send(constants.like)
        await request(server).put(`/comments/${constants.variables.commentId}/like-status`).set('Authorization', `Bearer ${constants.variables.accessToken}`).send(constants.like)
        const commentForFirstUser = await request(server).get(`/comments/${constants.variables.commentId}`).set('Authorization', `Bearer ${constants.variables.accessToken}`)
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
        const commentForSecondUser = await request(server).get(`/comments/${constants.variables.commentId}`).set('Authorization', `Bearer ${constants.variables.accessToken2}`)
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

    it('should return one comment after ban ad unban user - quantity of likes must be changed', async () => {
        // baned and unbaned user, and get changed quantity of likes
        await request(server).put(`/sa/users/${constants.variables.userId}/ban`)
            .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
            .send(constants.ban);

        await request(server).get(`/comments/${constants.variables.commentId}`)
            .set('Authorization', `Bearer ${constants.variables.accessToken}`).expect(404)

        await request(server).get(`/comments/${constants.variables.commentId}`)
            .set('Authorization', `Bearer ${constants.variables.accessToken2}`).expect(404)

        await request(server).put(`/sa/users/${constants.variables.userId}/ban`)
            .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
            .send(constants.unban);
        
        const commentForFirstUserAfterUnban = await request(server).get(`/comments/${constants.variables.commentId}`)
            .set('Authorization', `Bearer ${constants.variables.accessToken}`)
        expect(commentForFirstUserAfterUnban.body).toStrictEqual({
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

        const commentForSecondUserAfterUnban = await request(server).get(`/comments/${constants.variables.commentId}`)
            .set('Authorization', `Bearer ${constants.variables.accessToken2}`)
        expect(commentForSecondUserAfterUnban.body).toStrictEqual({
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
        await request(server).put(`/posts/${constants.variables.postId}/like-status`).set('Authorization', `Bearer ${constants.variables.accessToken}`).send(constants.dislike)
        await request(server).put(`/comments/${constants.variables.commentId}/like-status`).set('Authorization', `Bearer ${constants.variables.accessToken}`).send(constants.dislike)
        const commentForFirstUser = await request(server).get(`/comments/${constants.variables.commentId}`).set('Authorization', `Bearer ${constants.variables.accessToken}`)
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
        const commentForSecondUser = await request(server).get(`/comments/${constants.variables.commentId}`).set('Authorization', `Bearer ${constants.variables.accessToken2}`)
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
        await request(server).put(`/posts/${constants.variables.postId}/like-status`).set('Authorization', `Bearer ${constants.variables.accessToken}`).send(constants.dislike)
        await request(server).put(`/comments/${constants.variables.commentId}/like-status`).set('Authorization', `Bearer ${constants.variables.accessToken}`).send(constants.dislike)

        const commentForFirstUser = await request(server).get(`/comments/${constants.variables.commentId}`).set('Authorization', `Bearer ${constants.variables.accessToken}`)
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
        const commentForSecondUser = await request(server).get(`/comments/${constants.variables.commentId}`).set('Authorization', `Bearer ${constants.variables.accessToken2}`)
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
        const commentsByPostForFirstUser = await request(server).get(`/posts/${constants.variables.postId}/comments`).set('Authorization', `Bearer ${constants.variables.accessToken}`)
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

        const commentsByPostForSecondUser = await request(server).get(`/posts/${constants.variables.postId}/comments`).set('Authorization', `Bearer ${constants.variables.accessToken2}`)
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
    /*it('should return 404 for creating like by incorrect comment', async () => {
        await request(server).put(`/comments/${constants.variables.incorrectAnyUUID}/like-status`).set('Authorization', `Bearer ${constants.variables.accessToken}`).send(constants.like).expect(404)
    })

    it('should return 400 for creating like by incorrect input-data', async () => {
        await request(server).put(`/comments/${constants.variables.incorrectAnyUUID}/like-status`).set('Authorization', `Bearer ${constants.variables.accessToken}`).send().expect(400)
    })

    it('should return 401 for creating like without auth', async () => {
        await request(server).put(`/comments/${constants.variables.incorrectAnyUUID}/like-status`).send(constants.like).expect(401)
    })*/

  });
});
