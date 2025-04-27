const pool = require('../db/pool');

async function searchArtworks(q, sortBy = 'relevance'){
    const term = `${q.trim()}%`;
    const trigramKey = q.trim();
    
    const sql = `
                SELECT 
                    a.artworkid AS id,
                    a.name AS title,
                    a.image_url AS imageUrl, 
                    art.name AS artistName, 
                    m.name AS museumName,
                    p.view_count AS viewCount, 
                    p.favourites_count AS favCount, 
                    p.average_rating AS avgRating, 
                    g.gallery_number AS galleryNumber,
                    GREATEST(
                        similarity(a.name, $2),
                        similarity(art.name, $2),
                        similarity(m.name, $2)
                    ) AS relevance_score
                FROM public.artworks AS a
                JOIN public.artists AS art ON a.artistid = art.artistid
                JOIN public.museum AS m ON a.museumid = m.museumid
                JOIN public.popularity AS p ON a.artworkid = p.artworkid
                JOIN public.gallery AS g ON g.gallery_number = a.gallery_number AND g.museumid = a.museumid
                WHERE (
                    a.name ILIKE $1 OR
                    art.name ILIKE $1 OR
                    m.name ILIKE $1
                ) OR (
                    a.name % $2 OR 
                    art.name % $2 OR 
                    m.name % $2
                )`;
    let orderClause;
    if (sortBy =='popularity'){
        orderClause = `ORDER BY p.view_count DESC`;
    } else{
        orderClause = `ORDER BY relevance_score DESC`;
    }
    const finalSql = `${sql} ${orderClause} LIMIT 50`;
    const { rows } = await pool.query(finalSql, [term, trigramKey]);
    return rows || null;
}

module.exports = {
    searchArtworks,
};
