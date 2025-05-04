import { Entity } from "@/core/entities/entity";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";

export interface ProductProps {
  description: string;
}

export class Product extends Entity<ProductProps> {
  get description() {
    return this.props.description;
  }

  static create(props: ProductProps, id?: UniqueEntityID) {
    const product = new Product(props, id);

    return product;
  }
}
