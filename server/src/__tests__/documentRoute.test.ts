import request from "supertest";
import app from "../app";
import mongoose from "mongoose";

describe("Document API", () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI || "");
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });
});

it("should create a new document", async () => {
  const response = await request(app)
    .post("/api/documents")
    .send({ title: "Test Document", content: "Test Content" })
    .expect(201);

  expect(response.body.title).toBe("Test Document");
});

it("should get an existing document", async () => {
  const newDocument = await request(app)
    .post("/api/documents")
    .send({ title: "Test Document", content: "Test Content" });

  const response = await request(app)
    .get(`/api/documents/${newDocument.body._id}`)
    .expect(200);

  expect(response.body.title).toBe("Test Document");
});
