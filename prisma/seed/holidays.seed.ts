import { HolidayScope, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const RECURRING_HOLIDAYS = [
  { day: 1, month: 1, name: "Confraternização Universal" },
  { day: 21, month: 4, name: "Tiradentes" },
  { day: 1, month: 5, name: "Dia do Trabalhador" },
  { day: 7, month: 9, name: "Independência do Brasil" },
  { day: 12, month: 10, name: "Nossa Senhora Aparecida" },
  { day: 2, month: 11, name: "Finados" },
  { day: 15, month: 11, name: "Proclamação da República" },
  { day: 25, month: 12, name: "Natal" },
];

export async function seedHolidays() {
  console.log("📅 Inserindo feriados nacionais recorrentes...");

  for (const holiday of RECURRING_HOLIDAYS) {
    const date = new Date(Date.UTC(2000, holiday.month - 1, holiday.day));

    await prisma.holiday.upsert({
      where: {
        date,
      },
      update: {},
      create: {
        date,
        name: holiday.name,
        scope: HolidayScope.NATIONAL,
        isRecurring: true,
      },
    });
  }

  console.log("✅ Feriados recorrentes inseridos!");
}
