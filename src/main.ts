import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from './common/modules/config/config.service';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);

  const mode = configService.getString('MODE');
  const isDevelopmentOrStaging = mode === 'development' || mode === 'staging';

  if (isDevelopmentOrStaging) {
    setupSwagger(app);
  }

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  const port = configService.getNumber('PORT');
  await app.listen(port);
}

async function setupSwagger(app: INestApplication) {
  const config = new DocumentBuilder().setTitle('GoalDiary API').setVersion('1.0').build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
}

bootstrap();
