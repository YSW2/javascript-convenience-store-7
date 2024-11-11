import { InputView } from '../../src/view/InputView.js';
import { Console } from '@woowacourse/mission-utils';
import { jest } from '@jest/globals';

describe('InputView', () => {
  beforeEach(() => {
    jest.spyOn(Console, 'readLineAsync');
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('구매 상품 입력 읽기', async () => {
    const mockInput = '[콜라-2],[사이다-1]';
    Console.readLineAsync.mockResolvedValue(mockInput);

    const result = await InputView.readPurchaseItems();
    expect(result).toBe(mockInput);
  });

  test('Y/N 응답 검증 - 프로모션 제안', async () => {
    Console.readLineAsync.mockResolvedValueOnce('Y');
    const resultY = await InputView.readPromotionSuggestionResponse();
    expect(resultY).toBe(true);

    Console.readLineAsync.mockResolvedValueOnce('N');
    const resultN = await InputView.readPromotionSuggestionResponse();
    expect(resultN).toBe(false);

    Console.readLineAsync.mockResolvedValueOnce('invalid');
    await expect(InputView.readPromotionSuggestionResponse()).rejects.toThrow(
      '[ERROR]'
    );
  });

  test('멤버십 사용 여부 읽기', async () => {
    Console.readLineAsync.mockResolvedValueOnce('Y');
    const resultY = await InputView.readMembershipUse();
    expect(resultY).toBe(true);

    Console.readLineAsync.mockResolvedValueOnce('N');
    const resultN = await InputView.readMembershipUse();
    expect(resultN).toBe(false);
  });
});
