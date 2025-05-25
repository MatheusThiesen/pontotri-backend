import { Either, left, right } from "@/core/either";
import { Company } from "@/domain/entities/company";
import { User } from "@/domain/entities/user";
import { Injectable } from "@nestjs/common";
import { HashGenerator } from "../cryptography/hash-generator";
import { CompaniesRepository } from "../repositories/companies-repository";
import { UsersRepository } from "../repositories/users-repository";
import { CompanyAlreadyExistsError } from "./errors/company-already-exists-error";
import { UserAlreadyExistsError } from "./errors/user-already-exists-error";

interface RegisterUseCaseRequest {
  name: string;
  company: string;
  cnpj: string;
  email: string;
  password: string;
}

type RegisterUseCaseResponse = Either<
  UserAlreadyExistsError | CompanyAlreadyExistsError,
  {
    user: User;
    company: Company;
  }
>;

@Injectable()
export class RegisterUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private companiesRepository: CompaniesRepository,
    private hashGenerator: HashGenerator
  ) {}

  async execute({
    email,
    name,
    password,
    cnpj,
    company: companyName,
  }: RegisterUseCaseRequest): Promise<RegisterUseCaseResponse> {
    const userWithSameEmail = await this.usersRepository.findByEmail(email);
    if (userWithSameEmail) return left(new UserAlreadyExistsError(email));

    const companyWithSameCnpj = await this.usersRepository.findByEmail(email);
    if (companyWithSameCnpj) return left(new CompanyAlreadyExistsError(cnpj));

    const hashedPassword = await this.hashGenerator.hash(password);

    const company = Company.create({
      cnpj,
      name: companyName,
    });
    await this.companiesRepository.create(company);

    const user = User.create({
      name,
      email,
      password: hashedPassword,
      companyId: company.id.toValue(),
      role: "OWNER",
      isActive: true,
    });
    await this.usersRepository.create(user);

    return right({
      user,
      company,
    });
  }
}
