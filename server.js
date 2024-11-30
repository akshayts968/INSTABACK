require('dotenv').config();
const http = require('http');
const app = require('./app2');
const connectDB = require('./config/db');

const server = http.createServer(app);
const PORT = process.env.PORT || 8080;

connectDB().then(() => {
    server.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
});
