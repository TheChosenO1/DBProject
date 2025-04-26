const { getUserById, getReviews, getNotes, getArtSeen, getFavs } = require('../profileService');
const pool = require('../../db/pool');
const { logger } = require('../../utils/logger');

// Mock the database pool and logger
jest.mock('../../db/pool');
jest.mock('../../utils/logger');

describe('Profile Service', () => {
    // Clear all mocks before each test
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('getUserById', () => {
        it('should return user data when user exists', async () => {
            const mockUser = {
                userid: 1,
                username: 'testuser',
                email: 'test@example.com',
                first_name: 'Test',
                last_name: 'User',
                created_at: new Date()
            };

            pool.query.mockResolvedValueOnce({ rows: [mockUser] });

            const result = await getUserById(1);
            
            expect(result).toEqual(mockUser);
            expect(pool.query).toHaveBeenCalledWith(
                'SELECT id as userid, username, email, first_name, last_name, created_at FROM users WHERE id = $1',
                [1]
            );
        });

        it('should return undefined when user does not exist', async () => {
            pool.query.mockResolvedValueOnce({ rows: [] });

            const result = await getUserById(999);
            
            expect(result).toBeUndefined();
        });

        it('should throw error when database query fails', async () => {
            const error = new Error('Database error');
            pool.query.mockRejectedValueOnce(error);

            await expect(getUserById(1)).rejects.toThrow('Database error');
            expect(logger.error).toHaveBeenCalledWith('Error in getUserById: Database error');
        });
    });

    describe('getReviews', () => {
        it('should return user reviews', async () => {
            const mockReviews = [
                { id: 1, user_id: 1, content: 'Review 1' },
                { id: 2, user_id: 1, content: 'Review 2' }
            ];

            pool.query.mockResolvedValueOnce({ rows: mockReviews });

            const result = await getReviews(1);
            
            expect(result).toEqual(mockReviews);
            expect(pool.query).toHaveBeenCalledWith(
                'SELECT * FROM reviews WHERE user_id = $1 ORDER BY created_at DESC',
                [1]
            );
        });

        it('should return empty array when no reviews exist', async () => {
            pool.query.mockResolvedValueOnce({ rows: [] });

            const result = await getReviews(1);
            
            expect(result).toEqual([]);
        });
    });

    describe('getNotes', () => {
        it('should return user notes', async () => {
            const mockNotes = [
                { id: 1, user_id: 1, content: 'Note 1' },
                { id: 2, user_id: 1, content: 'Note 2' }
            ];

            pool.query.mockResolvedValueOnce({ rows: mockNotes });

            const result = await getNotes(1);
            
            expect(result).toEqual(mockNotes);
            expect(pool.query).toHaveBeenCalledWith(
                'SELECT * FROM notes WHERE user_id = $1 ORDER BY created_at DESC',
                [1]
            );
        });
    });

    describe('getArtSeen', () => {
        it('should return art seen by user', async () => {
            const mockArtSeen = [
                { id: 1, user_id: 1, artwork_id: 100 },
                { id: 2, user_id: 1, artwork_id: 101 }
            ];

            pool.query.mockResolvedValueOnce({ rows: mockArtSeen });

            const result = await getArtSeen(1);
            
            expect(result).toEqual(mockArtSeen);
            expect(pool.query).toHaveBeenCalledWith(
                'SELECT * FROM art_seen WHERE user_id = $1 ORDER BY seen_date DESC',
                [1]
            );
        });
    });

    describe('getFavs', () => {
        it('should return user favorites', async () => {
            const mockFavs = [
                { id: 1, user_id: 1, artwork_id: 100 },
                { id: 2, user_id: 1, artwork_id: 101 }
            ];

            pool.query.mockResolvedValueOnce({ rows: mockFavs });

            const result = await getFavs(1);
            
            expect(result).toEqual(mockFavs);
            expect(pool.query).toHaveBeenCalledWith(
                'SELECT * FROM favorites WHERE user_id = $1 ORDER BY created_at DESC',
                [1]
            );
        });
    });
}); 