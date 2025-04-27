//This is a health check to see whether the server is running. May be useful for future DevOps purposes

const pool = require('../db/pool');

module.exports.healthCheck = async (req, res) => {
    try {
        const { rows } = await pool.query('select now()');
        res.json({ status: 'ok', time: rows[0].now });
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: 'error', message: err.message });
    }
};