import { BadRequestException, INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { useContainer } from 'class-validator';
import * as request from 'supertest';
import { HttpExceptionFilter } from '../src/helpers/filters/http-exeption.filter';
import { AppModule } from '../src/app.module'
import * as constants from './constants';


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
    console.log('app')
    app.close()
  })

  describe('blog-controller', () => {
    it('should delete all data', async () => {
      await request(server).delete('/testing/all-data').expect(204)
    })

    it('should create new Blog', async () => {
      const response = await request(server).post('/blogs').send(constants.createBlog1);
      expect(response.body).toStrictEqual({
        id: expect.any(String),
        name: constants.createBlog1.name,
        description: constants.createBlog1.description,
        websiteUrl: constants.createBlog1.websiteUrl,
        createdAt: expect.any(String),
      });
      expect(response.status).toBe(201)
      constants.variables.setBlogId(response.body.id)
    });

    it('should return errors and 400 if try create blog with incorrect data', async () => {
      const response = await request(server).post('/blogs').send(constants.incorrectCreateBlog);
      expect(response.body).toStrictEqual({errorsMessages: [
        {field: "name", message: "name must be longer than or equal to 1 characters"},
        {field: "description", message: "description must be longer than or equal to 1 characters"},
        {field: "websiteUrl", message: "websiteUrl must match /^(https:\\/\\/([a-zA-Z0-9_-]+\\.)+[a-zA-Z0-9_-]+(\\/[a-zA-Z0-9_-]+)*\\/?$)/ regular expression"},
      ]});
      expect(response.status).toBe(400)
    });

    it('should return filtered array of blogs with pagination and sorting', async () => {
      await request(server).post('/blogs').send(constants.createBlog2).expect(201);
      await request(server).post('/blogs').send(constants.createBlog3).expect(201);
      await request(server).post('/blogs').send(constants.createBlog4).expect(201);

      const blogs = await request(server).get(`/blogs?pageNumber=${constants.queryBlog.pageNumber}&pageSize=${constants.queryBlog.pageSize}&sortDirection=${constants.queryBlog.sortDirection}&searchNameTerm=${constants.queryBlog.searchNameTerm}`).expect(200)
      expect(blogs.body.pagesCount).toBe(2)
      expect(blogs.body.page).toBe(+constants.queryBlog.pageNumber)
      expect(blogs.body.pageSize).toBe(+constants.queryBlog.pageSize)
      expect(blogs.body.totalCount).toBe(3)
      expect(blogs.body.items.length).toBe(1)
      expect(blogs.body.items[0].name).toBe('blogg-4')
    });

    it('should return full array of blogs with default-pagination-sorting', async () => {
      const blogs = await request(server).get('/blogs').expect(200)
      expect(blogs.body.pagesCount).toBe(1)
      expect(blogs.body.page).toBe(1)
      expect(blogs.body.pageSize).toBe(10)
      expect(blogs.body.totalCount).toBe(4)
      expect(blogs.body.items.length).toBe(4)
      expect(blogs.body.items[3].name).toBe('blog-1')
    });

    it('should create post by blog-route for blog-id', async () => {
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
    });

  });
});
