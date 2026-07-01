// In-memory product storage
let products = [];
let nextId = 1;

function getAllProducts() {
    return products;
}

function getProductById(id) {
    return products.find((p) => p.id === id) || null;
}

function createProduct({ name, price, description }) {
    const product = {
        id: nextId++,
        name,
        price,
        description: description || '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };
    products.push(product);
    return product;
}

function updateProduct(id, { name, price, description }) {
    const index = products.findIndex((p) => p.id === id);
    if (index === -1) return null;

    const existing = products[index];
    products[index] = {
        ...existing,
        name: name !== undefined ? name : existing.name,
        price: price !== undefined ? price : existing.price,
        description: description !== undefined ? description : existing.description,
        updatedAt: new Date().toISOString(),
    };
    return products[index];
}

function deleteProduct(id) {
    const index = products.findIndex((p) => p.id === id);
    if (index === -1) return false;

    products.splice(index, 1);
    return true;
}

// Helper for testing — reset data
function resetProducts() {
    products = [];
    nextId = 1;
}

module.exports = {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    resetProducts,
};
