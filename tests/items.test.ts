import app from "../src/app";
import supertest from "supertest";
import { prisma } from "../src/database";
import { item } from "./factories/itemFactory";
import { items } from "@prisma/client";
import { faker } from "@faker-js/faker";

const agent = supertest(app);

beforeAll(async () => {
  await prisma.$executeRaw`TRUNCATE TABLE items`
})

describe('Testa POST /items ', () => {

  it('Deve retornar 201, se cadastrado um item no formato correto', async () => {
    const newItem = await item();
    const response = await agent.post('/items').send(newItem);
    expect(response.statusCode).toBe(201);
  });

  it('Deve retornar 409, ao tentar cadastrar um item que exista', async () => {
    const newItem = await item();
    await agent.post('/items').send(newItem);

    const response = await agent.post('/items').send(newItem);
    expect(response.statusCode).toBe(409);
  });
});

describe('Testa GET /items ', () => {
  it('Deve retornar status 200 e o body no formato de Array', async () => {
    const response = await agent.get('/items');

    expect(response.statusCode).toBe(200);
    expect(response.body).not.toBeNull();
  });
});

describe('Testa GET /items/:id ', () => {
  it('Deve retornar status 200 e um objeto igual ao item cadastrado', async () => {
    const newItem = await item();
    const responseOne = await agent.post('/items').send(newItem);
    const { id } = responseOne.body;

    const responseTwo = await agent.get(`/items/${id}`);
    expect(responseTwo.statusCode).toBe(200);
    expect(responseTwo.body).toMatchObject<items>({ id, ...newItem })
  });


  it('Deve retornar status 404 caso não exista um item com esse id', async () => {
    const randomId = faker.datatype.number();
    const response = await agent.get(`/items/${randomId}`);

    expect(response.statusCode).toBe(404);
  });
});

afterAll(async () => {
  await prisma.$executeRaw`TRUNCATE TABLE items`;
  await prisma.$disconnect();
})