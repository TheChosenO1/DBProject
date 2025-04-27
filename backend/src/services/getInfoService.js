const pool = require("../db/pool");
const { get } = require("../routes/auth");

async function getUserById(userid) {
    const { rows } = await pool.query(
        `SELECT userid, first_name, last_name, email 
        FROM public.users
        WHERE userid = $1`,
        [userid]
    );
    return rows[0] || null;
}


async function getReviews(userid){
    const {rows} = await pool.query (
        `SELECT r.reviewid as id, r.rating, r.review_text, r.timestamp, a.artworkid, a.name as artwork_name, a.image_url as artwork_image
        FROM public.Reviews r
        JOIN public.Artworks a ON r.artworkid = a.artworkid
        WHERE r.userid = $1
        ORDER BY r.timestamp DESC`,[userid]
    );
    return rows || null;
}

async function getNotes(userid){
    const {rows} = await pool.query (
        `SELECT n.noteid as id, n.note_text, n.timestamp,a.artworkid, a.name as artwork_name, a.image_url as artwork_image
        FROM public.personal_notes as n
        JOIN public.Artworks a ON n.artworkid = a.artworkid
        WHERE n.userid = $1
        ORDER BY n.timestamp DESC`,[userid]
    );
    return rows || null;
}

async function getArtSeen(userid){
    const {rows} = await pool.query (
        `SELECT s.seenid as id, s.timestamp, a.artworkid,  a.name as artwork_name, a.image_url as artwork_image
        FROM public.artwork_seen as s, public.artworks as a
        WHERE s.artworkid = a.artworkid
        AND s.userid = $1
        ORDER BY s.timestamp DESC`,[userid]
    );
    return rows || null;
}

async function getFavs(userid){
    const {rows} = await pool.query (
        `SELECT f.favid as id, a.artworkid, a.name as artwork_name, a.image_url as artwork_image
        FROM public.favorites as f, public.artworks as a
        WHERE f.artworkid = a.artworkid
        AND f.userid = $1
        ORDER BY RANDOM()`,[userid]
    );
    return rows || null;
}

module.exports = {
    getUserById,
    getReviews, 
    getNotes,
    getArtSeen,
    getFavs
};

