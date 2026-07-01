const model = require('./product.model');

class ProductService {
    getAll() {
        return model.getAllProducts();
    }

    getById(id) {
        return model.getProductById(id);
    }

    create(data) {
        if (!data.name || data.price === undefined) {
            return { error: 'Name and price are required' };
        }
        if (typeof data.price !== 'number' || data.price < 0) {
            return { error: 'Price must be a non-negative number' };
        }
        return model.createProduct(data);
    }

    update(id, data) {
        if (data.price !== undefined && (typeof data.price !== 'number' || data.price < 0)) {
            return { error: 'Price must be a non-negative number' };
        }
        const updated = model.updateProduct(id, data);
        if (!updated) {
            return { error: 'Product not found' };
        }
        return updated;
    }

    delete(id) {
        const deleted = model.deleteProduct(id);
        if (!deleted) {
            return { error: 'Product not found' };
        }
        return { message: 'Product deleted successfully' };
    }
}

module.exports = new ProductService();
