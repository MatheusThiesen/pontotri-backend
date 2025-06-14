import { Global, Injectable } from '@nestjs/common';
import dayjs from 'dayjs';

export interface WhereFieldProps {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'date';
  exact?: boolean;
  custom?: (search: string) => Record<string, any>;
}

@Global()
@Injectable()
export class WhereFilterPrisma {
  execute(
    filters: Record<string, any> | undefined,
    fields: WhereFieldProps[],
  ): Record<string, any> {
    if (!filters || Object.keys(filters).length === 0) return {};

    const andConditions: Record<string, any>[] = [];

    for (const field of fields) {
      const value = filters[field.name];

      if (value === undefined || value === null || value === '') continue;

      if (field.custom) {
        andConditions.push(field.custom(value));
        continue;
      }

      switch (field.type) {
        case 'string':
          andConditions.push({
            [field.name]: field.exact
              ? value
              : { contains: value, mode: 'insensitive' },
          });
          break;

        case 'number':
          const numberValue = Number(value);
          if (!isNaN(numberValue)) {
            andConditions.push({ [field.name]: numberValue });
          }
          break;

        case 'boolean':
          if (value === 'true' || value === true || value > 1) {
            andConditions.push({ [field.name]: true });
          } else if (value === 'false' || value === false) {
            andConditions.push({ [field.name]: false });
          }
          break;
        case 'date': {
          if (typeof value !== 'string') break;

          const betweenMatch = value.match(/(.+)\s+BETWEEN\s+(.+)/i);
          if (betweenMatch) {
            const [_, startStr, endStr] = betweenMatch;
            const start = dayjs(startStr.trim());
            const end = dayjs(endStr.trim());
            if (start.isValid() && end.isValid()) {
              andConditions.push({
                [field.name]: {
                  gte: start.startOf('day').toDate(),
                  lte: end.endOf('day').toDate(),
                },
              });
            }
            break;
          }

          const operatorMatch = value.match(/^(>=|<=|>|<)\s*(.+)$/);
          if (operatorMatch) {
            const [, operator, dateStr] = operatorMatch;
            const date = dayjs(dateStr.trim());
            if (!date.isValid()) break;

            let condition: Record<string, any> = {};
            switch (operator) {
              case '>':
                condition.gt = date.endOf('day').toDate();
                break;
              case '>=':
                condition.gte = date.startOf('day').toDate();
                break;
              case '<':
                condition.lt = date.startOf('day').toDate();
                break;
              case '<=':
                condition.lte = date.endOf('day').toDate();
                break;
            }

            andConditions.push({ [field.name]: condition });
            break;
          }

          const parsed = dayjs(value);
          if (!parsed.isValid()) break;

          if (field.exact) {
            andConditions.push({ [field.name]: parsed.toDate() });
          } else {
            andConditions.push({
              [field.name]: {
                gte: parsed.startOf('day').toDate(),
                lte: parsed.endOf('day').toDate(),
              },
            });
          }

          break;
        }
      }
    }

    return andConditions.length > 0 ? { AND: andConditions } : {};
  }
}
