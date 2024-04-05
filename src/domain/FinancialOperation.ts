import {BaseEntity} from "./BaseEntity";
import {FinancialOperationSubtype} from "../enums/FinancialOperationSubtype";
import {TotalPerPeriod} from "./TotalForPeriod";
import {FinancialOperationType} from "../enums/FinancialOperationType";

export interface FinancialOperation extends BaseEntity {
  type: FinancialOperationType,
  subtype?: FinancialOperationSubtype,
  tax?: number
  totalsPerPeriod: TotalPerPeriod[]
}