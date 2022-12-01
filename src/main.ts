import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as cookieParser from 'cookie-parser';
import { NestFactory } from '@nestjs/core';
import { useContainer } from 'class-validator';
import { AppModule } from './app.module';
//import { HttpExceptionFilter } from './infrastructure/filters/http-exeption.filter';

async function start() {
  
  const PORT = Number(process.env.PORT) || 7447
  const app = await NestFactory.create(AppModule, { cors: true })
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
  //app.useGlobalFilters(new HttpExceptionFilter())
  app.use(cookieParser());
  //app.setGlobalPrefix('api')
  await app.listen(PORT, () => console.log(`NEST on ${PORT}`))
}

start()