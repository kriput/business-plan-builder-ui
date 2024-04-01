export enum ExpenseType {
  // Production
  RAW_MATERIALS = "Toore ja materjal",
  OUTSOURCED_SERVICES = "Sisseostetud teenused ja/või alltöövõtt",

  // Marketing
  MARKETING = "Turunduskulud",

  // Workspace
  RENT = "Rent",
  UTILITY = "Küte, vesi, elekter, jm. kulud",
  OTHER_WORKSPACE_COSTS = "Muud ruumide ülalpidamisega seotud kulud",

  // Transport
  TRANSPORT_COMPENSATION = "Kütus/autokompensatsioon",
  OTHER_TRANSPORT_COSTS = "Muud sõidukiga seotud kulud",

  // IT
  IT = "Infotehnoloogiaga seotud kulud",

  // Other
  OTHER_COSTS = "Muud kulud (vahendustasu, pangateenuste kulu, raamatupidamine jm)",

  // Workforce
  SALARY = "Brutopalk",
  SOCIAL_TAX = "Sotsiaalmaks",
  UNEMPLOYMENT_INSURANCE_TAX = "Töötuskindlustusmaks",
  TRAINING_COSTS = "Koolituskulud",

  // Other taxes
  OTHER_TAXES = "Muud maksud (riigilõivud jms)",
  VAT = "Käibemaks",
}

export const expenseTypeMapping: Map<ExpenseType, string> = new Map(Object.keys(ExpenseType).map(
    (value) => [ExpenseType[value as keyof typeof ExpenseType], value]
))
