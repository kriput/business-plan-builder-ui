import { FinancialOperationCategory } from "../../dto/FinancialOperationCategory";
import { FinancialOperationSubtype } from "../../enums/FinancialOperationSubtype";

export const INCOME_CATEGORY_LIST: FinancialOperationCategory[] = [
  {
    name: "Laekumised müügist",
    icon: "🛒",
    acceptedFinancialOperationSubtypes: [
      FinancialOperationSubtype.SALES_INCOME,
      FinancialOperationSubtype.SALES_INCOME_WITH_TAX,
      FinancialOperationSubtype.SALES_INCOME_WITHOUT_TAX,
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

export const INCOME_FROM_LOANS_LIST: FinancialOperationCategory[] = [
  {
    name: "Laenud ja toetused",
    icon: "🏦",
    acceptedFinancialOperationSubtypes: [
        FinancialOperationSubtype.LOAN,
        FinancialOperationSubtype.SUBSIDIES
    ]
  }
]

export const ALL_INCOME_CATEGORY_LIST: FinancialOperationCategory[] = INCOME_CATEGORY_LIST.concat(INCOME_FROM_LOANS_LIST)
