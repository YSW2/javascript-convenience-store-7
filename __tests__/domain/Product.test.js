import { Product } from '../../src/domain/Product';

describe('Product', () => {
  test('상품 생성', () => {
    const product = new Product('콜라', 1000, 10, 5, '탄산2+1');

    expect(product.name).toBe('콜라');
    expect(product.price).toBe(1000);
    expect(product.stock).toBe(10);
    expect(product.promotionStock).toBe(5);
    expect(product.promotionName).toBe('탄산2+1');
  });

  test('잘못된 상품 정보로 생성 시 에러', () => {
    expect(() => new Product('', 1000, 10)).toThrow('[ERROR]');
    expect(() => new Product('콜라', -1000, 10)).toThrow('[ERROR]');
    expect(() => new Product('콜라', 1000, -10)).toThrow('[ERROR]');
  });

  test('재고 확인', () => {
    const product = new Product('콜라', 1000, 10, 5);

    expect(product.hasStock()).toBeTruthy();
    expect(product.getTotalStock()).toBe(15);
  });

  test('재고 감소', () => {
    const product = new Product('콜라', 1000, 10, 5);

    const result = product.decreaseStock(3, true);
    expect(result.promotionUsed).toBe(3);
    expect(result.normalUsed).toBe(0);
    expect(product.promotionStock).toBe(2);

    const result2 = product.decreaseStock(4, true);
    expect(result2.promotionUsed).toBe(2);
    expect(result2.normalUsed).toBe(2);
    expect(product.promotionStock).toBe(0);
    expect(product.stock).toBe(8);
  });
});
