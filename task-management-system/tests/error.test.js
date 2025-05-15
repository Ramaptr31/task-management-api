const request = require('supertest');
const app = require('../app');

describe('Error Handling', () => {
  
  test('Should return 404 for non-existent routes', async () => {
    const response = await request(app)
      .get('/non-existent-route')
      .expect(404);
    
    expect(response.body.status).toBe('error');
    expect(response.body.message).toContain('Not Found');
  });
  
  test('Should handle JSON parsing errors', async () => {
    const response = await request(app)
      .post('/tasks')
      .set('Content-Type', 'application/json')
      .send('{invalid-json')
      .expect(400);
    
    expect(response.body.status).toBe('error');
    expect(response.body.message).toContain('Invalid JSON');
  });
}); 