import fs from 'fs/promises';

export class FileReader {
  static async readProducts(filePath) {
    try {
      const content = await fs.readFile(filePath, 'utf8');
      const lines = content.split('\n').filter((line) => line.trim());

      const [header, ...dataLines] = lines;

      return dataLines.map((line) => {
        const [name, price, quantity, promotion] = line
          .split(',')
          .map((item) => item.trim());

        return {
          name,
          price: parseInt(price),
          quantity: parseInt(quantity),
          promotionName: promotion === 'null' || !promotion ? null : promotion,
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

      const [header, ...dataLines] = lines;

      return dataLines.map((line) => {
        const [name, buy, get, startDate, endDate] = line
          .split(',')
          .map((item) => item.trim());

        return {
          name,
          type: `${buy}+${get}`,
          startDate,
          endDate,
        };
      });
    } catch (error) {
      throw new Error('[ERROR] 프로모션 파일을 읽는데 실패했습니다.');
    }
  }
}
