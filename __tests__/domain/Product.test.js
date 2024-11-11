export class Product {
  constructor(name, price, stock, promotionStock = 0, promotionName = null) {
    this.validateProduct(name, price, stock);

    this.name = name;
    this.price = price;
    this.stock = stock;
    this.promotionName = promotionName;
  }

  validateProduct(name, price, stock) {
    if (!name || typeof name !== 'string') {
      throw new Error('[ERROR] 상품명이 올바르지 않습니다.');
    }
    if (!Number.isInteger(price) || price <= 0) {
      throw new Error('[ERROR] 가격이 올바르지 않습니다.');
    }
    if (!Number.isInteger(stock) || stock < 0) {
      throw new Error('[ERROR] 재고 수량이 올바르지 않습니다.');
    }
  }

  hasStock() {
    return this.stock > 0;
  }

  getTotalStock() {
    return this.stock;
  }

  hasPromotion() {
    return this.promotionName !== null && this.promotionName !== 'null';
  }

  decreaseStock(quantity) {
    if (quantity > this.stock) {
      throw new Error('[ERROR] 재고가 부족합니다.');
    }
    this.stock -= quantity;
    return {
      promotionUsed: this.hasPromotion() ? quantity : 0,
      normalUsed: quantity,
    };
  }
}
