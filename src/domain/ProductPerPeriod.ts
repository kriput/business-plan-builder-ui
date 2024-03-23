import {BaseEntity} from "./BaseEntity";

export interface ProductPerPeriod extends BaseEntity {
  quantity: number,
  forExport: number,
  price: number,
  costPerItem: number,
  year: number
}