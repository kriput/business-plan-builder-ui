import { Product } from "../domain/Product";
import { BaseEntityService } from "./BaseEntityService";

export class ProductService extends BaseEntityService<Product> {
  constructor() {
    super("products");
  }
}