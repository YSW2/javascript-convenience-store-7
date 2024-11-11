import { Cart } from '../domain/Cart.js';
import { FileReader } from '../utils/FileReader.js';
import { Product } from '../domain/Product.js';
import { Promotion } from '../domain/Promotion.js';

export class ProductService {
  constructor() {
    this.products = [];
    this.promotions = new Map();
    this.cart = new Cart();
  }

  async initialize() {
    await this.loadProducts();
    await this.loadPromotions();
  }

  async loadProducts() {
    const productData = await FileReader.readProducts('./public/products.md');
    this.products = productData.map(
      (data) =>
        new Product(data.name, data.price, data.stock, 0, data.promotion)
    );
  }

  async loadPromotions() {
    const promotionData = await FileReader.readPromotions(
      './public/promotions.md'
    );
    promotionData.forEach((data) => {
      const promotion = new Promotion(
        data.name,
        data.type,
        data.startDate,
        data.endDate
      );
      this.promotions.set(data.name, promotion);
    });
  }

  validatePurchaseInput(input) {
    const pattern = /^\[([^\]-]+)-(\d+)\](,\[([^\]-]+)-(\d+)\])*$/;
    if (!pattern.test(input)) {
      throw new Error(
        '[ERROR] 올바르지 않은 형식으로 입력했습니다. 다시 입력해 주세요.'
      );
    }
  }

  parsePurchaseInput(input) {
    const items = input.match(/\[([^\]]+)\]/g);
    return items.map((item) => {
      const [name, quantity] = item.slice(1, -1).split('-');
      const product = this.findProduct(name);

      if (!product) {
        throw new Error(
          '[ERROR] 존재하지 않는 상품입니다. 다시 입력해 주세요.'
        );
      }

      return {
        product,
        quantity: parseInt(quantity),
      };
    });
  }

  findProduct(name) {
    const promotionProduct = this.products.find(
      (p) => p.name === name && p.hasPromotion()
    );
    if (promotionProduct && promotionProduct.hasStock()) {
      return promotionProduct;
    }

    return this.products.find(
      (p) => p.name === name && !p.hasPromotion() && p.hasStock()
    );
  }

  addToCart(purchaseInput) {
    this.validatePurchaseInput(purchaseInput);
    const items = this.parsePurchaseInput(purchaseInput);

    items.forEach(({ product, quantity }) => {
      this.cart.addItem(product, quantity);
    });
  }

  applyPromotions() {
    this.cart.applyPromotions();
  }

  getAvailablePromotionSuggestions() {
    const suggestions = [];
    for (const { product, quantity } of this.cart.getItems()) {
      if (!product.hasPromotion()) continue;

      const promotion = this.promotions.get(product.promotionName);
      if (!promotion?.isActive()) continue;

      const requiredQuantity = product.promotionName.includes('2+1') ? 3 : 2;
      const remainingForPromotion =
        requiredQuantity - (quantity % requiredQuantity);

      if (
        remainingForPromotion < requiredQuantity &&
        product.hasPromotionStock()
      ) {
        suggestions.push({
          productName: product.name,
          quantity: remainingForPromotion,
        });
      }
    }
    return suggestions;
  }

  checkPromotionStockShortage() {
    const shortages = [];
    for (const { product, quantity } of this.cart.getItems()) {
      if (!product.hasPromotion() || !product.hasPromotionStock()) continue;

      const promotionStock = product.promotionStock;
      if (quantity > promotionStock) {
        shortages.push({
          productName: product.name,
          normalQuantity: quantity - promotionStock,
        });
      }
    }
    return shortages;
  }

  getProductList() {
    // 상품명 기준으로 재고를 합산하여 출력
    const productMap = new Map();

    this.products.forEach((product) => {
      const key = `${product.name}-${product.promotionName || 'normal'}`;
      if (!productMap.has(key)) {
        productMap.set(key, {
          name: product.name,
          price: product.price,
          stock: product.stock,
          promotionName: product.promotionName,
        });
      }
    });

    return Array.from(productMap.values());
  }

  getCartSummary() {
    return {
      items: this.cart.getItems(),
      freeItems: this.cart.getFreeItems(),
      totalPrice: this.cart.getTotalPrice(),
      promotionDiscount: this.cart.getPromotionDiscount(),
    };
  }

  clearCart() {
    this.cart.clear();
  }
}
