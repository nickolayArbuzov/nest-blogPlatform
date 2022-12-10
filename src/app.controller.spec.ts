import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from './app.module'
import * as request from 'supertest';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;
  let app: INestApplication
  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    appController = app.get<AppController>(AppController);
  });

  afterAll(async () => {
    app.close()
  })

  describe('root', () => {
    it('should return "Blogs"', async () => {
      const response = await request(app.getHttpServer()).get('blogs');
      expect(response).toBe('Hello World!');
    });
  });
});
