const pool = require('../db/pool');

async function addArtSeen(userId, artworkId) {
    await pool.query(
        `INSERT INTO PUBLIC.artwork_seen (userid, artworkid)
        VALUES ($1, $2) ON CONFLICT (userid, artworkid) DO NOTHING;`,
        [userId, artworkId]
    );
}

async function addReview(userId, artworkId, rating, reviewText){
    const { rows } = await pool.query(
        `INSERT INTO public.reviews (userid, artworkid, rating, review_text)
        VALUES ($1, $2, $3, $4)
        RETURNING reviewid as id, rating, review_text as text, timestamp;`,
        [userId, artworkId, rating, reviewText]
    );
    return rows[0] || null;
}

async function addNote(userId, artworkId, noteText){
    const { rows } = await pool.query(
        `INSERT INTO public.personal_notes (userid, artworkid, note_text)
        VALUES ($1, $2, $3)
        RETURNING noteid as id, note_text as text, timestamp;`,
        [userId, artworkId, noteText]
    );
    return rows[0] || null;
}

async function addFav(userId, artworkId){
    await pool.query(
        `INSERT INTO public.favorites (userid, artworkid)
        VALUES ($1, $2)
        ON CONFLICT(artworkid, userid) DO NOTHING `,
        [userId, artworkId]
    );
}

module.exports = {addArtSeen, addReview, addNote, addFav};  