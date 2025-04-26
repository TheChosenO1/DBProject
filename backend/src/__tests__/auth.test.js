const request = require('supertest');
const app = require('../index');
const pool = require('../db/pool');

// Mock the database pool
jest.mock('../db/pool', () => ({
    query: jest.fn()
}));

describe('Auth Endpoints', () => {
    beforeEach(() => {
        // Clear all mocks before each test
        jest.clearAllMocks();
    });

    describe('POST /api/auth/signup', () => {
        it('should return 400 if email or password is missing', async () => {
            const response = await request(app)
                .post('/api/auth/signup')
                .send({ firstName: 'John', lastName: 'Doe' })
                .expect(400);

            expect(response.body).toHaveProperty('message', 'Email & Password Required');
        });

        it('should return 400 if user already exists', async () => {
            pool.query.mockResolvedValueOnce({ rowCount: 1 });

            const response = await request(app)
                .post('/api/auth/signup')
                .send({
                    firstName: 'John',
                    lastName: 'Doe',
                    email: 'existing@example.com',
                    password: 'password123'
                })
                .expect(400);

            expect(response.body).toHaveProperty('message', 'User already exists');
        });

        it('should create a new user and return token', async () => {
            const mockUser = {
                userid: 1,
                first_name: 'John',
                last_name: 'Doe',
                email: 'new@example.com'
            };

            pool.query
                .mockResolvedValueOnce({ rowCount: 0 }) // First query for existing user
                .mockResolvedValueOnce({ rows: [mockUser] }); // Second query for insert

            const response = await request(app)
                .post('/api/auth/signup')
                .send({
                    firstName: 'John',
                    lastName: 'Doe',
                    email: 'new@example.com',
                    password: 'password123'
                })
                .expect(201);

            expect(response.body).toHaveProperty('token');
            expect(response.body).toHaveProperty('user');
            expect(response.body.user).toEqual(mockUser);
        });
    });

    describe('POST /api/auth/login', () => {
        it('should return 400 if email or password is missing', async () => {
            const response = await request(app)
                .post('/api/auth/login')
                .send({ email: 'test@example.com' })
                .expect(400);

            expect(response.body).toHaveProperty('message', 'Email & Password Required');
        });

        it('should return 401 for invalid credentials', async () => {
            pool.query.mockResolvedValueOnce({ rows: [] });

            const response = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'nonexistent@example.com',
                    password: 'wrongpassword'
                })
                .expect(401);

            expect(response.body).toHaveProperty('message', 'Invalid Credentials');
        });

        it('should return token for valid credentials', async () => {
            const mockUser = {
                userid: 1,
                first_name: 'John',
                last_name: 'Doe',
                password: 'hashedpassword'
            };

            pool.query.mockResolvedValueOnce({ rows: [mockUser] });

            const response = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'test@example.com',
                    password: 'password123'
                })
                .expect(200);

            expect(response.body).toHaveProperty('token');
            expect(response.body).toHaveProperty('user');
            expect(response.body.user).not.toHaveProperty('password');
        });
    });
}); 