import {BaseEntityService} from "./BaseEntityService";
import {FinancialForecast} from "../domain/FinancialForecast";

export class FinancialForecastService extends BaseEntityService<FinancialForecast> {
  constructor() {
    super("forecasts");
  }

  async getTrip(id: string): Promise<FinancialForecast | undefined> {
    try {
      const response = await this.axios.get<FinancialForecast>(
        id,
      );
      if (response.status === 200) {
        console.log(response)
        return response.data;
      }

      return undefined;

    } catch (e: any) {
      throw Error(e.message);
    }
  }

}
