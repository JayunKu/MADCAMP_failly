import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // CORS 설정 추가
  app.enableCors({
    origin: ['http://localhost:5173', 'http://localhost:3001'], // Vite 기본 포트와 다른 포트들
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true,
  });
  
  app.useGlobalPipes(new ValidationPipe());
  // Swagger 설정
  const config = new DocumentBuilder()
    .setTitle('Failly API')
    .setDescription('실패를 나누는 사람들을 위한 SNS')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();
