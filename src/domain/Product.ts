import { BaseEntity } from "./BaseEntity";
import { Unit } from "../enums/Unit";
import {ProductPerPeriod} from "./ProductPerPeriod";

export interface Product extends BaseEntity {
  name: string;
  financialForecastId: number | undefined;
  tax: number;
  stockReserveRate: number;
  unit: Unit | null;
  productsPerPeriod: ProductPerPeriod[]
}