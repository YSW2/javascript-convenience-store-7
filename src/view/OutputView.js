import { Console } from '@woowacourse/mission-utils';

class OutputView {
  static printWelcome() {
    Console.print('안녕하세요. W편의점입니다.');
  }

  static printProducts(products) {
    Console.print('\n현재 보유하고 있는 상품입니다.\n');
    products.forEach((product) => {
      const stockInfo =
        product.stock === 0 ? '재고 없음' : `${product.stock}개`;
      const promotionInfo = product.promotionName
        ? ` ${product.promotionName}`
        : '';

      Console.print(
        `- ${
          product.name
        } ${product.price.toLocaleString()}원 ${stockInfo}${promotionInfo}`
      );
    });
  }

  static printPromotionSuggestion(productName, quantity) {
    Console.print(
      `\n현재 ${productName}은(는) ${quantity}개를 무료로 더 받을 수 있습니다. 추가하시겠습니까? (Y/N)`
    );
  }

  static printNormalPriceConfirmation(productName, quantity) {
    Console.print(
      `\n현재 ${productName} ${quantity}개는 프로모션 할인이 적용되지 않습니다. 그래도 구매하시겠습니까? (Y/N)`
    );
  }

  static printMembershipQuestion() {
    Console.print('\n멤버십 할인을 받으시겠습니까? (Y/N)');
  }

  static printReceipt(cartSummary, discountSummary) {
    this.printReceiptHeader();
    this.printPurchasedItems(cartSummary.items);
    this.printFreeItems(cartSummary.freeItems);
    this.printPriceDetails(discountSummary);
  }

  static printReceiptHeader() {
    Console.print('\n==============W 편의점================');
    Console.print('상품명\t\t수량\t금액');
  }

  static printPurchasedItems(items) {
    items.forEach(({ product, quantity }) => {
      const price = product.price * quantity;
      Console.print(
        `${product.name}\t\t${quantity}\t${price.toLocaleString()}`
      );
    });
  }

  static printFreeItems(freeItems) {
    if (freeItems.length === 0) return;

    Console.print('=============증\t정===============');
    freeItems.forEach(({ product, quantity }) => {
      Console.print(`${product.name}\t\t${quantity}`);
    });
  }

  static printPriceDetails(summary) {
    Console.print('====================================');
    Console.print(`총구매액\t\t\t${summary.totalPrice.toLocaleString()}`);
    Console.print(
      `행사할인\t\t\t-${summary.promotionDiscount.toLocaleString()}`
    );
    Console.print(
      `멤버십할인\t\t\t-${summary.membershipDiscount.toLocaleString()}`
    );
    Console.print(`내실돈\t\t\t${summary.finalPrice.toLocaleString()}`);
  }

  static printAdditionalPurchaseQuestion() {
    Console.print('\n감사합니다. 구매하고 싶은 다른 상품이 있나요? (Y/N)');
  }

  static printError(message) {
    Console.print(message);
  }
}
export default OutputView;
