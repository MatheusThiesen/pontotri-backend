import { Global, Injectable } from '@nestjs/common';

export interface FieldsProps {
  name: string;
  type: 'string' | 'number';
  exact?: boolean;
  custom?: (search: string) => Record<string, any>;
}

@Global()
@Injectable()
export class OrderByPrisma {
  execute(orderby: string | undefined): Record<string, any> | undefined {
    if (!orderby || orderby.trim().length === 0) {
      return undefined;
    }

    const [field, direction] = orderby.split(/[,|:.]/);

    return {
      [field]: direction || 'asc',
    };
  }
}
