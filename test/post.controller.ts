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

  describe('post-controller', () => {
    it('should delete all data', async () => {
      await request(server).delete('/testing/all-data').expect(204)
    })

    it('should create new Post', async () => {
      const blog = await request(server).post('/blogs').send(constants.createBlog1);
      constants.variables.setBlogId(blog.body.id)
      const response = await request(server).post('/posts').send({...constants.createPost1, blogId: constants.variables.blogId});
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
      expect(response.status).toBe(201)
      constants.variables.setPostId(response.body.id)
    });

    it('should return errors and 400 if try create post with incorrect blogId', async () => {
      const response = await request(server).post('/posts').send({...constants.createPost1, blogId: ''});
      expect(response.body).toStrictEqual({errorsMessages: [
        {field: "blogId", message: "Blog doesn't exist"},
      ]});
      expect(response.status).toBe(400)
    });

    it('should return filtered array of post with pagination and sorting', async () => {
      await request(server).post('/posts').send({...constants.createPost2, blogId: constants.variables.blogId}).expect(201);
      await request(server).post('/posts').send({...constants.createPost3, blogId: constants.variables.blogId}).expect(201);
      await request(server).post('/posts').send({...constants.createPost4, blogId: constants.variables.blogId}).expect(201);

      const posts = await request(server).get(`/posts?pageNumber=${constants.queryBlog.pageNumber}&pageSize=${constants.queryBlog.pageSize}&sortDirection=${constants.queryBlog.sortDirection}`).expect(200)
      expect(posts.body.pagesCount).toBe(2)
      expect(posts.body.page).toBe(+constants.queryBlog.pageNumber)
      expect(posts.body.pageSize).toBe(+constants.queryBlog.pageSize)
      expect(posts.body.totalCount).toBe(4)
      expect(posts.body.items.length).toBe(2)
      expect(posts.body.items[0].title).toBe('post-3')
    });

    it('should return full array of posts with default-pagination-sorting', async () => {
      const posts = await request(server).get('/posts').expect(200)
      expect(posts.body.pagesCount).toBe(1)
      expect(posts.body.page).toBe(1)
      expect(posts.body.pageSize).toBe(10)
      expect(posts.body.totalCount).toBe(4)
      expect(posts.body.items.length).toBe(4)
      expect(posts.body.items[3].title).toBe('post-1')
    });

    it('should return 404 if post to trying update not found', async () => {
      await request(server).put(`/posts/${constants.variables.incorrectAnyUUID}`).send({...constants.updatePost, blogId: constants.variables.blogId}).expect(404);
    });

    it('should return 400 and errors if data for update post is not valid', async () => {
      const response = await request(server).put(`/posts/${constants.variables.postId}`).send({...constants.incorrectUpdatePost, blogId: constants.variables.blogId}).expect(400)
      expect(response.body).toStrictEqual({errorsMessages: [
        {field: "title", message: "title must be longer than or equal to 1 characters"},
      ]})
    });

    it('should return 400 and errors if blogId for update post is not valid', async () => {
      const response = await request(server).put(`/posts/${constants.variables.postId}`).send({...constants.createPost3, blogId: ''}).expect(400)
      expect(response.body).toStrictEqual({errorsMessages: [
        {field: "blogId", message: "Blog doesn't exist"},
      ]})
    });

    it('should update post and return updated-post by id', async () => {
      const res = await request(server).put(`/posts/${constants.variables.postId}`).send({...constants.updatePost, blogId: constants.variables.blogId});
      expect(res.body).toStrictEqual({})
      const response = await request(server).get(`/posts/${constants.variables.postId}`);
      expect(response.body).toStrictEqual({
        id: expect.any(String),
        title: constants.updatePost.title,
        content: constants.updatePost.content,
        shortDescription: constants.updatePost.shortDescription,
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

    it('should return status 404 if finding post not found', async () => {
      await request(server).get(`/posts/${constants.variables.incorrectAnyUUID}`).expect(404)
    });

    it('should return status 204 if deleting post', async () => {
      await request(server).delete(`/posts/${constants.variables.postId}`).expect(204)
    });

    it('should return status 404 if deleting post not found', async () => {
      await request(server).delete(`/posts/${constants.variables.incorrectAnyUUID}`).expect(404)
    });

  });
});
