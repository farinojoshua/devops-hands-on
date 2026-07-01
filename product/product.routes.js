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
 * Standard response helpers
 * All responses follow: { success, message, data }
 */
function sendSuccess(res, statusCode, message, data = null) {
    res.writeHead(statusCode, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ success: true, message, data }));
}

function sendError(res, statusCode, message) {
    res.writeHead(statusCode, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ success: false, message, data: null }));
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
        sendSuccess(res, 200, 'Products retrieved successfully', products);
        return true;
    }

    // POST /products — create
    if (url === '/products' && req.method === 'POST') {
        try {
            const data = await parseBody(req);
            const result = productService.create(data);
            if (result.error) {
                sendError(res, 400, result.error);
            } else {
                sendSuccess(res, 201, 'Product created successfully', result);
            }
        } catch {
            sendError(res, 400, 'Invalid JSON body');
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
            sendError(res, 404, 'Product not found');
        } else {
            sendSuccess(res, 200, 'Product retrieved successfully', product);
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
                sendError(res, status, result.error);
            } else {
                sendSuccess(res, 200, 'Product updated successfully', result);
            }
        } catch {
            sendError(res, 400, 'Invalid JSON body');
        }
        return true;
    }

    // DELETE /products/:id — delete
    if (req.method === 'DELETE') {
        const result = productService.delete(id);
        if (result.error) {
            sendError(res, 404, result.error);
        } else {
            sendSuccess(res, 200, 'Product deleted successfully');
        }
        return true;
    }

    return false;
}

module.exports = { handleProductRoutes };

