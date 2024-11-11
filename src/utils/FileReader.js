import fs from 'fs/promises';

export class FileReader {
  static async readProducts(filePath) {
    try {
      const content = await fs.readFile(filePath, 'utf8');
      const lines = content.split('\n').filter((line) => line.trim());

      const [header, ...dataLines] = lines;

      return dataLines.map((line) => {
        const [name, price, quantity, promotion = null] = line
          .split(',')
          .map((item) => item.trim());

        const hasPromotion = promotion !== 'null' && promotion !== null;
        return {
          name,
          price: parseInt(price),
          stock: parseInt(quantity),
          promotionStock: hasPromotion ? parseInt(quantity) : 0, // promotion이 있으면 전체 수량을 프로모션 재고로
          promotionName: hasPromotion ? promotion : null,
        };
      });
    } catch (error) {
      throw new Error('[ERROR] 상품 파일을 읽는데 실패했습니다.');
    }
  }

  static async readPromotions(filePath) {
    try {
      const content = await fs.readFile(filePath, 'utf8');
      const lines = content.split('\n').filter((line) => line.trim());

      return lines.map((line) => {
        const [name, type, startDate, endDate] = line
          .split(',')
          .map((item) => item.trim());
        return { name, type, startDate, endDate };
      });
    } catch (error) {
      throw new Error('[ERROR] 프로모션 파일을 읽는데 실패했습니다.');
    }
  }
}
