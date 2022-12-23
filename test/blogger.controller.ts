import { BadRequestException, INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { useContainer } from 'class-validator';
import cookieParser = require('cookie-parser');
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
    app.use(cookieParser());
    app.useGlobalFilters(new HttpExceptionFilter())
    await app.init()
    server = app.getHttpServer()
  });

  afterAll(async () => {
    app.close()
  })

  describe('blogger-controller', () => {
    it('should delete all data', async () => {
      await request(server).delete('/testing/all-data').expect(204)
    })

    it('should seed data', async () => {
      // create two registration
      await request(server).post('/auth/registration').send(constants.createUser1)
      await request(server).post('/auth/registration').send(constants.createUser2)

      // create two login and get some access-tokens and cookies
      const auth1 = await request(server).post('/auth/login').send(constants.correctLoginUser)
      constants.variables.setAccessToken(auth1.body.accessToken)
      constants.variables.setCookie(auth1.header['set-cookie'])
      const auth2 = await request(server).post('/auth/login').send(constants.correctLoginUser2)
      constants.variables.setAccessToken2(auth2.body.accessToken)
      constants.variables.setCookie2(auth2.header['set-cookie'])
    })

    it('should create new blogs by two bloggers and get their id', async () => {
      const blog1 = await request(server).post('/blogger/blogs')
        .set('Authorization', `Bearer ${constants.variables.accessToken}`)
        .send(constants.createBlog1);

      constants.variables.setBlogId(blog1.body.id)

      expect(blog1.body).toStrictEqual({
        id: expect.any(String),
        name: constants.createBlog1.name,
        description: constants.createBlog1.description,
        websiteUrl: constants.createBlog1.websiteUrl,
        createdAt: expect.any(String),
      });

      expect(blog1.status).toBe(201)

      const blog2 = await request(server).post('/blogger/blogs')
        .set('Authorization', `Bearer ${constants.variables.accessToken2}`)
        .send(constants.createBlog2);

      constants.variables.setBlogId2(blog2.body.id)
    });

    it('should return blogs specified by users', async () => {
      const blogs1 = await request(server).get('/blogger/blogs')
        .set('Authorization', `Bearer ${constants.variables.accessToken}`)

      expect(blogs1.body).toStrictEqual({
        page: 1,
        pageSize: 10,
        pagesCount: 1,
        totalCount: 1,
        items: [
          {
            createdAt: expect.any(String),
            description: constants.createBlog1.description,
            id: expect.any(String),
            name: constants.createBlog1.name,
            websiteUrl: constants.createBlog1.websiteUrl,
          }
        ],
      });

      const blogs2 = await request(server).get('/blogger/blogs').set('Authorization', `Bearer ${constants.variables.accessToken2}`)
      expect(blogs2.body).toStrictEqual({
        page: 1,
        pageSize: 10,
        pagesCount: 1,
        totalCount: 1,
        items: [
          {
            createdAt: expect.any(String),
            description: constants.createBlog2.description,
            id: expect.any(String),
            name: constants.createBlog2.name,
            websiteUrl: constants.createBlog2.websiteUrl,
          }
        ],
      });
    });

    it('should create post for own blog', async () => {
      const post = await request(server).post(`/blogger/blogs/${constants.variables.blogId}/posts`)
        .set('Authorization', `Bearer ${constants.variables.accessToken}`)
        .send(constants.createPost1)
        .expect(201)

      constants.variables.setPostId(post.body.id)
    });

    it('should return blogs for admin', async () => {
      const blogs = await request(server).get(`/sa/blogs`)
        .set('Authorization', 'Basic YWRtaW46cXdlcnR5')

      expect(blogs.body.items[0]).toStrictEqual({
        banInfo: {
          banDate: null,
          isBanned: false,
        },
        blogOwnerInfo: {
          userId: expect.any(String),
          userLogin: expect.any(String),
        },
        createdAt: expect.any(String),
        description: expect.any(String),
        id: expect.any(String),
        name: expect.any(String),
        websiteUrl: expect.any(String),
      })
    });

    it('should return 403 if trying create post for foreign blog', async () => {
      await request(server).post(`/blogger/blogs/${constants.variables.blogId2}/posts`)
        .set('Authorization', `Bearer ${constants.variables.accessToken}`)
        .send(constants.createPost1)
        .expect(403)
    });

    it('should return 403 if trying update and delete post of foreign blog', async () => {
      await request(server).put(`/blogger/blogs/${constants.variables.blogId}/posts/${constants.variables.postId}`)
        .set('Authorization', `Bearer ${constants.variables.accessToken2}`)
        .send(constants.updatePost)
        .expect(403)

      await request(server).delete(`/blogger/blogs/${constants.variables.blogId}/posts/${constants.variables.postId}`)
        .set('Authorization', `Bearer ${constants.variables.accessToken2}`)
        .expect(403)
    });

    it('should return 404 if post of blog to delete or update is not exist', async () => {
      await request(server).put(`/blogger/blogs/${constants.variables.blogId}/posts/${constants.variables.incorrectAnyUUID}`)
        .set('Authorization', `Bearer ${constants.variables.accessToken}`)
        .send(constants.updatePost)
        .expect(404);

      await request(server).delete(`/blogger/blogs/${constants.variables.blogId}/posts/${constants.variables.incorrectAnyUUID}`)
        .set('Authorization', `Bearer ${constants.variables.accessToken}`)
        .expect(404);
    });

    it('should update and delete post of own blog', async () => {
      await request(server).put(`/blogger/blogs/${constants.variables.blogId}/posts/${constants.variables.postId}`)
        .set('Authorization', `Bearer ${constants.variables.accessToken}`)
        .send(constants.updatePost)
        .expect(204)

      await request(server).delete(`/blogger/blogs/${constants.variables.blogId}/posts/${constants.variables.postId}`)
        .set('Authorization', `Bearer ${constants.variables.accessToken}`)
        .expect(204)
    });

    it('should update and delete own blog', async () => {
      await request(server).put(`/blogger/blogs/${constants.variables.blogId}`)
        .set('Authorization', `Bearer ${constants.variables.accessToken}`)
        .send(constants.updateBlog)
        .expect(204);

      await request(server).delete(`/blogger/blogs/${constants.variables.blogId}`)
        .set('Authorization', `Bearer ${constants.variables.accessToken}`)
        .expect(204);
      
      const blogs1 = await request(server).get('/blogger/blogs')
        .set('Authorization', `Bearer ${constants.variables.accessToken}`)

      expect(blogs1.body).toStrictEqual({
        page: 1,
        pageSize: 10,
        pagesCount: 0,
        totalCount: 0,
        items: [],
      });
    });

    it('should return 404 if blog to delete or update is not exist', async () => {
      await request(server).put(`/blogger/blogs/${constants.variables.incorrectAnyUUID}`)
        .set('Authorization', `Bearer ${constants.variables.accessToken}`)
        .send(constants.updateBlog)
        .expect(404);

      await request(server).delete(`/blogger/blogs/${constants.variables.incorrectAnyUUID}`)
        .set('Authorization', `Bearer ${constants.variables.accessToken}`)
        .expect(404);
    });

    it('should return 403 if trying update and delete foreign blog, foreign blog stay without changes', async () => {
      await request(server).put(`/blogger/blogs/${constants.variables.blogId2}`)
        .set('Authorization', `Bearer ${constants.variables.accessToken}`)
        .send(constants.updateBlog)
        .expect(403);

      await request(server).delete(`/blogger/blogs/${constants.variables.blogId2}`)
        .set('Authorization', `Bearer ${constants.variables.accessToken}`)
        .expect(403);

      const blogs2 = await request(server).get('/blogger/blogs').set('Authorization', `Bearer ${constants.variables.accessToken2}`)
      
      expect(blogs2.body).toStrictEqual({
        page: 1,
        pageSize: 10,
        pagesCount: 1,
        totalCount: 1,
        items: [
          {
            createdAt: expect.any(String),
            description: constants.createBlog2.description,
            id: expect.any(String),
            name: constants.createBlog2.name,
            websiteUrl: constants.createBlog2.websiteUrl,
          }
        ],
      });
    });

    /*it('should create post by blog-route for blog-id', async () => {
      const response = await request(server).post(`/blogs/${constants.variables.blogId}/posts`).send(constants.createPost1).expect(201);
      expect(response.body).toStrictEqual({
        id: expect.any(String),
        title: constants.createPost1.title,
        content: constants.createPost1.content,
        shortDescription: constants.createPost1.shortDescription,
        blogId: constants.variables.blogId,
        blogName: constants.variables.blogId,
        createdAt: expect.any(String),
        extendedLikesInfo: {
          likesCount: 0,
          dislikesCount: 0,
          myStatus: "None",
          newestLikes: [],
        }
      });
    });

    it('should return 404 if trying create post by blog-route for incorrect blog-id', async () => {
      await request(server).post(`/blogs/${constants.variables.incorrectAnyEntityId}/posts`).send(constants.createPost1).expect(404);
    });

    it('should return 404 if trying get post by blog-route for incorrect blog-id', async () => {
      await request(server).get(`/blogs/${constants.variables.incorrectAnyEntityId}/posts`).expect(404);
    });

    it('should get posts by blog-route by blog-id', async () => {
      await request(server).post(`/blogs/${constants.variables.blogId}/posts`).send(constants.createPost2);
      await request(server).post(`/blogs/${constants.variables.blogId}/posts`).send(constants.createPost3);
      await request(server).post(`/blogs/${constants.variables.blogId}/posts`).send(constants.createPost4);
      const posts = await request(server).get(`/blogs/${constants.variables.blogId}/posts`);
      expect(posts.body.pagesCount).toBe(1)
      expect(posts.body.page).toBe(1)
      expect(posts.body.pageSize).toBe(10)
      expect(posts.body.totalCount).toBe(4)
      expect(posts.body.items.length).toBe(4)
      expect(posts.body.items[3].title).toBe('post-1')
    });

    it('should return 404 if blog to trying update not found', async () => {
      await request(server).put(`/blogs/${constants.variables.incorrectAnyEntityId}`).send(constants.updateBlog).expect(404);
    });

    it('should return 400 and errors if data for update blog is not valid', async () => {
      const response = await request(server).put(`/blogs/${constants.variables.blogId}`).send(constants.incorrectUpdateBlog).expect(400)
      expect(response.body).toStrictEqual({errorsMessages: [
        {field: "name", message: "name must be longer than or equal to 1 characters"},
      ]})
    });

    it('should update blog and return updated-blog by id', async () => {
      await request(server).put(`/blogs/${constants.variables.blogId}`).send(constants.updateBlog).expect(204);
      const response = await request(server).get(`/blogs/${constants.variables.blogId}`);
      expect(response.body).toStrictEqual({
        id: constants.variables.blogId,
        name: constants.updateBlog.name,
        description: constants.updateBlog.description,
        websiteUrl: constants.updateBlog.websiteUrl,
        createdAt: expect.any(String),
      });
    });

    it('should return status 404 if finding blog not found', async () => {
      await request(server).get(`/blogs/${constants.variables.incorrectAnyEntityId}`).expect(404)
    });

    it('should return status 204 if deleting blog', async () => {
      await request(server).delete(`/blogs/${constants.variables.blogId}`).expect(204)
    });

    it('should return status 404 if deleting blog not found', async () => {
      await request(server).delete(`/blogs/${constants.variables.blogId}`).expect(404)
    });*/

  });
});
