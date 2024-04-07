import { BaseEntity } from "./BaseEntity";
import {ProductPerPeriod} from "./ProductPerPeriod";

export interface Product extends BaseEntity {
  name: string;
  financialForecastId: number | undefined;
  tax: number;
  stockReserveRate: number;
  productsPerPeriod: ProductPerPeriod[]
}