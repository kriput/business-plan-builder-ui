import { BaseEntityService } from "./BaseEntityService";
import { FinancialOperation } from "../domain/FinancialOperation";

export class FinancialOperationService extends BaseEntityService<FinancialOperation> {
  constructor() {
    super("operations");
  }

  async update(data: FinancialOperation, url: string = ""): Promise<FinancialOperation | undefined> {
    try {
      const response = await this.axios.put<FinancialOperation>(url, data);
      if (response.status === 200) {
        console.log('response', response)
        return response.data;
      }
      return undefined;
    } catch (e: any) {
      console.log("error", e);
      throw Error(e.response?.data?.message ?? e.message ?? 'Unknown error');
    }
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

  async getIncomesForForecast(
      id: string,
  ): Promise<FinancialOperation[] | undefined> {
    try {
      const response = await this.axios.get<FinancialOperation[]>(
          `${id}/incomes`,
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

  async deleteOperation(data: FinancialOperation, url: string = ""): Promise<void> {
    try {
      const response = await this.axios.post<FinancialOperation>(url, data);
      if (response.status !== 200) {
        return Promise.reject(response.statusText);
      }
    } catch (e: any) {
      console.log("error", e);
      throw Error(e.response?.data?.message ?? e.message ?? 'Unknown error');
    }
  }
}