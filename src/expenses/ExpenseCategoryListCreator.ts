import { ExpenseCategory } from "../dto/ExpenseCategory";
import { ExpenseType } from "../enums/ExpenseType";

export const EXPENSE_CATEGORY_LIST: ExpenseCategory[] = [
  {
    name: "Toodete/teenuste valmistamise/osutamisega seotud kulud",
    icon: "🛠",
    acceptedExpenseTypes: [
      ExpenseType.RAW_MATERIALS,
      ExpenseType.OUTSOURCED_SERVICES,
    ],
  },
  {
    name: "Turunduskulud",
    icon: "📢",
    acceptedExpenseTypes: [ExpenseType.MARKETING],
  },
  {
    name: "Tööruumidega seotud kulud",
    icon: "🏢",
    acceptedExpenseTypes: [
      ExpenseType.RENT,
      ExpenseType.UTILITY,
      ExpenseType.OTHER_WORKSPACE_COSTS,
    ],
  },
  {
    name: "Transpordikulud",
    icon: "🚘",
    acceptedExpenseTypes: [
      ExpenseType.TRANSPORT_COMPENSATION,
      ExpenseType.OTHER_TRANSPORT_COSTS,
    ],
  },
  {
    name: "Infotehnoloogiaga seotud kulud",
    icon: "💻",
    acceptedExpenseTypes: [ExpenseType.IT],
  },
  {
    name: "Muud kulud (vahendustasu, pangateenuste kulu, raamatupidamine jm)",
    icon: "💰",
    acceptedExpenseTypes: [ExpenseType.OTHER_COSTS],
  },
  {
    name: "Personalikulud",
    icon: "🧍",
    acceptedExpenseTypes: [
      ExpenseType.SALARY,
      ExpenseType.SOCIAL_TAX,
      ExpenseType.UNEMPLOYMENT_INSURANCE_TAX,
      ExpenseType.TRAINING_COSTS,
    ],
  },
  {
    name: "Muud maksud (riigilõivud jms)",
    icon: "💸",
    acceptedExpenseTypes: [ExpenseType.OTHER_TAXES],
  },
];
