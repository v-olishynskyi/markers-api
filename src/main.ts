import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import setupSwagger from './swagger';
import cookieParser from 'cookie-parser';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { ConfigService } from '@nestjs/config';
import { config } from 'aws-sdk';
import { writeFile } from 'fs';
import { faker } from '@faker-js/faker';

declare const module: any;

const generateFakes = async () => {
  function createRandomUser() {
    const date = faker.date
      .soon({
        days: 10,
        refDate: new Date().toISOString(),
      })
      .toISOString();

    const userId = faker.string.uuid();
    const avatarId = faker.string.uuid();

    return {
      id: userId,
      email: faker.internet.email().toLowerCase(),
      first_name: faker.person.firstName(),
      last_name: faker.person.lastName(),
      middle_name: faker.person.middleName(),
      // avatar: {
      //   id: avatarId,
      //   user_id: userId,
      //   key: null,
      //   url: faker.internet.avatar(),
      // },
      password: '$2b$12$cexIp563fGI1zgXoAA8ubegesUMjCIe21c3X4hFi3VPMeHuu1owEi',
      username: faker.internet.userName(),
      created_at: date,
      updated_at: date,
    };
  }

  const users = faker.helpers.multiple(createRandomUser, {
    count: 200,
  });
  await writeFile('./users.json', JSON.stringify(users), () => {
    return;
  });

  // const avatars = users.map((user) => ({ ...user.avatar }));
  // await writeFile('./avatars.json', JSON.stringify(avatars), () => {
  //   return;
  // });
  const avatars = users.map((user) => {
    const avatarId = faker.string.uuid();
    return {
      id: avatarId,
      user_id: user.id,
      key: null,
      url: faker.internet.avatar(),
    };
  });
  await writeFile('./avatars.json', JSON.stringify(avatars), () => {
    return;
  });
};

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.use(cookieParser());
  app.setGlobalPrefix('api/v1');
  app.useStaticAssets(join(__dirname, '..', 'images'), {
    prefix: '/images/',
  });

  const configService = app.get(ConfigService);
  config.update({
    accessKeyId: configService.get('AWS_ACCESS_KEY_ID'),
    secretAccessKey: configService.get('AWS_SECRET_ACCESS_KEY'),
    region: configService.get('AWS_REGION'),
  });

  setupSwagger(app);
  await app.listen(3001);

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
bootstrap();
// generateFakes();
