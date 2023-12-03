import {ConfigService} from "@nestjs/config";
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {INestApplication} from "@nestjs/common";

async function bootstrap() {
  const app: INestApplication = await NestFactory.create(AppModule);
  const configService: ConfigService = app.get(ConfigService)
  const BACKEND_PORT = configService.get('BACKEND_PORT')
  app.enableCors({
    origin: 'http://localhost:3000',
    credentials: true
  })

  await app.listen(BACKEND_PORT, (): void => {
    console.info(`Server listening on port ${BACKEND_PORT}`)
  });
}
bootstrap();
