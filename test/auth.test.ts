
import request from 'supertest';
import app from '../src/index'; // Importar la app principal
import { prisma } from '../src/db';

beforeAll(async () => {
  // Limpiar la base de datos antes de las pruebas en el orden correcto
  await prisma.historialLogin.deleteMany({});
  await prisma.comentario.deleteMany({});
  await prisma.usuario.deleteMany({});
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe('Auth Endpoints', () => {
  let testUser = {
    nombre: 'Test User',
    email: 'test@example.com',
    password: 'password123'
  };

  it('should register a new user', async () => {
    const res = await request(app)
      .post('/auth/register')
      .send(testUser);
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.email).toEqual(testUser.email);
  });

  it('should login the user and return a token', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({
        email: testUser.email,
        password: testUser.password
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('token');
  });

  it('should fail to login with wrong credentials', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({
        email: testUser.email,
        password: 'wrongpassword'
      });
    expect(res.statusCode).toEqual(401);
  });
});
