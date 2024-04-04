import { BaseEntity } from "./BaseEntity";
import { Product } from "./Product";
import { FinancialOperation } from "./FinancialOperation";

export interface FinancialForecast extends BaseEntity {
  name: string;
  sellingInCreditRate?: number;
  buildingDeprecationRate?: number;
  equipmentDeprecationRate?: number;
  products?: Product[];
  expenses?: FinancialOperation[];
}
