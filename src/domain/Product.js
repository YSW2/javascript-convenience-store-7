class Product {
  constructor(name, price, stock, promotionStock = 0, promotionName = null) {
    this.validateProduct(name, price, stock, promotionStock);

    this.name = name;
    this.price = price;
    this.stock = stock;
    this.promotionStock = promotionStock;
    this.promotionName = promotionName;
  }

  validateProduct(name, price, stock, promotionStock) {
    if (!name || typeof name !== 'string') {
      throw new Error('[ERROR] 상품명이 올바르지 않습니다.');
    }
    if (!Number.isInteger(price) || price <= 0) {
      throw new Error('[ERROR] 가격이 올바르지 않습니다.');
    }
    if (!Number.isInteger(stock) || stock < 0) {
      throw new Error('[ERROR] 재고 수량이 올바르지 않습니다.');
    }
    if (!Number.isInteger(promotionStock) || promotionStock < 0) {
      throw new Error('[ERROR] 프로모션 재고 수량이 올바르지 않습니다.');
    }
  }

  hasStock() {
    return this.stock > 0 || this.promotionStock > 0;
  }

  getTotalStock() {
    return this.stock + this.promotionStock;
  }

  hasPromotionStock() {
    return this.promotionStock > 0;
  }

  hasPromotion() {
    return this.promotionName !== null;
  }

  decreaseStock(quantity, usePromotion = false) {
    if (usePromotion && this.promotionStock > 0) {
      return this.decreasePromotionStock(quantity);
    }
    return this.decreaseNormalStock(quantity);
  }

  decreasePromotionStock(quantity) {
    if (quantity > this.promotionStock) {
      const remaining = quantity - this.promotionStock;
      const used = this.promotionStock;
      this.promotionStock = 0;
      return {
        promotionUsed: used,
        normalUsed: this.decreaseNormalStock(remaining),
      };
    }
    this.promotionStock -= quantity;
    return { promotionUsed: quantity, normalUsed: 0 };
  }

  decreaseNormalStock(quantity) {
    if (quantity > this.stock) {
      throw new Error('[ERROR] 재고가 부족합니다.');
    }
    this.stock -= quantity;
    return quantity;
  }
}

export default Product;
