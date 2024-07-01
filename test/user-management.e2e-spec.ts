import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { faker } from '@faker-js/faker';
import cookieParser from 'cookie-parser';

describe('User Management (e2e)', () => {
  let app: INestApplication;
  let cookie: string;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    app.use(cookieParser(process.env.COOKIES_SECRET));

    await app.init();
  });

  const user = {
    username: faker.internet.userName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
    profile: {
      id: '',
      email: '',
      role: {},
      createdAt: '',
      updatedAt: '',
    },
    access_token: '',
    refresh_token: '',
  };

  it('POST /auth/register', () => {
    return request(app.getHttpServer())
      .post('/auth/register')
      .send({
        email: user.email,
        username: user.username,
        password: user.password,
      })
      .expect(200)
      .expect((response) => {
        const { email } = response.body.data;
        expect(email).toEqual(user.email);
        user.profile = { ...response.body.data };
      });
  });

  it('POST /auth/login', () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: user.email, password: user.password })
      .expect(200)
      .expect((response) => {
        const data = response.body.data;
        expect(typeof data.access_token).toBe('string');
        expect(typeof data.refresh_token).toBe('string');
        user.access_token = data.access_token;
        user.refresh_token = data.refresh_token;
        cookie = response.header['set-cookie'];
      });
  });

  it('GET /auth/profile', () => {
    return request(app.getHttpServer())
      .get('/auth/profile')
      .set('Cookie', cookie)
      .expect(200)
      .expect((response) => {
        const { updatedAt, ...profile } = response.body.data;
        const { updatedAt: valueUpdatedAt, ...value } = user.profile;
        expect(profile).toMatchObject(value);
      });
  });

  afterAll(async () => {
    await app.close();
  });
});
