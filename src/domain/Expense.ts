import {BaseEntity} from "./BaseEntity";
import {ExpenseType} from "../enums/ExpenseType";
import {ExpensePerPeriod} from "./ExpensePerPeriod";

export interface Expense extends BaseEntity {
  type?: ExpenseType,
  expensesPerPeriod: ExpensePerPeriod[]
}