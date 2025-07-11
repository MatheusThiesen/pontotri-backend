import { User } from "@/domain/entities/user";

export abstract class UsersRepository {
  abstract create(user: User): Promise<void>;
  abstract findById(id: string): Promise<User | null>;
  abstract findByEmail(email: string): Promise<User | null>;
  abstract save(user: User): Promise<void>;
  abstract findManyByCompanyId(
    companyId: string,
    page: number,
    pagesize: number
  ): Promise<User[]>;
  abstract countByCompanyId(companyId: string): Promise<number>;
}
