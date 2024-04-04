export enum FinancialOperationSubtype {
  //EXPENSES:

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
  TRANSPORT_COMPENSATION = "Kütus / autokompensatsioon",
  OTHER_TRANSPORT_COSTS = "Muud sõidukiga seotud kulud",

  // IT
  IT = "IT kulud",

  // Other
  OTHER_COSTS = "Muud kulud (vahendustasu, pangateenuste kulu, raamatupidamine jm)",

  // Workforce
  SALARY = "Brutopalk",
  SOCIAL_TAX = "Sotsiaalmaks",
  UNEMPLOYMENT_INSURANCE_TAX = "Töötuskindlustusmaks",
  TRAINING_COSTS = "Koolituskulud",

  // Other taxes
  OTHER_TAXES = "Muud maksud (riigilõivud jms)",



  // INCOMES:
  // Sells
  SALES_INCOME = 'Laekumine müügist arvestades krediiti müüki',
  OTHER_INCOME = 'Muud äritulud (renditulu, intressitulu jm)'
}

export const financialOperationSubtypeMapping: Map<FinancialOperationSubtype, string> = new Map(Object.keys(FinancialOperationSubtype).map(
    (value) => [FinancialOperationSubtype[value as keyof typeof FinancialOperationSubtype], value]
))
