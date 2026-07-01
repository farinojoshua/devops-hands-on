const productService = require('./product.service');

/**
 * Parse JSON body from incoming request
 */
function parseBody(req) {
    return new Promise((resolve, reject) => {
        let body = '';
        req.on('data', (chunk) => (body += chunk));
        req.on('end', () => {
            try {
                resolve(body ? JSON.parse(body) : {});
            } catch {
                reject(new Error('Invalid JSON'));
            }
        });
    });
}

/**
 * Send JSON response helper
 */
function sendJson(res, statusCode, data) {
    res.writeHead(statusCode, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(data));
}

/**
 * Extract product ID from URL path like /products/123
 */
function extractId(url) {
    const parts = url.split('/').filter(Boolean);
    // expects ["products", "123"]
    return parts.length >= 2 ? parseInt(parts[1], 10) : NaN;
}

/**
 * Handle all /products routes
 * Returns true if the route was handled, false otherwise
 */
async function handleProductRoutes(req, res) {
    const url = req.url.split('?')[0]; // strip query params

    // GET /products — list all
    if (url === '/products' && req.method === 'GET') {
        const products = productService.getAll();
        sendJson(res, 200, products);
        return true;
    }

    // POST /products — create
    if (url === '/products' && req.method === 'POST') {
        try {
            const data = await parseBody(req);
            const result = productService.create(data);
            if (result.error) {
                sendJson(res, 400, result);
            } else {
                sendJson(res, 201, result);
            }
        } catch {
            sendJson(res, 400, { error: 'Invalid JSON body' });
        }
        return true;
    }

    // Routes with /:id
    const idMatch = url.match(/^\/products\/(\d+)$/);
    if (!idMatch) return false;

    const id = parseInt(idMatch[1], 10);

    // GET /products/:id — get by id
    if (req.method === 'GET') {
        const product = productService.getById(id);
        if (!product) {
            sendJson(res, 404, { error: 'Product not found' });
        } else {
            sendJson(res, 200, product);
        }
        return true;
    }

    // PUT /products/:id — update
    if (req.method === 'PUT') {
        try {
            const data = await parseBody(req);
            const result = productService.update(id, data);
            if (result.error) {
                const status = result.error === 'Product not found' ? 404 : 400;
                sendJson(res, status, result);
            } else {
                sendJson(res, 200, result);
            }
        } catch {
            sendJson(res, 400, { error: 'Invalid JSON body' });
        }
        return true;
    }

    // DELETE /products/:id — delete
    if (req.method === 'DELETE') {
        const result = productService.delete(id);
        if (result.error) {
            sendJson(res, 404, result);
        } else {
            sendJson(res, 200, result);
        }
        return true;
    }

    return false;
}

module.exports = { handleProductRoutes };
