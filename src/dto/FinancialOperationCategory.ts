import { FinancialOperationSubtype } from "../enums/FinancialOperationSubtype";

export interface FinancialOperationCategory {
  name: string;
  icon: string;
  acceptedFinancialOperationSubtypes: FinancialOperationSubtype[];
}
