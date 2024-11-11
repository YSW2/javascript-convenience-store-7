import { DiscountService } from '../../src/service/DiscountService.js';

describe('DiscountService', () => {
  let discountService;

  beforeEach(() => {
    discountService = new DiscountService();
  });

  test('멤버십 할인 계산 - 최대 한도 이하', () => {
    const result = discountService.calculateDiscounts(20000, 2000, true);

    // 20000 - 2000 = 18000의 30% = 5400원 할인
    expect(result.membershipDiscount).toBe(5400);
    expect(result.finalPrice).toBe(12600); // 20000 - 2000 - 5400
  });

  test('멤버십 할인 계산 - 최대 한도 초과', () => {
    const result = discountService.calculateDiscounts(50000, 5000, true);

    // 50000 - 5000 = 45000의 30% = 13500원이지만 최대 8000원으로 제한
    expect(result.membershipDiscount).toBe(8000);
    expect(result.finalPrice).toBe(37000); // 50000 - 5000 - 8000
  });

  test('멤버십 미사용 시 할인 계산', () => {
    const result = discountService.calculateDiscounts(20000, 2000, false);

    expect(result.membershipDiscount).toBe(0);
    expect(result.finalPrice).toBe(18000); // 20000 - 2000
  });

  test('멤버십 할인 혜택 여부 확인', () => {
    // 혜택이 있는 경우
    expect(discountService.isMembershipBeneficial(20000, 2000)).toBeTruthy();

    // 할인 금액이 0원인 경우
    expect(discountService.isMembershipBeneficial(1000, 1000)).toBeFalsy();
  });

  test('최종 금액이 음수가 되지 않도록 보장', () => {
    const result = discountService.calculateDiscounts(3000, 2000, true);

    // 3000 - 2000 = 1000의 30% = 300원 할인
    expect(result.finalPrice).toBe(700);
    expect(result.finalPrice).toBeGreaterThanOrEqual(0);
  });
});
