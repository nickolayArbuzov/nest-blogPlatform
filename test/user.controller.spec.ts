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

  describe('user-controller', () => {
    it('should delete all data', async () => {
      await request(server).delete('/testing/all-data').expect(204)
    })

    it('should create new User', async () => {
      const response = await request(server).post('/users').set('Authorization', 'Basic YWRtaW46cXdlcnR5').send(constants.createUser1);
      expect(response.body).toStrictEqual({
        id: expect.any(String),
        login: constants.createUser1.login,
        email: constants.createUser1.email,
        createdAt: expect.any(String),
      });
      expect(response.status).toBe(201)
      constants.variables.setUserId(response.body.id)
    });

    it('should return errors and 400 if try create user with incorrect data', async () => {
      const response = await request(server).post('/users').set('Authorization', 'Basic YWRtaW46cXdlcnR5').send(constants.incorrectCreateUser);
      expect(response.body).toStrictEqual({errorsMessages: [
        {field: "login", message: "login must be longer than or equal to 3 characters"},
        {field: "password", message: "password must be longer than or equal to 6 characters"},
        {field: "email", message: "email must match /^([\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$)/ regular expression"},
      ]});
      expect(response.status).toBe(400)
    });

    it('should return errors and 400 if try create user with incorrect data v2', async () => {
      const response = await request(server).post('/users').set('Authorization', 'Basic YWRtaW46cXdlcnR5').send({"login":"sh","password":"length_21-weqweqweqwq","email":"someemail@gg.com"});
      expect(response.body).toStrictEqual({errorsMessages: [
        {field: "login", message: "login must be longer than or equal to 3 characters"},
        {field: "password", message: "password must be shorter than or equal to 20 characters"},
      ]});
      expect(response.status).toBe(400)
    });

    it('should return filtered array of users with pagination and sorting', async () => {
      await request(server).post('/users').set('Authorization', 'Basic YWRtaW46cXdlcnR5').send(constants.createUser2).expect(201);
      await request(server).post('/users').set('Authorization', 'Basic YWRtaW46cXdlcnR5').send(constants.createUser3).expect(201);
      await request(server).post('/users').set('Authorization', 'Basic YWRtaW46cXdlcnR5').send(constants.createUser4).expect(201);

      const users = await request(server).get(`/users?pageNumber=${constants.queryUser.pageNumber}&pageSize=${constants.queryUser.pageSize}&sortDirection=${constants.queryUser.sortDirection}&searchEmailTerm=${constants.queryUser.searchEmailTerm}&searchLoginTerm=${constants.queryUser.searchLoginTerm}`).set('Authorization', 'Basic YWRtaW46cXdlcnR5').expect(200)
      expect(users.body.pagesCount).toBe(1)
      expect(users.body.page).toBe(+constants.queryUser.pageNumber)
      expect(users.body.pageSize).toBe(+constants.queryUser.pageSize)
      expect(users.body.totalCount).toBe(2)
      expect(users.body.items.length).toBe(2)
      expect(users.body.items[0].login).toBe('login-3')
    });

    it('should return full array of users with default-pagination-sorting', async () => {
      const users = await request(server).get('/users').set('Authorization', 'Basic YWRtaW46cXdlcnR5').set('Authorization', 'Basic YWRtaW46cXdlcnR5').expect(200)
      expect(users.body.pagesCount).toBe(1)
      expect(users.body.page).toBe(1)
      expect(users.body.pageSize).toBe(10)
      expect(users.body.totalCount).toBe(4)
      expect(users.body.items.length).toBe(4)
      expect(users.body.items[3].login).toBe('login-1')
    });

    it('should return status 404 if finding user not found', async () => {
      await request(server).get(`/users/${constants.variables.incorrectAnyEntityId}`).set('Authorization', 'Basic YWRtaW46cXdlcnR5').expect(404)
    });

    it('should return status 204 if deleting user', async () => {
      await request(server).delete(`/users/${constants.variables.userId}`).set('Authorization', 'Basic YWRtaW46cXdlcnR5').expect(204)
    });

    it('should return status 404 if deleting user not found', async () => {
      await request(server).delete(`/users/${constants.variables.userId}`).set('Authorization', 'Basic YWRtaW46cXdlcnR5').expect(404)
    });

  });
});
