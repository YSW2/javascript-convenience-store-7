import { ProductService } from './service/ProductService.js';
import { DiscountService } from './service/DiscountService.js';
import { InputView } from './view/InputView.js';
import { OutputView } from './view/OutputView.js';

class App {
  constructor() {
    this.productService = new ProductService();
    this.discountService = new DiscountService();
  }

  async run() {
    await this.initialize();
    await this.startShoppingProcess();
  }

  async initialize() {
    try {
      await this.productService.initialize();
      OutputView.printWelcome();
    } catch (error) {
      OutputView.printError(error.message);
      throw error;
    }
  }

  async startShoppingProcess() {
    try {
      do {
        await this.processOneShopping();
      } while (await this.checkAdditionalPurchase());
    } catch (error) {
      OutputView.printError(error.message);
    }
  }

  async processOneShopping() {
    OutputView.printProducts(this.productService.getProductList());
    await this.processPurchase();
    await this.processPromotions();
    await this.processDiscount();
    this.printReceipt();
  }

  async processPurchase() {
    while (true) {
      try {
        const input = await InputView.readPurchaseItems();
        this.productService.addToCart(input);
        break;
      } catch (error) {
        OutputView.printError(error.message);
      }
    }
  }

  async processPromotions() {
    const suggestions = this.productService.getAvailablePromotionSuggestions();

    for (const suggestion of suggestions) {
      OutputView.printPromotionSuggestion(
        suggestion.productName,
        suggestion.quantity
      );

      if (await InputView.readPromotionSuggestionResponse()) {
        this.productService.addToCart(
          `[${suggestion.productName}-${suggestion.quantity}]`
        );
      }
    }

    const shortages = this.productService.checkPromotionStockShortage();
    for (const shortage of shortages) {
      OutputView.printNormalPriceConfirmation(
        shortage.productName,
        shortage.normalQuantity
      );

      if (!(await InputView.readNormalPriceConfirmation())) {
        // 프로모션 재고만큼만 구매하도록 카트 초기화 후 재시도
        this.productService.clearCart();
        return await this.processPurchase();
      }
    }

    this.productService.applyPromotions();
  }

  async processDiscount() {
    OutputView.printMembershipQuestion();
    const useMembership = await InputView.readMembershipUse();

    const cartSummary = this.productService.getCartSummary();
    this.discountService.calculateDiscounts(
      cartSummary.totalPrice,
      cartSummary.promotionDiscount,
      useMembership
    );
  }

  printReceipt() {
    const cartSummary = this.productService.getCartSummary();
    const discountSummary = this.discountService.getDiscountSummary();
    OutputView.printReceipt(cartSummary, discountSummary);
  }

  async checkAdditionalPurchase() {
    OutputView.printAdditionalPurchaseQuestion();
    return await InputView.readAdditionalPurchase();
  }
}

export default App;
