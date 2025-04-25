require('dotenv').config();
const express = require('express')

const healthRoutes = require('./routes/health');
const homeRoutes = require('./routes/home');

const app = express();
app.use(express.json());

app.use('/api', healthRoutes);
app.use('/api', homeRoutes);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => 
    console.log(`Server listenign on http://localhost:${PORT}`)
);