export class Cart {
  constructor() {
    this.items = [];
    this.freeItems = [];
  }

  addItem(product, quantity) {
    this.validateQuantity(quantity);

    const existingItem = this.items.find(
      (item) => item.product.name === product.name
    );
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      this.items.push({ product, quantity });
    }
  }

  validateQuantity(quantity) {
    if (!Number.isInteger(quantity) || quantity <= 0) {
      throw new Error('[ERROR] 수량은 1 이상의 정수여야 합니다.');
    }
  }

  applyPromotions(promotions, currentDate) {
    for (const item of this.items) {
      const { product, quantity } = item;

      if (!product.hasPromotion()) continue;

      const promotion = promotions.get(product.promotionName);
      if (!promotion?.isActive(currentDate)) continue;

      const stockResult = product.decreaseStock(quantity, true);
      if (stockResult.promotionUsed > 0) {
        const promotionType = product.promotionName.includes('2+1')
          ? '2+1'
          : '1+1';
        const freeQuantity = this.calculateFreeQuantity(
          stockResult.promotionUsed,
          promotionType
        );

        if (freeQuantity > 0) {
          const existingFreeItem = this.freeItems.find(
            (freeItem) => freeItem.product.name === product.name
          );

          if (existingFreeItem) {
            existingFreeItem.quantity += freeQuantity;
          } else {
            this.freeItems.push({ product, quantity: freeQuantity });
          }
        }
      }
    }
  }

  calculateFreeQuantity(quantity, promotionType) {
    if (promotionType === '1+1') {
      return Math.floor(quantity / 2);
    }
    if (promotionType === '2+1') {
      const groups = Math.floor(quantity / 2);
      return groups;
    }
    return 0;
  }

  getTotalPrice() {
    return this.items.reduce((total, { product, quantity }) => {
      return total + product.price * quantity;
    }, 0);
  }

  getPromotionDiscount() {
    return this.freeItems.reduce((discount, { product, quantity }) => {
      return discount + product.price * quantity;
    }, 0);
  }

  clear() {
    this.items = [];
    this.freeItems = [];
  }

  isEmpty() {
    return this.items.length === 0;
  }

  getItems() {
    return this.items;
  }

  getFreeItems() {
    return this.freeItems;
  }
}
