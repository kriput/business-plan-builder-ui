import { FinancialOperationCategory } from "@/dto/FinancialOperationCategory";
import { FinancialOperationSubtype } from "@/enums/FinancialOperationSubtype";

export const EXPENSE_CATEGORY_LIST: FinancialOperationCategory[] = [
  {
    name: "Toodete/teenuste valmistamise/osutamisega seotud kulud",
    icon: "🛠",
    acceptedFinancialOperationSubtypes: [
      FinancialOperationSubtype.RAW_MATERIALS,
      FinancialOperationSubtype.OUTSOURCED_SERVICES,
    ],
  },
  {
    name: "Turunduskulud",
    icon: "📢",
    acceptedFinancialOperationSubtypes: [FinancialOperationSubtype.MARKETING],
  },
  {
    name: "Tööruumidega seotud kulud",
    icon: "🏢",
    acceptedFinancialOperationSubtypes: [
      FinancialOperationSubtype.RENT,
      FinancialOperationSubtype.UTILITY,
      FinancialOperationSubtype.OTHER_WORKSPACE_COSTS,
    ],
  },
  {
    name: "Transpordikulud",
    icon: "🚘",
    acceptedFinancialOperationSubtypes: [
      FinancialOperationSubtype.TRANSPORT_COMPENSATION,
      FinancialOperationSubtype.OTHER_TRANSPORT_COSTS,
    ],
  },
  {
    name: "Infotehnoloogiaga seotud kulud",
    icon: "💻",
    acceptedFinancialOperationSubtypes: [FinancialOperationSubtype.IT],
  },
  {
    name: "Muud kulud (vahendustasu, pangateenuste kulu, raamatupidamine jm)",
    icon: "💰",
    acceptedFinancialOperationSubtypes: [FinancialOperationSubtype.OTHER_COSTS],
  },
  {
    name: "Personalikulud",
    icon: "🧍",
    acceptedFinancialOperationSubtypes: [
      FinancialOperationSubtype.SALARY,
      FinancialOperationSubtype.SOCIAL_TAX,
      FinancialOperationSubtype.UNEMPLOYMENT_INSURANCE_TAX,
      FinancialOperationSubtype.TRAINING_COSTS,
    ],
  },
  {
    name: "Muud maksud (riigilõivud jms)",
    icon: "💸",
    acceptedFinancialOperationSubtypes: [FinancialOperationSubtype.OTHER_TAXES],
  },
];

export const EXPENSE_FROM_LOANS_LIST: FinancialOperationCategory[] = [
  {
    name: "Laenud ja toetused",
    icon: "🏦",
    acceptedFinancialOperationSubtypes: [
      FinancialOperationSubtype.LOAN,
      FinancialOperationSubtype.SUBSIDIES,
      FinancialOperationSubtype.INTEREST,
    ],
  },
];

export const ALL_EXPENSE_CATEGORY_LIST: FinancialOperationCategory[] =
  EXPENSE_CATEGORY_LIST.concat(EXPENSE_FROM_LOANS_LIST);
