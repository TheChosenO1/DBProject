const request = require('supertest');
const app = require('../index');

describe('Health Check Endpoints', () => {
    it('should return 200 and health status', async () => {
        const response = await request(app)
            .get('/api/health')
            .expect('Content-Type', /json/)
            .expect(200);

        expect(response.body).toHaveProperty('status', 'ok');
    });
}); 