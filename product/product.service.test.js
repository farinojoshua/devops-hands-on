const productService = require('./product.service');
const { resetProducts } = require('./product.model');

beforeEach(() => {
    resetProducts();
});

describe('ProductService', () => {
    describe('create', () => {
        it('should create a product with valid data', () => {
            const result = productService.create({ name: 'Laptop', price: 15000000, description: 'Gaming laptop' });
            expect(result).toHaveProperty('id', 1);
            expect(result).toHaveProperty('name', 'Laptop');
            expect(result).toHaveProperty('price', 15000000);
            expect(result).toHaveProperty('description', 'Gaming laptop');
            expect(result).toHaveProperty('createdAt');
        });

        it('should return error when name is missing', () => {
            const result = productService.create({ price: 5000 });
            expect(result).toEqual({ error: 'Name and price are required' });
        });

        it('should return error when price is missing', () => {
            const result = productService.create({ name: 'Mouse' });
            expect(result).toEqual({ error: 'Name and price are required' });
        });

        it('should return error when price is negative', () => {
            const result = productService.create({ name: 'Mouse', price: -100 });
            expect(result).toEqual({ error: 'Price must be a non-negative number' });
        });
    });

    describe('getAll', () => {
        it('should return empty array when no products', () => {
            expect(productService.getAll()).toEqual([]);
        });

        it('should return all products', () => {
            productService.create({ name: 'A', price: 100 });
            productService.create({ name: 'B', price: 200 });
            expect(productService.getAll()).toHaveLength(2);
        });
    });

    describe('getById', () => {
        it('should return product by id', () => {
            productService.create({ name: 'Keyboard', price: 500000 });
            const result = productService.getById(1);
            expect(result).toHaveProperty('name', 'Keyboard');
        });

        it('should return null for non-existent id', () => {
            expect(productService.getById(999)).toBeNull();
        });
    });

    describe('update', () => {
        it('should update existing product', () => {
            productService.create({ name: 'Mouse', price: 100000 });
            const result = productService.update(1, { name: 'Gaming Mouse', price: 250000 });
            expect(result).toHaveProperty('name', 'Gaming Mouse');
            expect(result).toHaveProperty('price', 250000);
            expect(result).toHaveProperty('updatedAt');
        });

        it('should return error for non-existent product', () => {
            const result = productService.update(999, { name: 'Ghost' });
            expect(result).toEqual({ error: 'Product not found' });
        });

        it('should return error for invalid price', () => {
            productService.create({ name: 'Mouse', price: 100000 });
            const result = productService.update(1, { price: -50 });
            expect(result).toEqual({ error: 'Price must be a non-negative number' });
        });
    });

    describe('delete', () => {
        it('should delete existing product', () => {
            productService.create({ name: 'Monitor', price: 3000000 });
            const result = productService.delete(1);
            expect(result).toEqual({ message: 'Product deleted successfully' });
            expect(productService.getAll()).toHaveLength(0);
        });

        it('should return error for non-existent product', () => {
            const result = productService.delete(999);
            expect(result).toEqual({ error: 'Product not found' });
        });
    });
});
