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

  describe('comment-controller', () => {
    it('should delete all data', async () => {
      await request(server).delete('/testing/all-data').expect(204)
    })

    it('should create seed-data - blog, post, two users, get two accessTokens', async () => {
      const user = await request(server).post('/sa/users')
        .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
        .send(constants.createUser1)

      await request(server).post('/sa/users')
        .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
        .send(constants.createUser2)
      constants.variables.setUserId(user.body.id)

      const login = await request(server).post('/auth/login')
        .send(constants.correctLoginUser)
      const login2 = await request(server).post('/auth/login')
        .send(constants.correctLoginUser2)

      constants.variables.setAccessToken(login.body.accessToken)
      constants.variables.setAccessToken2(login2.body.accessToken)

      const blog = await request(server).post('/blogger/blogs')
        .set('Authorization', `Bearer ${constants.variables.accessToken}`)
        .send(constants.createBlog1);
      constants.variables.setBlogId(blog.body.id)

      const post = await request(server).post(`/blogger/blogs/${constants.variables.blogId}/posts`)
        .set('Authorization', `Bearer ${constants.variables.accessToken}`)
        .send(constants.createPost1)
      constants.variables.setPostId(post.body.id)

    })

    it('should create comment with valid user-accessToken', async () => {
      const comment = await request(server).post(`/posts/${constants.variables.postId}/comments`)
        .set('Authorization', `Bearer ${constants.variables.accessToken}`)
        .send(constants.createComment)

      expect(comment.body).toStrictEqual({
        content: constants.createComment.content, 
        createdAt: expect.any(String), 
        id: expect.any(String), 
        userId: constants.variables.userId,
        userLogin: constants.variables.userId,
        likesInfo: {
          dislikesCount: 0, 
          likesCount: 0, 
          myStatus: "None"
        }
      })

      constants.variables.setCommentId(comment.body.id)
    })

    it('should return comment from user, return 404 after ban user, and return 200 after unban user', async () => {
      await request(server).get(`/comments/${constants.variables.commentId}`)
        .set('Authorization', `Bearer ${constants.variables.accessToken}`)
        .send(constants.createComment)
        .expect(200)

      await request(server).put(`/sa/users/${constants.variables.userId}/ban`)
        .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
        .send(constants.ban)
      
      await request(server).get(`/comments/${constants.variables.commentId}`)
        .set('Authorization', `Bearer ${constants.variables.accessToken}`)
        .send(constants.createComment)
        .expect(404)

      await request(server).put(`/sa/users/${constants.variables.userId}/ban`)
        .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
        .send(constants.unban)

      await request(server).get(`/comments/${constants.variables.commentId}`)
        .set('Authorization', `Bearer ${constants.variables.accessToken}`)
        .send(constants.createComment)
        .expect(200)
    })

    it('should return 404 if try create comment for incorrect postId', async () => {
      await request(server).post(`/posts/${constants.variables.incorrectAnyEntityId}/comments`)
        .set('Authorization', `Bearer ${constants.variables.accessToken}`)
        .send(constants.createComment)
        .expect(404)
    })

    it('should return 401 if try create comment without correct accessToken', async () => {
      await request(server).post(`/posts/${constants.variables.postId}/comments`)
        .set('Authorization', `Bearer ${constants.variables.incorrectToken}`)
        .send(constants.createComment)
        .expect(401)
    })

    it('should update comment with valid user-accessToken', async () => {
      await request(server).put(`/comments/${constants.variables.commentId}`)
        .set('Authorization', `Bearer ${constants.variables.accessToken}`)
        .send(constants.updateComment)
        .expect(204)

      const comment = await request(server).get(`/comments/${constants.variables.commentId}`)
      expect(comment.body.content).toBe(constants.updateComment.content)
    })

    it('should return 401 if try update comment without correct accessToken', async () => {
      await request(server).put(`/comments/${constants.variables.commentId}`)
        .set('Authorization', `Bearer ${constants.variables.incorrectToken}`)
        .send(constants.createComment)
        .expect(401)
    })

    it('should return 403 if try update foreign-comment', async () => {
      await request(server).put(`/comments/${constants.variables.commentId}`)
        .set('Authorization', `Bearer ${constants.variables.accessToken2}`)
        .send(constants.createComment)
        .expect(403)
    })

    it('should return 401 if try delete comment without correct accessToken', async () => {
      await request(server).delete(`/comments/${constants.variables.commentId}`)
        .set('Authorization', `Bearer ${constants.variables.incorrectToken}`)
        .send(constants.createComment)
        .expect(401)
    })

    it('should return 403 if try delete foreign-comment', async () => {
      await request(server).delete(`/comments/${constants.variables.commentId}`)
        .set('Authorization', `Bearer ${constants.variables.accessToken2}`)
        .send(constants.createComment)
        .expect(403)
    })

    it('should delete comment with valid user-accessToken', async () => {
      await request(server).delete(`/comments/${constants.variables.commentId}`)
        .set('Authorization', `Bearer ${constants.variables.accessToken}`)
        .send(constants.createComment)
        .expect(204)
    })

    it('should return 404 if comment to delete not found', async () => {
      await request(server).delete(`/comments/${constants.variables.commentId}`)
        .set('Authorization', `Bearer ${constants.variables.accessToken}`)
        .send(constants.createComment)
        .expect(404)
    })

  });
});
