import { ProductService } from '../../src/service/ProductService.js';
import { Product } from '../../src/domain/Product.js';

describe('ProductService', () => {
  let productService;

  beforeEach(() => {
    productService = new ProductService();
    // Mock products array
    productService.products = [
      new Product('콜라', 1000, 10, 5, '탄산2+1'),
      new Product('에너지바', 2000, 5, 0, null),
    ];
  });

  test('상품 구매 입력 파싱', () => {
    const input = '[콜라-3],[에너지바-2]';
    const items = productService.parsePurchaseInput(input);

    expect(items).toHaveLength(2);
    expect(items[0].product.name).toBe('콜라');
    expect(items[0].quantity).toBe(3);
    expect(items[1].product.name).toBe('에너지바');
    expect(items[1].quantity).toBe(2);
  });

  test('잘못된 입력 형식 검증', () => {
    const invalidInputs = ['cola-3', '[cola-3', '[cola:3]', '[cola-a]'];

    invalidInputs.forEach((input) => {
      expect(() => productService.validatePurchaseInput(input)).toThrow(
        '[ERROR]'
      );
    });
  });

  test('존재하지 않는 상품 검증', () => {
    const input = '[사이다-1]';
    expect(() => productService.parsePurchaseInput(input)).toThrow(
      '[ERROR] 존재하지 않는 상품입니다.'
    );
  });
});
