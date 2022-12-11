import { BadRequestException, INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { useContainer } from 'class-validator';
import cookieParser = require('cookie-parser');
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
    app.use(cookieParser());
    app.useGlobalFilters(new HttpExceptionFilter())
    await app.init()
    server = app.getHttpServer()
  });

  afterAll(async () => {
    app.close()
  })

  describe('auth-controller', () => {
    it('should delete all data', async () => {
      await request(server).delete('/testing/all-data').expect(204)
    })

    it('should create new user, registration other user and login for get tokens', async () => {
      await request(server).post('/users').send(constants.createUser1).set('Authorization', 'Basic YWRtaW46cXdlcnR5');
      await request(server).post('/auth/registration').send(constants.correctRegistartionUser)
      const login = await request(server).post('/auth/login').send(constants.correctLoginUser)
      constants.variables.setAccessToken(login.body.accessToken)
      constants.variables.setCookie(login.header['set-cookie'])
    });

    it('should try to registration if creds is exists', async () => {
      const login = await request(server).post('/auth/registration').send(constants.incorrectRegistartionUser)
      expect(login.body).toStrictEqual({errorsMessages: [
        {field: "login", message: "Login already exist"},
        {field: "email", message: "Mail already exist"},
      ]})
    });

    it('should refresh tokens, with valid refresh-token', async () => {
      const response = await request(server).post('/auth/refresh-token').set('Cookie', constants.variables.cookie).expect(200);
      expect(response.body).toStrictEqual({accessToken: expect.any(String)})
    });

    it('should logout', async () => {
      const response = await request(server).post('/auth/refresh-token').set('Cookie', constants.variables.cookie).expect(200);
      expect(response.body).toStrictEqual({accessToken: expect.any(String)})
    });

  });
});
