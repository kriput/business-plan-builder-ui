import { BaseEntity } from "./BaseEntity";
import { Product } from "./Product";
import { FinancialOperation } from "./FinancialOperation";

export interface FinancialForecast extends BaseEntity {
  name: string;
  sellingInCreditRate?: number;
  products?: Product[];
  financialOperations?: FinancialOperation[];
}
