import { BaseEntityService } from "./BaseEntityService";
import { FinancialOperation } from "../domain/FinancialOperation";

export class FinancialOperationService extends BaseEntityService<FinancialOperation> {
  constructor() {
    super("operations");
  }

  async getExpensesForForecast(
    id: string,
  ): Promise<FinancialOperation[] | undefined> {
    try {
      const response = await this.axios.get<FinancialOperation[]>(
        `${id}/expenses`,
      );
      if (response.status === 200) {
        console.log(response);
        return response.data;
      }

      return undefined;
    } catch (e: any) {
      throw Error(e.message);
    }
  }
}