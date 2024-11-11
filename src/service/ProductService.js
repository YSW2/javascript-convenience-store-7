import path from 'path';
import { Cart } from '../domain/Cart.js';
import { FileReader } from '../utils/FileReader.js';
import { Product } from '../domain/Product.js';
import { Promotion } from '../domain/Promotion.js';

export class ProductService {
  constructor() {
    this.products = new Map(); // Map<상품명, Product>
    this.promotions = new Map(); // Map<프로모션명, Promotion>
    this.cart = new Cart();
  }

  async initialize() {
    await this.loadProducts();
    await this.loadPromotions();
  }

  async loadProducts() {
    const productData = await FileReader.readProducts('./public/products.md');
    productData.forEach((data) => {
      const product = new Product(
        data.name,
        data.price,
        data.stock,
        data.promotionStock,
        data.promotionName
      );
      this.products.set(data.name, product);
    });
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
      if (!this.products.has(name)) {
        throw new Error(
          '[ERROR] 존재하지 않는 상품입니다. 다시 입력해 주세요.'
        );
      }
      return {
        product: this.products.get(name),
        quantity: parseInt(quantity),
      };
    });
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
    return Array.from(this.products.values()).map((product) => ({
      name: product.name,
      price: product.price,
      stock: product.getTotalStock(),
      promotionName: product.promotionName,
    }));
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
