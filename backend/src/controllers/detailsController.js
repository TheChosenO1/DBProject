const {getArtworkDetails, getArtistByArtwork, getMuseumByArtwork, getAllReviews, getUserReviewForArtwork, 
    getUserNotesForArtwork, hasUserSeenArtwork, getUserFavsForArtwork, getPopularityForArtwork} = 
    require('../services/detailsService.js');
const { logger } = require('../utils/logger');


async function getFullArtwork(req, res){
    try{
        const artworkid = parseInt(req.body.artworkid, 10);
        const userid = parseInt(req.user.id, 10);

        const art = await getArtworkDetails(artworkid);
        if (!art) {
            return res.status(404).json({ message: 'Artwork not found' });
        }
        const [artist, museum, reviews, userReview, userNotes, hasSeen, hasFav, stats] = await Promise.all([
            getArtistByArtwork(art.artistid),
            getMuseumByArtwork(art.museumid),
            getAllReviews(artworkid),
            getUserReviewForArtwork(artworkid, userid),
            getUserNotesForArtwork(artworkid, userid),
            hasUserSeenArtwork(artworkid, userid),
            getUserFavsForArtwork(artworkid, userid),
            getPopularityForArtwork(artworkid)
        ]);
        res.json({...art, artist, museum, reviews, userReview, userNotes, hasSeen, hasFav, stats});
    } catch (err) {
        logger.error(`Upload Art Seen Error: ${err.message}`);
    res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports = {
    getFullArtwork,
};