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

//Edit notes
//Helper get the note;


async function updateNoteText(noteid, userId, noteText){
    const { rows } = await pool.query(
        `UPDATE public.personal_notes
        SET note_text = $1
        WHERE noteid = $2 AND userid = $3
        RETURNING noteid as id, note_text as text, timestamp;`, [noteText, noteid, userId]
    );
    return rows[0] || null;
}

async function deleteNote(noteId, userId){
    const result = await pool.query(
        `DELETE FROM public.personal_notes
        WHERE noteid = $1 AND userid = $2
        RETURNING noteid as id;`, [noteId, userId]
    );
    return result.rowCount > 0;
}

async function deleteReview(reviewId, userId){
    const result = await pool.query(
        `DELETE FROM public.reviews
        WHERE reviewid = $1 AND userid = $2
        RETURNING reviewid as id;`, [reviewId, userId]
    );
    return result.rowCount > 0;
}

async function deleteFav(artworkId, userId){
    const result = await pool.query(
        `DELETE FROM public.favorites
        WHERE artworkid = $1 AND userid = $2
        RETURNING favid as id;`, [artworkId, userId]
    );
    return result.rowCount > 0;
}

async function deleteArtSeen(userId, artworkId) {
    const result = await pool.query(
      `DELETE FROM public.artwork_seen
       WHERE userid    = $1
         AND artworkid = $2
         RETURNING seenid as id;`,
      [userId, artworkId]
    );
    return result.rowCount > 0;
  }

module.exports = {addArtSeen, addReview, addNote, addFav, updateNoteText, deleteNote, deleteReview, deleteFav, deleteArtSeen};  