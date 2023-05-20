import { Product, ProductStore } from '../../models/product';

const productStore = new ProductStore();

describe('Product Model', () => {
  const testProduct: Product = {
    name: 'Another New Product',
    price: 99.99,
    category: 'Category',
  };
  let testProductId = 0;

  it('should create product', async () => {
    const createdProduct = await productStore.create(testProduct);
    expect(createdProduct.name).toBe(testProduct.name);
    expect(createdProduct.price).toBe(testProduct.price);
    expect(createdProduct.category).toBe(testProduct.category);
    testProductId = Number(createdProduct.id);
  });

  it('should get all products', async () => {
    const products = await productStore.index();
    expect(products.length).toBeGreaterThan(0);
  });

  it('should get product', async () => {
    const product = await productStore.show(testProductId);
    expect(Number(product.id)).toBe(testProductId);
    expect(product.name).toBe(testProduct.name);
    expect(product.price).toBe(testProduct.price);
    expect(product.category).toBe(testProduct.category);
  });

  it('should delete product', async () => {
    const success = await productStore.delete(testProductId);
    expect(success).toBeTrue();
  });
});
