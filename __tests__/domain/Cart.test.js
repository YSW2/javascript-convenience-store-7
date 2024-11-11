import { Product } from '../../src/domain/Product';
import { Cart } from '../../src/domain/Cart';

describe('Cart', () => {
  let cart;
  let cola;
  let energyBar;

  beforeEach(() => {
    cart = new Cart();
    cola = new Product('콜라', 1000, 10, 5, '탄산2+1');
    energyBar = new Product('에너지바', 2000, 5);
  });

  test('상품 추가', () => {
    cart.addItem(cola, 3);

    const items = cart.getItems();
    expect(items).toHaveLength(1);
    expect(items[0].product.name).toBe('콜라');
    expect(items[0].quantity).toBe(3);
  });

  test('잘못된 수량으로 상품 추가 시 에러', () => {
    expect(() => cart.addItem(cola, 0)).toThrow('[ERROR]');
    expect(() => cart.addItem(cola, -1)).toThrow('[ERROR]');
  });
});
