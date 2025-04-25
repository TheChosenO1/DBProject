//get a carousel of artwork on the home page

const pool = require("../db/pool")

exports.carousel = async(req, res,) => {
    try{
        const { rows } = await pool.query(`
            SELECT artworkid as id, name, image_url
            FROM public.artworks
            WHERE image_url IS NOT NULL
            ORDER BY RANDOM()
            LIMIT 10;
            `);
        res.json({artworks: rows});
    } catch (err){
        console.error(err);
        res.status(500).json({message:err.message});
    }
};