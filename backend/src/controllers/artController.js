//get a carousel of artwork for the art gallery

const pool = require("../db/pool")

exports.carousel = async(req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        const { rows } = await pool.query(`
            SELECT artworkid as id, name, image_url
            FROM public.artworks
            WHERE image_url IS NOT NULL
            ORDER BY RANDOM()
            LIMIT $1 OFFSET $2;
            `, [limit, offset]);

        // Get total count for pagination
        const { rows: countRows } = await pool.query(`
            SELECT COUNT(*) 
            FROM public.artworks 
            WHERE image_url IS NOT NULL
        `);
        
        const totalCount = parseInt(countRows[0].count);
        const hasMore = (page * limit) < totalCount;

        res.json({
            artworks: rows,
            hasMore,
            currentPage: page,
            totalCount
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({message: err.message});
    }
};