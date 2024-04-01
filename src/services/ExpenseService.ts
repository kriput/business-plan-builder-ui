import { BaseEntityService } from "./BaseEntityService";
import { Expense } from "../domain/Expense";

export class ExpenseService extends BaseEntityService<Expense> {
  constructor() {
    super("expenses");
  }
}