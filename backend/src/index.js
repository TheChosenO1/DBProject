require('dotenv').config();
const express = require('express')

const healthRoutes = require('./routes/health');
const homeRoutes = require('./routes/home');
const authRoutes = require('./routes/auth');

const app = express();
app.use(express.json());

app.use('/api', healthRoutes);
app.use('/api', homeRoutes);
app.use('/api', authRoutes);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => 
    console.log(`Server listening on http://localhost:${PORT}`)
);