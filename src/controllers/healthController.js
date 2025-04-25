const pool = require('../db/pool');
   
exports.healthCheck = async(req,res) => {
    try{
        const{ rows } = await pool.query('select now()');
        res.json({status: 'ok', time: rows[0].now});
    } catch (err) {
        console.error(err);
        res.status(500).json({status: 'error', message: err.message});
    }
};