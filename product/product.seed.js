const { createProduct } = require('./product.model');

const seedData = [
    { name: 'Laptop Gaming', price: 15000000, description: 'Laptop gaming dengan RTX 4060' },
    { name: 'Mechanical Keyboard', price: 850000, description: 'Keyboard mechanical RGB switch brown' },
    { name: 'Gaming Mouse', price: 450000, description: 'Mouse gaming 16000 DPI wireless' },
    { name: 'Monitor 27"', price: 3200000, description: 'Monitor IPS 27 inch 144Hz' },
    { name: 'Headset Gaming', price: 600000, description: 'Headset 7.1 surround sound' },
];

function seedProducts() {
    seedData.forEach((product) => createProduct(product));
    console.log(`Seeded ${seedData.length} products`);
}

module.exports = { seedProducts };
