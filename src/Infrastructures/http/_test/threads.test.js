const pool = require("../../database/postgres/pool");
const container = require("../../container");
const createServer = require("../createServer");
const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper");
const ServerTestHelper = require("../../../../tests/ServerTestHelper");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");

describe("/threads endpoint", () => {
  beforeAll(async () => {
    const userPayload = {
      username: "dicoding",
      password: "secret",
      fullname: "Dicoding Indonesia",
    };

    await UsersTableTestHelper.addUser(userPayload);
  });

  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await UsersTableTestHelper.cleanTable();
    await pool.end();
  });

  describe("when POST /threads", () => {
    it("should response 201 and persisted thread", async () => {
      const requestPayload = {
        title: "dicoding",
        body: "Dicoding Indonesia",
      };

      //const accessToken = await ServerTestHelper.getAccessToken();
      const accessToken = await ServerTestHelper.getAccessToken({});
      const server = await createServer(container);

      const response = await server.inject({
        method: "POST",
        url: "/threads",
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual("success");
      expect(responseJson.data.addedThread).toBeDefined();
    });

    it("should response 400 when request payload not contain needed property", async () => {
      const requestPayload = {
        title: "Dicoding Indonesia",
      };
      //const accessToken = await ServerTestHelper.getAccessToken();
      const accessToken = await ServerTestHelper.getAccessToken({});
      const server = await createServer(container);

      const response = await server.inject({
        method: "POST",
        url: "/threads",
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual("fail");
      expect(responseJson.message).toEqual(
        "tidak dapat membuat thread baru silahkan kirimkan title & body"
      );
    });

    it("should response 400 when request payload not meet data type specification", async () => {
      const requestPayload = {
        title: 910,
        body: ["abbjuyo"],
      };

      //const accessToken = await ServerTestHelper.getAccessToken();
      const accessToken = await ServerTestHelper.getAccessToken({});
      const server = await createServer(container);

      const response = await server.inject({
        method: "POST",
        url: "/threads",
        payload: requestPayload,
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual("fail");
      expect(responseJson.message).toEqual("tipe data tidak sesuai");
    });
  });

  describe("when GET /threads/{threadId}", () => {
    it("should response 200 and get thread by id", async () => {
      const threadId = "thread-123";

      await ThreadsTableTestHelper.addThread({
        id: threadId,
        owner: "user-123",
      });
      const server = await createServer(container);

      const response = await server.inject({
        method: "GET",
        url: `/threads/${threadId}`,
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual("success");
      expect(responseJson.data.thread).toBeDefined();
    });

    it("should response 404 when requested thread not found", async () => {
      const threadId = "thread-123";

      const server = await createServer(container);
      const response = await server.inject({
        method: "GET",
        url: `/threads/${threadId}`,
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual("fail");
      expect(responseJson.message).toEqual("thread tidak ditemukan");
    });
  });
});