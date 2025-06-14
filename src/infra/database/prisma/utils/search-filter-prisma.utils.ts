import { Global, Injectable } from '@nestjs/common';

export interface SearchFieldProps {
  name: string;
  type: 'string' | 'number' | 'int' | 'numberToString';
  exact?: boolean;
  custom?: (search: string) => Record<string, any>;
}

@Global()
@Injectable()
export class SearchFilterPrisma {
  execute(
    search: string | undefined,
    fields: SearchFieldProps[],
  ): Record<string, any> {
    if (!search || search.trim().length === 0 || !Array.isArray(fields)) {
      return {};
    }

    return {
      OR: fields.reduce<Record<string, any>[]>((filters, field) => {
        const { name, type, exact, custom } = field;

        if (custom) {
          const customFilter = custom(search);
          if (customFilter) filters.push(customFilter);
          return filters;
        }

        const fieldPath = name?.split('.') as any[];

        if (type === 'number') {
          const sanitizedValue = search.replace(/[^\d]/g, '');
          const numberValue = Number(sanitizedValue);

          if (!isNaN(numberValue)) {
            filters.push(
              fieldPath.reduceRight(
                (acc, key) => ({ [key]: acc }),
                numberValue,
              ),
            );
          }
          return filters;
        }

        if (type === 'int') {
          const sanitizedValue = search.replace(/[^\d]/g, '');
          const numberValue = Number(sanitizedValue);

          if (!isNaN(numberValue) && numberValue < 2147483647) {
            filters.push(
              fieldPath.reduceRight(
                (acc, key) => ({ [key]: acc }),
                numberValue,
              ),
            );
          }
          return filters;
        }

        if (type === 'numberToString') {
          const sanitizedValue = search.replace(/[^\d]/g, '');
          const numberValue = Number(sanitizedValue);

          if (!isNaN(numberValue)) {
            filters.push(
              fieldPath.reduceRight(
                (acc, key) => ({ [key]: acc }),
                sanitizedValue.toString(),
              ),
            );
          }
          return filters;
        }

        const searchNormalized = search.trim();

        if (exact) {
          filters.push(
            fieldPath.reduceRight(
              (acc, key) => ({ [key]: acc }),
              searchNormalized,
            ),
          );
        } else {
          filters.push(
            fieldPath.reduceRight((acc, key) => ({ [key]: acc }), {
              contains: searchNormalized,
              mode: 'insensitive',
            }),
          );
        }

        return filters;
      }, []),
    };
  }
}
