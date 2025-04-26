const request = require('supertest');
const app = require('../index');
const pool = require('../db/pool');

// Mock the database pool
jest.mock('../db/pool', () => ({
    query: jest.fn()
}));

describe('Art Endpoints', () => {
    beforeEach(() => {
        // Clear all mocks before each test
        jest.clearAllMocks();
    });

    describe('GET /api/art/carousel', () => {
        it('should return a list of artworks', async () => {
            const mockArtworks = [
                { id: 1, name: 'Artwork 1', image_url: 'http://example.com/image1.jpg' },
                { id: 2, name: 'Artwork 2', image_url: 'http://example.com/image2.jpg' }
            ];

            pool.query.mockResolvedValueOnce({ rows: mockArtworks });

            const response = await request(app)
                .get('/api/art/carousel')
                .expect(200);

            expect(response.body).toHaveProperty('artworks');
            expect(response.body.artworks).toEqual(mockArtworks);
            expect(response.body.artworks).toHaveLength(2);
        });

        it('should handle database errors', async () => {
            const errorMessage = 'Database connection failed';
            pool.query.mockRejectedValueOnce(new Error(errorMessage));

            const response = await request(app)
                .get('/api/art/carousel')
                .expect(500);

            expect(response.body).toHaveProperty('message', errorMessage);
        });

        it('should return empty array if no artworks found', async () => {
            pool.query.mockResolvedValueOnce({ rows: [] });

            const response = await request(app)
                .get('/api/art/carousel')
                .expect(200);

            expect(response.body).toHaveProperty('artworks');
            expect(response.body.artworks).toEqual([]);
        });
    });
}); 