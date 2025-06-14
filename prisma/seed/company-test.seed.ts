import {
  BreakType,
  Prisma,
  PrismaClient,
  Role,
  TimeRecordType,
  Weekday,
} from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Criar empresa
  const company = await prisma.company.create({
    data: {
      name: "Empresa Teste LTDA",
      cnpj: "12345678000199",
    },
  });

  // Criar departamentos
  const departments = await Promise.all([
    prisma.department.create({
      data: {
        name: "Desenvolvimento",
        companyId: company.id,
      },
    }),
    prisma.department.create({
      data: {
        name: "Recursos Humanos",
        companyId: company.id,
      },
    }),
  ]);

  // Criar localizações
  const locations = await Promise.all([
    prisma.location.create({
      data: {
        description: "Matriz",
        latitude: -23.55052,
        longitude: -46.633308,
        companyId: company.id,
      },
    }),
    prisma.location.create({
      data: {
        description: "Filial",
        latitude: -23.55792,
        longitude: -46.639818,
        companyId: company.id,
      },
    }),
  ]);

  // Criar horário de trabalho padrão
  const workSchedule = await prisma.workSchedule.create({
    data: {
      name: "Horário Padrão",
      companyId: company.id,
      days: {
        create: [
          {
            weekday: Weekday.MONDAY,
            startTime: "09:00",
            endTime: "18:00",
            totalWorkMinutes: 540,
            breakType: BreakType.FIXED,
            breakStartWindow: "12:00",
            breakEndWindow: "13:00",
            breakDuration: 60,
          },
          {
            weekday: Weekday.TUESDAY,
            startTime: "09:00",
            endTime: "18:00",
            totalWorkMinutes: 540,
            breakType: BreakType.FIXED,
            breakStartWindow: "12:00",
            breakEndWindow: "13:00",
            breakDuration: 60,
          },
          {
            weekday: Weekday.WEDNESDAY,
            startTime: "09:00",
            endTime: "18:00",
            totalWorkMinutes: 540,
            breakType: BreakType.FIXED,
            breakStartWindow: "12:00",
            breakEndWindow: "13:00",
            breakDuration: 60,
          },
          {
            weekday: Weekday.THURSDAY,
            startTime: "09:00",
            endTime: "18:00",
            totalWorkMinutes: 540,
            breakType: BreakType.FIXED,
            breakStartWindow: "12:00",
            breakEndWindow: "13:00",
            breakDuration: 60,
          },
          {
            weekday: Weekday.FRIDAY,
            startTime: "09:00",
            endTime: "18:00",
            totalWorkMinutes: 540,
            breakType: BreakType.FIXED,
            breakStartWindow: "12:00",
            breakEndWindow: "13:00",
            breakDuration: 60,
          },
        ],
      },
    },
  });

  // Criar usuários
  const users = await Promise.all([
    prisma.user.create({
      data: {
        name: "Admin Teste",
        email: "admin@teste.com",
        password: await hash("123456", 8),
        role: Role.ADMIN,
        companyId: company.id,
        departmentId: departments[0].id,
        workScheduleId: workSchedule.id,
      },
    }),
    prisma.user.create({
      data: {
        name: "Gerente Teste",
        email: "gerente@teste.com",
        password: await hash("123456", 8),
        role: Role.MANAGER,
        companyId: company.id,
        departmentId: departments[0].id,
        workScheduleId: workSchedule.id,
      },
    }),
    prisma.user.create({
      data: {
        name: "Colaborador 1",
        email: "colab1@teste.com",
        password: await hash("123456", 8),
        role: Role.EMPLOYEE,
        companyId: company.id,
        departmentId: departments[0].id,
        workScheduleId: workSchedule.id,
      },
    }),
    prisma.user.create({
      data: {
        name: "Colaborador 2",
        email: "colab2@teste.com",
        password: await hash("123456", 8),
        role: Role.EMPLOYEE,
        companyId: company.id,
        departmentId: departments[0].id,
        workScheduleId: workSchedule.id,
      },
    }),
    prisma.user.create({
      data: {
        name: "Colaborador RH",
        email: "rh@teste.com",
        password: await hash("123456", 8),
        role: Role.EMPLOYEE,
        companyId: company.id,
        departmentId: departments[1].id,
        workScheduleId: workSchedule.id,
      },
    }),
  ]);

  // Criar registros de ponto para o último mês e meio
  const today = new Date();
  const startDate = new Date(today);
  startDate.setMonth(today.getMonth() - 1);
  startDate.setDate(1);

  const timeRecords: Prisma.TimeRecordCreateManyInput[] = [];

  for (let user of users) {
    let currentDate = new Date(startDate);

    while (currentDate <= today) {
      // Pula finais de semana
      if (currentDate.getDay() !== 0 && currentDate.getDay() !== 6) {
        // Entrada
        timeRecords.push({
          type: TimeRecordType.ENTRY,
          userId: user.id,
          companyId: company.id,
          locationId: locations[0].id,
          workScheduleId: workSchedule.id,
          createdAt: new Date(currentDate.setHours(9, 0, 0, 0)),
        });

        // Início do intervalo
        timeRecords.push({
          type: TimeRecordType.BREAK_START,
          userId: user.id,
          companyId: company.id,
          locationId: locations[0].id,
          workScheduleId: workSchedule.id,
          createdAt: new Date(currentDate.setHours(12, 0, 0, 0)),
        });

        // Fim do intervalo
        timeRecords.push({
          type: TimeRecordType.BREAK_END,
          userId: user.id,
          companyId: company.id,
          locationId: locations[0].id,
          workScheduleId: workSchedule.id,
          createdAt: new Date(currentDate.setHours(13, 0, 0, 0)),
        });

        // Saída
        timeRecords.push({
          type: TimeRecordType.EXIT,
          userId: user.id,
          companyId: company.id,
          locationId: locations[0].id,
          workScheduleId: workSchedule.id,
          createdAt: new Date(currentDate.setHours(18, 0, 0, 0)),
        });
      }

      currentDate.setDate(currentDate.getDate() + 1);
    }
  }

  await prisma.timeRecord.createMany({
    data: timeRecords,
  });

  console.log("Seed concluído com sucesso!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
