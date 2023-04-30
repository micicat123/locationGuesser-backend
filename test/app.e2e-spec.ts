import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { Repository } from 'typeorm/repository/Repository';
import { User } from '../src/entities/user.entity';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let userRepository: Repository<User>;
  
  let userToken;
  let userTokenNotAdmin;
  let createdLocationId;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    userRepository = await moduleFixture.get('UserRepository');
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  //AUTH
  describe('/auth/register (POST)', () => {
    it('should register new user', () => {
        return request(app.getHttpServer())
        .post('/auth/register')
        .send({ 
            username: 'test@gmail.com', 
            password: 'test123',
            passwordConfirm: 'test123',
            firstName: 'Testeron',
            lastName: 'Makaron'
        })
        .expect(201);
    });

    it('should return error because user already exists', () => {
        return request(app.getHttpServer())
        .post('/auth/register')
        .send({ 
            username: 'test@gmail.com', 
            password: 'test123',
            passwordConfirm: 'test123',
            firstName: 'Testeron',
            lastName: 'Makaron'
        })
        .expect(400)
        .expect((res) => {
            expect(res.body.message).toBe(`test@gmail.com is already taken`);
        });
    });

    it('should return error because passwords do not match', () => {
        return request(app.getHttpServer())
        .post('/auth/register')
        .send({ 
            username: 'test123@gmail.com', 
            password: 'test',
            passwordConfirm: 'test123',
            firstName: 'Testeron',
            lastName: 'Makaron'
        })
        .expect(400)
        .expect((res) => {
            expect(res.body.message).toBe(`Passwords do not match.`);
        });
    });
  });

  describe('/auth/login (POST)', () => {
    it('should return access_token of user that is admin', () => {
        return request(app.getHttpServer())
        .post('/auth/login')
        .send({ username: 'john.doe@gmail.com', password: '123456' })
        .expect(201)
        .then(res => {
            expect(res.text).toBeDefined();
            userToken = res.text;
        });
    });

    it('should return access_token of user that is not admin', () => {
        return request(app.getHttpServer())
        .post('/auth/login')
        .send({ username: 'noreplay.mici@gmail.com', password: '123456' })
        .expect(201)
        .then(res => {
            expect(res.text).toBeDefined();
            userTokenNotAdmin = res.text;
        });
    });

    it('should return error because username was not found', () => {
        return request(app.getHttpServer())
        .post('/auth/login')
        .send({ username: 'wrong', password: 'wrong' })
        .expect(404);
    });

    it('should return error because password is not correct', () => {
        return request(app.getHttpServer())
        .post('/auth/login')
        .send({ username: 'john.doe@gmail.com', password: 'test111' })
        .expect(400);
    });
  });

  describe('/auth/admin (GET)', () => {
    it('should return that user is an admin', () => {
        return request(app.getHttpServer())
        .get('/auth/admin')
        .set('authorization', `Bearer ${userToken}`)
        .set('Cookie', `${userToken}`)
        .expect(200)
        .then((response) => {
            expect(response.body).toStrictEqual({"body": {"message": "This user is an admin", "success": true}});
        });
    });

    it('should return that user is not an admin', () => {
        return request(app.getHttpServer())
        .get('/auth/admin')
        .set('authorization', `Bearer ${userTokenNotAdmin}`)
        .set('Cookie', `${userTokenNotAdmin}`)
        .expect(200)
        .then((response) => {
            expect(response.body).toStrictEqual({"body": {"message": "This user is not an admin", "success": false}});
        });
    });
  });    

  //LOCATION
  it('/location (GET) should get latests locations', () => {
    return request(app.getHttpServer())
      .get('/location/1')
      .expect(200)
      .then((response) => {
        expect(response.body).toBeDefined();
        expect(response.body.length).toBe(9);
      });
  });

  it('/location/random (GET) should get random location', () => {
    return request(app.getHttpServer())
      .get('/location/random-location')
      .set('authorization', `Bearer ${userToken}`)
      .expect(200)
      .then((response) => {
        expect(response.body).toBeDefined();
        expect(response.body.length).toBe(1);   
      });
  });

  it('/location/user (GET) should get 4 latests user locations', () => {
    return request(app.getHttpServer())
      .get('/location/user')
      .set('authorization', `Bearer ${userToken}`)
      .set('Cookie', `${userToken}`)
      .expect(200)
      .then((response) =>{
        expect(response.body.length).toBe(4);  
      });
  });

  it('/location/leaderboard/1 (GET) should get leaderboard of guesses for location', () => {
    return request(app.getHttpServer())
      .get('/location/leaderboard/1')
      .set('authorization', `Bearer ${userToken}`)
      .expect(200);
  });

  it('/location (POST) should create a new location', () => {
    return request(app.getHttpServer())
      .post('/location')
      .send({ 
        latitude: 999999, 
        longitude: 999999
      })
      .set('authorization', `Bearer ${userToken}`)
      .set('Cookie', `${userToken}`)
      .expect(201)
      .then((response) =>{
        createdLocationId = response.body.id;  
      });
  });

  it('/location/1 (PUT) should edit location', () => {
    return request(app.getHttpServer())
      .put('/location/1')
      .send({ 
        latitude: 6969
      })
      .set('authorization', `Bearer ${userToken}`)
      .set('Cookie', `${userToken}`)
      .expect(200) 
      .then((response) =>{
        expect(response.body.latitude).toBe(6969);  
      });
  });

  it('/location/id (PUT) should delete location', () => {
    return request(app.getHttpServer())
      .put(`/location/${createdLocationId}`)
      .set('authorization', `Bearer ${userToken}`)
      .expect(200);
  });


  //USER
  it('/user/best (GET) should return users best guesses', () => {
    return request(app.getHttpServer())
      .get(`/user/best`)
      .set('authorization', `Bearer ${userToken}`)
      .set('Cookie', `${userToken}`)
      .expect(200)
      .then((response) =>{
        expect(response.body.length).toBe(3);  
      });
  });

  it('/user/info (PUT) should update users info', () => {
    return request(app.getHttpServer())
      .put(`/user/info`)
      .send({ 
        username: 'john.doe@gmail.com',
        firstName: 'Jon',
        lastName: 'Doe'
      })
      .set('authorization', `Bearer ${userToken}`)
      .set('Cookie', `${userToken}`)
      .expect(200)
      .then((response) =>{
        expect(response.body.firstName).toBe('Jon');  
      });
  });

  it('/user/pass (PUT) should update users password', () => {
    return request(app.getHttpServer())
      .put(`/user/pass`)
      .send({ 
        currentPassword: '123456',
        newPassword: '123456',
        confirmNewPassword: '123456'
      })
      .set('authorization', `Bearer ${userToken}`)
      .set('Cookie', `${userToken}`)
      .expect(200);
  });

  it('/user/send-email (POST) should send an email', () => {
    return request(app.getHttpServer())
      .post(`/user/send-email`)
      .send({ 
        username: 'noreplay.mici@gmail.com'
      })
      .set('authorization', `Bearer ${userTokenNotAdmin}`)
      .expect(201);
  });

  describe('/user/auth-email/:token/:username (GET)', () => {
    it('should succesfully authenticate token', () => {
        return request(app.getHttpServer())
        .get(`/user/auth-email/${userTokenNotAdmin}/noreplay.mici@gmail.com`)
        .set('authorization', `Bearer ${userTokenNotAdmin}`)
        .expect(200)
    });

    it('should not authenticate token', () => {
        return request(app.getHttpServer())
        .get(`/user/auth-email/6gf27/noreplay.mici@gmail.com`)
        .set('authorization', `Bearer ${userTokenNotAdmin}`)
        .expect(400)
    });
  });    

  it('/user/log-action (POST) should create a new log', () => {
    return request(app.getHttpServer())
      .post(`/user/log-action`)
      .send({ 
        action: 'click',
        component: 'button',
        newValue: '',
        URL: 'example.com'
      })
      .set('authorization', `Bearer ${userToken}`)
      .set('Cookie', `${userToken}`)
      .expect(201);
  });

  it('/user/admin/logs (GET) should return latest 100 logs', () => {
    return request(app.getHttpServer())
      .get(`/user/admin/logs`)
      .set('authorization', `Bearer ${userTokenNotAdmin}`)
      .expect(200);
  });

  //GUESS
  describe('/guess/:lId/:distance (POST)', () => {
    it('should create a new guess', () => {
        return request(app.getHttpServer())
        .post(`/guess/4/100`)
        .set('authorization', `Bearer ${userToken}`)
        .set('Cookie', `${userToken}`)
        .expect(201);
    });

    it('should not create new guess, because user already guessed', () => {
        return request(app.getHttpServer())
        .post(`/guess/4/100`)
        .set('authorization', `Bearer ${userToken}`)
        .set('Cookie', `${userToken}`)
        .expect(400);
    });
  });    

  //UPLOAD
  describe('/upload/:folder/:lid? (POST)', () => {
    it('should upload an image to locations folder', async () => {
      return request(app.getHttpServer())
        .post('/upload/locations/1')
        .set('authorization', `Bearer ${userToken}`)
        .attach('file', './test/images/test.png')
        .expect(201)
        .then((response) =>{
            expect(response.text).toContain('image successfully uploaded'); 
        });

    });

    it('should upload an image to profile_pictures folder', async () => {
      return request(app.getHttpServer())
        .post('/upload/profile_pictures')
        .set('authorization', `Bearer ${userToken}`)
        .set('Cookie', `${userToken}`)
        .attach('file', './test/images/test.png')
        .expect(201)
        .then((response) =>{
            expect(response.text).toContain('image successfully uploaded'); 
        });
    });
  });

  describe('/upload/:repository/:lid? (GET)', () => {
    it('should return an image for user repository', async () => {
      return request(app.getHttpServer())
        .get('/upload/user')
        .set('authorization', `Bearer ${userToken}`)
        .set('Cookie', `${userToken}`)
        .expect(200)
        .then((response) =>{
            expect(response.type).toEqual('image/png'); 
        });
    });

    it('should return an image for location repository', async () => {
      return request(app.getHttpServer())
      .get('/upload/location/1')
      .set('authorization', `Bearer ${userToken}`)
      .expect(200)
      .then((response) =>{
            expect(response.type).toEqual('image/png'); 
        });
    });

    it('should return an error when retrieving from an invalid repository', async () => {
      return request(app.getHttpServer())
      .get('/upload/invalid_repository')
      .expect(400)
      .then((response) =>{
            expect(response.text).toContain('Invalid repository');
        });
    });
  });


  afterAll(async () => {
    await userRepository.query(`DELETE FROM "user" WHERE username='test@gmail.com';`);
    await userRepository.query(`UPDATE "user" SET "firstName"='John' WHERE id=7;`);

    await userRepository.query(`DELETE FROM "location" WHERE latitude=999999;`);
    await userRepository.query(`UPDATE "location" SET latitude=1.1523 WHERE id=1;`);

    await userRepository.query(`DELETE FROM "log" WHERE "URL"='example.com';`);

    await userRepository.query(`DELETE FROM "guess" WHERE user_id=7 AND location_id=4;`);
  });
});
