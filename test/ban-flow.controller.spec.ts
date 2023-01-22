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

  describe('ban-flow-controller', () => {
    it('should delete all data', async () => {
      await request(server).delete('/testing/all-data').expect(204)
    })

    it('should seed start data', async () => {
        // create two users and get userId
        const user = await request(server).post('/sa/users').set('Authorization', 'Basic YWRtaW46cXdlcnR5').send(constants.createUser1)
        constants.variables.setUserId(user.body.id)
        const user2 = await request(server).post('/sa/users').set('Authorization', 'Basic YWRtaW46cXdlcnR5').send(constants.createUser2)
        constants.variables.setUserId2(user2.body.id)

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

    it('should check blogs by public-api with ban and unban', async () => {
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

    it('should check 200 or 404 if request post by id in public-api with ban and unban blog', async () => {
      await request(server).get(`/posts/${constants.variables.postId}`).expect(200)
      await request(server).put(`/sa/blogs/${constants.variables.blogId}/ban`)
        .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
        .send({isBanned: true}).expect(204)
      await request(server).get(`/posts/${constants.variables.postId}`).expect(404)
      await request(server).put(`/sa/blogs/${constants.variables.blogId}/ban`)
        .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
        .send({isBanned: false}).expect(204)
      await request(server).get(`/posts/${constants.variables.postId}`).expect(200)
    })

    it('should check list of users banned for blog', async () => {
      let bannedlist = await request(server)
        .get(`/blogger/users/blog/${constants.variables.blogId}`)
        .set('Authorization', `Bearer ${constants.variables.accessToken}`)
      expect(bannedlist.body).toStrictEqual({
        pagesCount: 0,
        page: 1,
        pageSize: 10,
        totalCount: 0,
        items: []
      })

      await request(server)
        .put(`/blogger/users/${constants.variables.userId2}/ban`)
        .set('Authorization', `Bearer ${constants.variables.accessToken}`)
        .send({isBanned: true, banReason: "stringstringstringst", blogId: constants.variables.blogId})
        .expect(204)
      bannedlist = await request(server)
        .get(`/blogger/users/blog/${constants.variables.blogId}`)
        .set('Authorization', `Bearer ${constants.variables.accessToken}`)
      expect(bannedlist.body.items.length).toBe(1)

      await request(server)
        .put(`/blogger/users/${constants.variables.userId2}/ban`)
        .set('Authorization', `Bearer ${constants.variables.accessToken}`)
        .send({isBanned: false, banReason: "stringstringstringst", blogId: constants.variables.blogId})
        .expect(204)
      bannedlist = await request(server)
        .get(`/blogger/users/blog/${constants.variables.blogId}`)
        .set('Authorization', `Bearer ${constants.variables.accessToken}`)
      expect(bannedlist.body.items.length).toBe(0)
    })

    it('should check 404 or 403 if ban or unban directed to not exists user or foreign blog', async () => {
      await request(server)
        .put(`/blogger/users/${constants.variables.incorrectAnyUUID}/ban`)
        .set('Authorization', `Bearer ${constants.variables.accessToken}`)
        .send({isBanned: true, banReason: "stringstringstringst", blogId: constants.variables.blogId})
        .expect(404)

      await request(server)
        .put(`/blogger/users/${constants.variables.userId2}/ban`)
        .set('Authorization', `Bearer ${constants.variables.accessToken}`)
        .send({isBanned: true, banReason: "stringstringstringst", blogId: constants.variables.incorrectAnyUUID})
        .expect(404)
    })

    it('should return 404 if blog for display banned users not found', async () => {
      await request(server)
        .get(`/blogger/users/blog/${constants.variables.incorrectAnyUUID}`)
        .set('Authorization', `Bearer ${constants.variables.accessToken}`)
        .send({isBanned: true, banReason: "stringstringstringst", blogId: constants.variables.blogId})
        .expect(404)
    })

    it('should realize specific case with request comments by blogger', async () => {
      const comment3 = await request(server).post(`/posts/${constants.variables.postId}/comments`)
        .set('Authorization', `Bearer ${constants.variables.accessToken}`)
        .send(constants.createComment).expect(201)
      constants.variables.setCommentId3(comment3.body.id)

      const comments = await request(server).get(`/blogger/blogs/comments`)
        .set('Authorization', `Bearer ${constants.variables.accessToken}`)
      expect(comments.body.items[0]).toStrictEqual({
            id: expect.any(String),
            content: expect.any(String),
            createdAt: expect.any(String),
            commentatorInfo: {
              userId: expect.any(String),
              userLogin: expect.any(String),
            },
            likesInfo: {
              likesCount: 0, 
              dislikesCount: 0,
              myStatus: expect.any(String),
            },
            postInfo: {
              blogId: expect.any(String),
              blogName: expect.any(String),
              title: expect.any(String),
              id: expect.any(String),
            }
          })
    })

  });
});
