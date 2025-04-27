const  pool  = require('../db/pool');
console.log("pool", pool);

// async function getArtworkDetails(artworkid, userid) {
//     const { rows} = await pool.query(
//         /*Keep track of all fields:
//         artowrks: artworkid, gallery_number, name, date, image_url
//         ARTISTS: name, bio, birthdate, death date 
//         Museum: Name, Location, Hours, Contact
//         Seen: Bool of whether seen
//         Reviews */
//         `SELECT a.artworkid as id, a.gallery_number as gallery_number, a.name as title, a.date as date_created, a.image_url as imageURL,
//         art.name as artist_name, art.bio as artist_bio, art.birthdate as artist_birthdate, art.death_date as artist_deathdate, EXTRACT( YEAR FROM age(art.death_date, CURRENT_DATE), art.birthdate) as artist_age,
//         m.name as meseum_name, m.location as museum_loc, m.hours as museum_Hours, m.contact as museum_contact,
//         EXISTS(select 1 From public.artwork_seen as s where s.artworkid = a.artworkid and s.userid = $2) as hasSeen,
        
//         FROM public.artworks a
//         JOIN public.artists art ON a.artistid = art.artistid
//         JOIN public.museums m ON a.museumid = m.museumid
//         WHERE a.artworkid = $1`, [artworkid, userid]
// }

async function getArtworkDetails(artworkid) {
    const { rows} =  await pool.query(
        `SELECT artworkid as id, gallery_number, name as title, date as date_created, image_url as imageURL, artistid, museumid
        FROM public.artworks
        WHERE artworkid = $1`, [artworkid]
    );
    return rows[0] || null;
}

async function getArtistByArtwork(artistid){
    const { rows} = await pool.query(
        `SELECT art.name as artist_name, art.bio as artist_bio, art.birthdate as artist_birthdate, art.deathdate as artist_deathdate, 
        EXTRACT(YEAR FROM age(COALESCE(deathdate, CURRENT_DATE),birthdate)) AS artist_age
        FROM public.artists as art
        WHERE artistid = $1`, [artistid]
    );
    return rows[0] || null;
}

async function getMuseumByArtwork(museumid){
    const { rows} = await pool.query(
        `SELECT m.name as museum_name, m.location as museum_loc, m.hours as museum_hours, m.contact as museum_contact
        FROM public.museum as m
        WHERE museumid = $1`, [museumid]
    );
    return rows[0] || null;
}
async function getAllReviews(artworkid){
    const { rows} = await pool.query(
        `SELECT r.reviewid as id, r.rating, r.review_text, r.timestamp, u.first_name as user_first_name, u.last_name as user_last_name
        FROM public.Reviews r
        JOIN public.users u ON r.userid = u.userid
        WHERE r.artworkid = $1
        ORDER BY r.timestamp DESC`, [artworkid]
    );
    return rows;
}

async function getUserReviewForArtwork(artworkid, userid){
    const { rows} = await pool.query(
        `SELECT r.reviewid as id, r.rating, r.review_text, r.timestamp
        FROM public.Reviews r
        WHERE r.artworkid = $1 AND r.userid = $2
        LIMIT 1`, [artworkid, userid]
    );
    return rows[0] || null;
}

async function getUserNotesForArtwork(artworkid, userid){
    const { rows} = await pool.query(
        `SELECT n.noteid as id, n.note_text, n.timestamp
        FROM public.personal_notes as n
        WHERE n.artworkid = $1 AND n.userid = $2`, [artworkid, userid]
    );
    return rows[0] || null;
}

async function hasUserSeenArtwork(artworkid, userid){
    const { rows } = await pool.query(
        `SELECT
          CASE WHEN EXISTS(
              SELECT 1
              FROM public.artwork_seen s
              WHERE s.artworkid = $1
                AND s.userid    = $2)
            THEN 1
            ELSE 0
          END AS seen
        `,
        [artworkid, userid]
      );
      return rows[0].seen;
}

async function getUserFavsForArtwork(artworkid, userid){
    const { rows} = await pool.query(
        `SELECT
        CASE WHEN EXISTS(
            SELECT 1
            FROM public.favorites f
            WHERE f.artworkid = $1
              AND f.userid    = $2)
            THEN 1
            ELSE 0
          END AS fav
        `,
        [artworkid, userid]
    );
    return rows[0].fav;
}

async function getPopularityForArtwork(artworkid){
    const { rows } = await pool.query(
        `SELECT view_count as views, favourites_count as favs, average_rating as avgrating
        FROM public.popularity
        WHERE artworkid = $1`, [artworkid]
    );
    return rows[0] || {views: 0, favs: 0, avgrating: 0}; 
}

module.exports = {
    getArtworkDetails,
    getArtistByArtwork,
    getMuseumByArtwork,
    getAllReviews,
    getUserReviewForArtwork,
    getUserNotesForArtwork,
    hasUserSeenArtwork,
    getUserFavsForArtwork,
    getPopularityForArtwork
  };