import {BaseEntity} from "./BaseEntity";
import {Product} from "./Product";

export interface FinancialForecast extends BaseEntity{
  name: string,
  sellingInCreditRate?: number,
  buildingDeprecationRate?: number,
  equipmentDeprecationRate?: number,
  products?: Product[]
}