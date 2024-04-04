import { FinancialOperationCategory } from "../../dto/FinancialOperationCategory";
import { FinancialOperationSubtype } from "../../enums/FinancialOperationSubtype";

export const INCOME_CATEGORY_LIST: FinancialOperationCategory[] = [
  {
    name: "Laekumised müügist",
    icon: "🛒",
    acceptedFinancialOperationSubtypes: [
      FinancialOperationSubtype.SALES_INCOME,
    ],
  },
  {
    name: "Muud äritulud (renditulu, intressitulu jm)",
    icon: "💰",
    acceptedFinancialOperationSubtypes: [
      FinancialOperationSubtype.OTHER_INCOME,
    ],
  },
];
