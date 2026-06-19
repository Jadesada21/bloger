import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config'
import cookieParser from 'cookie-parser'
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService)

  app.enableCors({
    origin: configService.get("FRONTEND_URL"),
    Credential: true
  })

  app.use(cookieParser())

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true
    })
  )

  app.setGlobalPrefix('/')

  const port = configService.get<number>('PORT') || 6060

  await app.listen(port);

  console.log(`Service is running on ${port}`)
}
bootstrap();
