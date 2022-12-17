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
        // create two blog
        const blog = await request(server).post('/blogger/blogs')
            .set('Authorization', `Bearer ${constants.variables.accessToken}`)
            .send(constants.createBlog1)
        constants.variables.setBlogId(blog.body.id)
        await request(server).post('/blogger/blogs')
            .set('Authorization', `Bearer ${constants.variables.accessToken}`)
            .send(constants.createBlog1)
       
        // create two posts for first blog and get postId's
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

    it('should return blogs by sa with ban and unban', async () => {
      let blogs = await request(server).get('/sa/blogs').set('Authorization', 'Basic YWRtaW46cXdlcnR5')
      expect(blogs.body.items.length).toBe(2)
      await request(server).put(`/sa/blogs/${constants.variables.blogId}/ban`)
        .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
        .send({isBanned: true}).expect(204)
      blogs = await request(server).get('/sa/blogs').set('Authorization', 'Basic YWRtaW46cXdlcnR5')
      expect(blogs.body.items[1].banInfo.isBanned).toBeTruthy()
      await request(server).put(`/sa/blogs/${constants.variables.blogId}/ban`)
        .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
        .send({isBanned: false}).expect(204)
      blogs = await request(server).get('/sa/blogs').set('Authorization', 'Basic YWRtaW46cXdlcnR5')
      expect(blogs.body.items[1].banInfo.isBanned).toBeFalsy()
    })

    it('should return blogs by public-api with ban and unban', async () => {
      let blogs = await request(server).get('/blogs')
      expect(blogs.body.items.length).toBe(2)
      await request(server).put(`/sa/blogs/${constants.variables.blogId}/ban`)
        .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
        .send({isBanned: true}).expect(204)
      blogs = await request(server).get('/blogs')
      expect(blogs.body.items.length).toBe(1)
      await request(server).put(`/sa/blogs/${constants.variables.blogId}/ban`)
        .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
        .send({isBanned: false}).expect(204)
      blogs = await request(server).get('/blogs')
      expect(blogs.body.items.length).toBe(2)
    })

  });
});