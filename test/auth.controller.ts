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

  describe('auth-controller', () => {
    it('should delete all data', async () => {
      await request(server).delete('/testing/all-data').expect(204)
    })

    it('should create new user and registration other user', async () => {
      await request(server).post('/users').send(constants.createUser1).set('Authorization', 'Basic YWRtaW46cXdlcnR5');
      const login = await request(server).post('/auth/registration').send(constants.correctRegistartionUser)
      expect(login.body).toStrictEqual({})

    });

    it('should try to registration if creds is exists', async () => {
      const login = await request(server).post('/auth/registration').send(constants.incorrectRegistartionUser)
      expect(login.body).toStrictEqual({errorsMessages: [
        {field: "login", message: "Login already exist"},
        {field: "email", message: "Mail already exist"},
      ]})
    });

    /*it('should return errors and 400 if try create user with incorrect data', async () => {
      const response = await request(server).post('/users').send(constants.incorrectCreateUser);
      expect(response.body).toStrictEqual({errorsMessages: [
        {field: "login", message: "login must be longer than or equal to 3 characters"},
        {field: "password", message: "password must be longer than or equal to 6 characters"},
        {field: "email", message: "email must match /^([\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$)/ regular expression"},
      ]});
      expect(response.status).toBe(400)
    });

    it('should return filtered array of users with pagination and sorting', async () => {
      await request(server).post('/users').send(constants.createUser2).expect(201);
      await request(server).post('/users').send(constants.createUser3).expect(201);
      await request(server).post('/users').send(constants.createUser4).expect(201);

      const users = await request(server).get(`/users?pageNumber=${constants.queryUser.pageNumber}&pageSize=${constants.queryUser.pageSize}&sortDirection=${constants.queryUser.sortDirection}&searchEmailTerm=${constants.queryUser.searchEmailTerm}&searchLoginTerm=${constants.queryUser.searchLoginTerm}`).expect(200)
      expect(users.body.pagesCount).toBe(1)
      expect(users.body.page).toBe(+constants.queryUser.pageNumber)
      expect(users.body.pageSize).toBe(+constants.queryUser.pageSize)
      expect(users.body.totalCount).toBe(2)
      expect(users.body.items.length).toBe(2)
      expect(users.body.items[0].login).toBe('login-3')
    });

    it('should return full array of users with default-pagination-sorting', async () => {
      const users = await request(server).get('/users').expect(200)
      expect(users.body.pagesCount).toBe(1)
      expect(users.body.page).toBe(1)
      expect(users.body.pageSize).toBe(10)
      expect(users.body.totalCount).toBe(4)
      expect(users.body.items.length).toBe(4)
      expect(users.body.items[3].login).toBe('login-1')
    });

    it('should return status 404 if finding user not found', async () => {
      await request(server).get(`/users/${constants.variables.incorrectAnyEntityId}`).expect(404)
    });

    it('should return status 204 if deleting user', async () => {
      await request(server).delete(`/users/${constants.variables.userId}`).expect(204)
    });

    it('should return status 404 if deleting user not found', async () => {
      await request(server).delete(`/users/${constants.variables.userId}`).expect(404)
    });*/

  });
});
