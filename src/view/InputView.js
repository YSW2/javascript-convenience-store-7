import { Console } from '@woowacourse/mission-utils';

class InputView {
  static async readPurchaseItems() {
    return await Console.readLineAsync(
      '\n구매하실 상품명과 수량을 입력해 주세요. (예: [사이다-2],[감자칩-1])'
    );
  }

  static async readPromotionSuggestionResponse() {
    const response = await Console.readLineAsync('');
    if (!['Y', 'N'].includes(response)) {
      throw new Error('[ERROR] Y 또는 N으로 입력해 주세요.');
    }
    return response === 'Y';
  }

  static async readNormalPriceConfirmation() {
    const response = await Console.readLineAsync('');
    if (!['Y', 'N'].includes(response)) {
      throw new Error('[ERROR] Y 또는 N으로 입력해 주세요.');
    }
    return response === 'Y';
  }

  static async readMembershipUse() {
    const response = await Console.readLineAsync('');
    if (!['Y', 'N'].includes(response)) {
      throw new Error('[ERROR] Y 또는 N으로 입력해 주세요.');
    }
    return response === 'Y';
  }

  static async readAdditionalPurchase() {
    const response = await Console.readLineAsync('');
    if (!['Y', 'N'].includes(response)) {
      throw new Error('[ERROR] Y 또는 N으로 입력해 주세요.');
    }
    return response === 'Y';
  }
}
export default InputView;
