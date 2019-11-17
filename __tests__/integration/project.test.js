const request = require('supertest');
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

const Project = require('../../src/app/models/Project');
const app = require('../../src/app');

describe('Project', () => {
  let mongoServer;
  beforeAll(async () => {
    mongoServer = new MongoMemoryServer();
    const URI = await mongoServer.getUri();

    mongoose.connect(URI, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
    });
  });

  afterAll(async done => {
    mongoose.disconnect(done);
    await mongoServer.stop();
  });

  afterEach(async () => {
    const collections = await mongoose.connection.db.collections();

    for (let collection of collections) {
      await collection.deleteMany();
    }
  });

  it('should be able to create a project', async () => {
    const response = await request(app)
      .post('/projects')
      .send({
        title: "Projeto Node.js IIIIIIIIIIIII",
        description: "Um projeto muito massa!"
      })

    expect(response.status).toBe(200);
  });

  it('should not create a project if it has already been defined', async () => {
    await request(app)
      .post('/projects')
      .send({
        title: "Projeto Node.js IIIIIIIIIIIII",
        description: "Um projeto muito massa!"
      })

    const response = await request(app)
      .post('/projects')
      .send({
        title: "Projeto Node.js IIIIIIIIIIIII",
        description: "Um projeto muito massa!"
      });

    expect(response.body).toMatchObject({ error: 'Duplicated project' });
  });

  it('should be able to list all projects', async () => {
    const response = await request(app)
      .get('/projects');

    expect(response.status).toBe(200);
  });
})