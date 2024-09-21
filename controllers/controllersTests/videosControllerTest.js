jest.mock('axios');
const supertest = require('supertest');
const { app } = require('../../index'); // Import your Express app
const axios = require('axios');

describe('recording endpoint', () => {
  it('successfully uploads a video', async () => {
    // Mock the JWT verification (you might need to mock this function depending on your implementation)
    jest.mock('jsonwebtoken', () => ({
      verify: jest.fn().mockReturnValue(true)
    }));

    // Mock axios calls
    axios.post.mockResolvedValueOnce({
      headers: {
        'x-guploader-uploadid': 'test-upload-id'
      }
    });
    axios.put.mockResolvedValueOnce({}); // Mock the first PUT call
    axios.put.mockResolvedValueOnce({}); // Mock the second PUT call for completion

    const response = await supertest(app)
      .post('/api')
      .attach('video', Buffer.from('mock video data', 'utf-8'), 'video.mp4')
      .field('otherField', 'value');

    expect(response.statusCode).toBe(201);
    expect(response.text).toBe('Video uploaded successfully');
    // Add more assertions here as needed
  });

  // Add more tests here for error handling, invalid inputs, etc.
});