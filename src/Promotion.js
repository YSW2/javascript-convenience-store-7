import { DateTimes } from '@woowacourse/mission-utils';

class Promotion {
  constructor(name, type, startDate, endDate) {
    this.validatePromotion(name, type, startDate, endDate);

    this.name = name;
    this.type = type; // '1+1' or '2+1'
    this.startDate = new Date(startDate);
    this.endDate = new Date(endDate);
  }

  validatePromotion(name, type, startDate, endDate) {
    if (!name || typeof name !== 'string') {
      throw new Error('[ERROR] 프로모션명이 올바르지 않습니다.');
    }
    if (!['1+1', '2+1'].includes(type)) {
      throw new Error('[ERROR] 프로모션 타입이 올바르지 않습니다.');
    }
    if (!this.isValidDate(startDate) || !this.isValidDate(endDate)) {
      throw new Error('[ERROR] 프로모션 기간이 올바르지 않습니다.');
    }
  }

  isValidDate(dateString) {
    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date);
  }

  isActive() {
    const now = DateTimes.now();
    return now >= this.startDate && now <= this.endDate;
  }

  calculateFreeItems(quantity) {
    if (!this.isActive()) return 0;

    if (this.type === '1+1') {
      return Math.floor(quantity / 2);
    }
    if (this.type === '2+1') {
      return Math.floor(quantity / 3);
    }
    return 0;
  }
}

export default Promotion;
