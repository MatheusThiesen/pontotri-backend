import { PrismaClient, Weekday } from "@prisma/client";

const prisma = new PrismaClient();

const YEARS_TO_GENERATE = 10;
const weekdays: Weekday[] = [
  "SUNDAY",
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
];

export async function seedCalendarDays() {
  const currentYear = new Date().getFullYear();
  const endYear = currentYear + YEARS_TO_GENERATE - 1;

  console.log(
    `📆 Inserindo dias do calendário de ${currentYear} até ${endYear}...`
  );

  for (let year = currentYear; year <= endYear; year++) {
    const start = new Date(`${year}-01-01`);
    const end = new Date(`${year}-12-31`);

    for (
      let date = new Date(start);
      date <= end;
      date.setDate(date.getDate() + 1)
    ) {
      const dateOnly = new Date(date.toISOString().split("T")[0]);
      const weekday = weekdays[date.getDay()];

      await prisma.calendarDay.upsert({
        where: { date: dateOnly },
        update: {},
        create: {
          date: dateOnly,
          weekday,
        },
      });
    }
  }

  console.log(`✅ Dias do calendário inseridos com sucesso.`);
}
