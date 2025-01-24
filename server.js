const express = require('express');
const path = require('path');
const app = express();
const port = 5000;

// Serve static files from the root directory
app.use(express.static(path.join(__dirname)));

// Main route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Handle 404
app.use((req, res) => {
    res.status(404).send('Not Found');
});

// Enhanced error handling middleware - should be last
app.use((err, req, res, next) => {
    console.error('Server Error:', err.stack);
    res.status(500).send('Something broke!');
});

// Start server with enhanced error handling and detailed logging
const server = app.listen(port, '0.0.0.0', () => {
    console.log(`Server running at http://0.0.0.0:${port}`);
    console.log('Static files served from:', path.join(__dirname));
}).on('error', (err) => {
    console.error('Server failed to start:', err);
    process.exit(1); // Exit on startup failure
});

// Handle process termination
process.on('SIGTERM', () => {
    console.log('SIGTERM received. Shutting down gracefully...');
    server.close(() => {
        console.log('Server closed');
        process.exit(0);
    });
});