const { ProductService } = require('../../service/ProductService');
const { jest } = require('@jest/globals');

describe('ProductService', () => {
  let productService;

  beforeEach(() => {
    productService = new ProductService();
    // Mock FileReader
    jest.spyOn(productService, 'loadProducts').mockImplementation(async () => {
      productService.products.set('콜라', {
        name: '콜라',
        price: 1000,
        stock: 10,
        promotionStock: 5,
        promotionName: '탄산2+1',
      });
      productService.products.set('에너지바', {
        name: '에너지바',
        price: 2000,
        stock: 5,
        promotionStock: 0,
        promotionName: null,
      });
    });
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

  test('잘못된 구매 입력 형식 검증', () => {
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

  test('프로모션 제안 확인', async () => {
    await productService.initialize();
    productService.addToCart('[콜라-4]');

    const suggestions = productService.getAvailablePromotionSuggestions();
    expect(suggestions).toHaveLength(1);
    expect(suggestions[0].productName).toBe('콜라');
    expect(suggestions[0].quantity).toBe(2);
  });
});
