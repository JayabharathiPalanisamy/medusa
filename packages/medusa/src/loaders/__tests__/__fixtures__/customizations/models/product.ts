import { Column, Entity } from "typeorm"
import {
  // alias the core entity to not cause a naming conflict
  Product as MedusaProduct,
} from "../../../../../models"

@Entity()
export class Product extends MedusaProduct {
  @Column()
  custom_attribute: string = "test"
}
