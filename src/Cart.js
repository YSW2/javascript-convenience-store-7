class Cart {
  constructor() {
    this.items = new Map(); // Map<상품명, {product: Product, quantity: number}>
    this.freeItems = new Map(); // Map<상품명, number>
  }

  addItem(product, quantity) {
    this.validateQuantity(quantity);
    this.validateStock(product, quantity);

    const currentQuantity = this.items.get(product.name)?.quantity || 0;
    this.items.set(product.name, {
      product,
      quantity: currentQuantity + quantity,
    });
  }

  validateQuantity(quantity) {
    if (!Number.isInteger(quantity) || quantity <= 0) {
      throw new Error('[ERROR] 수량은 1 이상의 정수여야 합니다.');
    }
  }

  validateStock(product, quantity) {
    if (quantity > product.getTotalStock()) {
      throw new Error('[ERROR] 재고가 부족합니다.');
    }
  }

  applyPromotions() {
    for (const [name, item] of this.items) {
      const { product, quantity } = item;

      if (!product.hasPromotion() || !product.hasPromotionStock()) continue;

      const stockResult = product.decreaseStock(quantity, true);
      if (stockResult.promotionUsed > 0) {
        const promotion = product.promotionName.includes('2+1') ? '2+1' : '1+1';
        const freeQuantity = this.calculateFreeQuantity(
          stockResult.promotionUsed,
          promotion
        );

        if (freeQuantity > 0) {
          this.freeItems.set(
            name,
            (this.freeItems.get(name) || 0) + freeQuantity
          );
        }
      }
    }
  }

  calculateFreeQuantity(quantity, promotionType) {
    if (promotionType === '1+1') {
      return Math.floor(quantity / 2);
    }
    if (promotionType === '2+1') {
      return Math.floor(quantity / 3);
    }
    return 0;
  }

  getTotalPrice() {
    let total = 0;
    for (const { product, quantity } of this.items.values()) {
      total += product.price * quantity;
    }
    return total;
  }

  getPromotionDiscount() {
    let discount = 0;
    for (const [name, freeQuantity] of this.freeItems) {
      const product = this.items.get(name).product;
      discount += product.price * freeQuantity;
    }
    return discount;
  }

  clear() {
    this.items.clear();
    this.freeItems.clear();
  }

  isEmpty() {
    return this.items.size === 0;
  }

  getItems() {
    return Array.from(this.items.values());
  }

  getFreeItems() {
    return Array.from(this.freeItems.entries()).map(([name, quantity]) => ({
      product: this.items.get(name).product,
      quantity,
    }));
  }
}
export default Cart;
