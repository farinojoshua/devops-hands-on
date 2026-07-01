const http = require('http');
const { handleProductRoutes } = require('./product/product.routes');
const { seedProducts } = require('./product/product.seed');

const PORT = process.env.PORT || 3000;

const server = http.createServer(async (req, res) => {
    if (req.url === '/health') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ status: 'ok', version: '1.0.0' }));
        return;
    }

    // Product CRUD routes
    try {
        const handled = await handleProductRoutes(req, res);
        if (handled) return;
    } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Internal server error' }));
        return;
    }

    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Hello DevOps!');
});

// Seed initial data & start server
seedProducts();
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});