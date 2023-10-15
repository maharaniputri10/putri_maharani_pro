/**testing */

const pool = require('../../database/postgres/pool');
const createServer = require('../createServer');
const container = require('../../container');
const ServerTestHelper = require('../../../../tests/ServerTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');



describe('/threads endpoint', () => {
    afterAll(async () => {
       await pool.end()
    });

    afterEach(async () => {
      await UsersTableTestHelper.cleanTable();
      await ThreadsTableTestHelper.cleanTable();
    });


describe('when POST /threads', () => {
  it('should response 201 and added thread', async () => {

    const Requestpayload = {
      title: 'dicoding',
      body: 'Dicoding Indonesia' 
    };

    const accessToken = await ServerTestHelper.getAccessToken();
    const server = await createServer(container);

    const response = await server.inject({
      method: 'POST',
      url: '/threads',
      payload: requestPayload,
      headers: { 
        Authorization: `Bearer ${accessToken}`
      }
    });

    const responseJson = JSON.parse(response.payload);
    expect(response.statusCode).toEqual(201);
    expect(responseJson.status).toEqual('success');
    expect(responseJson.data.addedThread).toBeDefined();
  });


  it('should response 400 when request payload not contain needed property', async () => {
    const requestPayload = {
      title:  'Dicoding Indonesia'
    };
    const accessToken = await ServerTestHelper.getAccessToken();
    const server = await createServer(container);

    const response = await server.inject({
      method: 'POST',
      url: '/threads',
      payload: requestPayload,
      headers: {
         Authorization: `Bearer ${accessToken}`
        }
    });

    const responseJson = JSON.parse(response.payload);
    expect(response.statusCode).toEqual(400);
    expect(responseJson.status).toEqual('fail');
    expect(responseJson.message).toEqual('Silahkan masukkan property yang dibutuhkan untuk membuat thread baru');
  });


  it('should response 400 when request payload not meet data type specification', async () => {
    const requestPayload = {
      title: dicoding,
      body: 'Dicoding Indonesia'
    };

    const accessToken = await ServerTestHelper.getAccessToken();
    const server = await createServer(container);

    const response = await server.inject({
      method: 'POST',
      url: '/threads',
      payload: requestPayload,
      headers: { Authorization: `Bearer ${accessToken}`}
    });

    const responseJson = JSON.parse(response.payload);
    expect(response.statusCode).toEqual(400);
    expect(responseJson.status).toEqual('fail');
    expect(responseJson.message).toEqual(' tipe data yang anda masukkan tidak sesuai');
  });
});


describe('when GET /threads/{threadId}', () => {
  it('should response 200 and show threadById', async () => {

    const threadId = 'thread-123';

    await UsersTableTestHelper.addUser(
      { id: 'thread-123' }
    );

    await ThreadsTableTestHelper.addThread(
      { 
        id: threadId, 
        owner: 'dicoding-123' 
      }
    );
    const server = await createServer(container);

    const response = await server.inject({
      method: 'GET',
      url: `/threads/${threadId}`
    });

    const responseJson = JSON.parse(response.payload);
    expect(response.statusCode).toEqual(200);
    expect(responseJson.status).toEqual('success');
    expect(responseJson.data.thread).toBeDefined();
  });


  it('should response 404 when requested thread not found', async () => {
    const threadId = 'thread-123';

    const server = await createServer(container);
    const response = await server.inject({
      method: 'GET',
      url: `/threads/${threadId}`
    });

    const responseJson = JSON.parse(response.payload);
    expect(response.statusCode).toEqual(404);
    expect(responseJson.status).toEqual('fail');
    expect(responseJson.message).toEqual('oops..,thread tidak ditemukan');
        
      });
   });
});