export class DiscountService {
  static MEMBERSHIP_DISCOUNT_RATE = 0.3; // 30% 할인
  static MEMBERSHIP_MAX_DISCOUNT = 8000; // 최대 8,000원 할인

  constructor() {
    this.totalPrice = 0;
    this.promotionDiscount = 0;
    this.membershipDiscount = 0;
  }

  calculateDiscounts(totalPrice, promotionDiscount, useMembership = false) {
    this.totalPrice = totalPrice;
    this.promotionDiscount = promotionDiscount;
    this.membershipDiscount = this.calculateMembershipDiscount(useMembership);

    return {
      totalPrice: this.totalPrice,
      promotionDiscount: this.promotionDiscount,
      membershipDiscount: this.membershipDiscount,
      finalPrice: this.calculateFinalPrice(),
    };
  }

  calculateMembershipDiscount(useMembership) {
    if (!useMembership) {
      return 0;
    }

    const priceAfterPromotion = this.totalPrice - this.promotionDiscount;
    const calculatedDiscount = Math.floor(
      priceAfterPromotion * DiscountService.MEMBERSHIP_DISCOUNT_RATE
    );

    return Math.min(
      calculatedDiscount,
      DiscountService.MEMBERSHIP_MAX_DISCOUNT
    );
  }

  calculateFinalPrice() {
    return this.totalPrice - this.promotionDiscount - this.membershipDiscount;
  }

  isMembershipBeneficial(totalPrice, promotionDiscount) {
    const potentialDiscount = this.calculateDiscounts(
      totalPrice,
      promotionDiscount,
      true
    ).membershipDiscount;

    return potentialDiscount > 0;
  }

  getDiscountSummary() {
    return {
      totalPrice: this.totalPrice,
      promotionDiscount: this.promotionDiscount,
      membershipDiscount: this.membershipDiscount,
      finalPrice: this.calculateFinalPrice(),
    };
  }
}
