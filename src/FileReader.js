import fs from 'fs/promises';

class FileReader {
  static async readProducts(filePath) {
    try {
      const content = await fs.readFile(filePath, 'utf8');
      const lines = content.split('\n').filter((line) => line.trim());

      return lines.map((line) => {
        const [name, price, stock, promotionStock = 0, promotionName = null] =
          line.split(',').map((item) => item.trim());
        return {
          name,
          price: parseInt(price),
          stock: parseInt(stock),
          promotionStock: parseInt(promotionStock),
          promotionName,
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
export default FileReader;
