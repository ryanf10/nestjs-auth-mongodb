import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { faker } from '@faker-js/faker';

describe('User Management (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  const user = {
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
      .send({ email: user.email, password: user.password })
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
      });
  });

  it('GET /auth/profile', () => {
    return request(app.getHttpServer())
      .get('/auth/profile')
      .set({ authorization: `Bearer ${user.access_token}` })
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
