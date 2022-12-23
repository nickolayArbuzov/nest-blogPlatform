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

  describe('auth-devices-controller', () => {
    it('should delete all data', async () => {
      await request(server).delete('/testing/all-data').expect(204)
    })

    it('should create new user, registration other user and login for get tokens', async () => {
      const res = await request(server).post('/sa/users').send(constants.createUser1).set('Authorization', 'Basic YWRtaW46cXdlcnR5');
      await request(server).post('/auth/registration').send(constants.correctRegistartionUser)

      const login = await request(server).post('/auth/login').set('user-agent', 'Mozilla').send(constants.correctLoginUser)
      constants.variables.setAccessToken(login.body.accessToken)
      constants.variables.setCookie(login.header['set-cookie'])
      await request(server).post('/auth/login').set('user-agent', 'AppleWebKit').send(constants.correctLoginUser)
      await request(server).post('/auth/login').set('user-agent', 'Chrome').send(constants.correctLoginUser)
      await request(server).post('/auth/login').set('user-agent', 'Safari').send(constants.correctLoginUser)
    });

    it('should realize case with refresh-token flow', async () => {
      const login = await request(server).post('/auth/login').set('user-agent', 'Safari-2').send(constants.correctLoginUser)
      constants.variables.setCookiePrev(login.header['set-cookie'])
      const response = await request(server).post('/auth/refresh-token').set('Cookie', constants.variables.cookiePrev).expect(200)
      constants.variables.setCookieAfter(response.header['set-cookie'])
      await request(server).post('/auth/refresh-token').set('Cookie', constants.variables.cookiePrev).expect(401)
      await request(server).post('/auth/logout').set('Cookie', constants.variables.cookiePrev).expect(401);
      await request(server).post('/auth/logout').set('Cookie', constants.variables.cookieAfter).expect(204);
    });

    it('should return 401 if try to login with incorrect creds', async () => {
      await request(server).post('/auth/login').send(constants.incorrectLoginUser).expect(401)
      await request(server).post('/auth/login').send(constants.notExistLoginUser).expect(401)
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

    it('should return devices by userId', async () => {
      const res = await request(server).get('/security/devices').set('Cookie', constants.variables.cookie)
      expect(res.body.length).toBe(4)
      constants.variables.setDeviceId(res.body[2].deviceId)
      expect(res.body[0]).toStrictEqual({
        ip: expect.any(String),
        title: expect.any(String),
        lastActiveDate: expect.any(String),
        deviceId: expect.any(String),
      })
    });

    it('should delete device by deviceId', async () => {
      await request(server).delete(`/security/devices/${constants.variables.deviceId}`).set('Cookie', constants.variables.cookie)
      const devices = await request(server).get('/security/devices').set('Cookie', constants.variables.cookie)
      expect(devices.body.length).toBe(3)
    })

    it('should return 404, if trying delete incorrect device by deviceId', async () => {
      await request(server).delete(`/security/devices/${constants.variables.deviceId}`).set('Cookie', constants.variables.cookie).expect(404)
      const devices = await request(server).get('/security/devices').set('Cookie', constants.variables.cookie)
      expect(devices.body.length).toBe(3)
    })

    it('should delete devices exept current device current user', async () => {
      await request(server).delete('/security/devices').set('Cookie', constants.variables.cookie)
      const devices = await request(server).get('/security/devices').set('Cookie', constants.variables.cookie)
      expect(devices.body.length).toBe(1)
    })

    it('should return 401 if try logout with non-valid refresh-token', async () => {
      await request(server).post('/auth/logout').set('Cookie', constants.variables.cookie).expect(401);
    });

  });
});
