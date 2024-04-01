import { ExpenseType } from "../enums/ExpenseType";

export interface ExpenseCategory {
  name: string;
  icon: string;
  acceptedExpenseTypes: ExpenseType[];
}
