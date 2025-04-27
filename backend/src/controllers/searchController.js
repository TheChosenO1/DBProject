const { searchArtworks } = require('../services/searchService');
const { logger } = require('../utils/logger');

async function getSearchResults(req, res) {
    const { q, sortBy } = req.query;
    if (!q || !q.trim()){
        return res.status(400).json({ error: 'Query parameter "q" is required' });
    }

    try {
        const results = await searchArtworks(q, sortBy);
        res.json(results); ;
    } catch (err) {
        logger.err('Error fetching search results:', err);
        res.status(500).json({ err: 'Internal server error' });
    }
}

module.exports = {
    getSearchResults,
};

