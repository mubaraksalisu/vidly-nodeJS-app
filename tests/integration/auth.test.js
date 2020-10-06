const { User } = require("../../models/user");
const { Genre } = require("../../models/genre");
const request = require("supertest");

describe("auth middleware", () => {
  let token;
  beforeEach(() => {
    server = require("../../index");
  });
  afterEach(async () => {
    await Genre.remove({});
    server.close();
  });

  const exec = () => {
    return request(server)
      .post("/api/genres")
      .set("x-auth-token", token)
      .send({ name });
  };

  it("Should return 401 if no token is provided", async () => {
    token = "";
    const res = await exec();
    expect(res.status).toBe(401);
  });

  it("Should return 400 if token is invalid", async () => {
    token = "a";
    const res = await exec();
    expect(res.status).toBe(400);
  });

  it("Should return 200 if token is valid", async () => {
    token = new User().generateAuthToken();
    const res = await exec();

    expect(res.status).toBe(200);
  });
});