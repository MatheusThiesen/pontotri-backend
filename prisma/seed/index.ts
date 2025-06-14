import { seedCalendarDays } from "./calendar-days.seed";
import "./company-test.seed";

async function main() {
  console.log("🔁 Iniciando seed completo...");

  await seedCalendarDays();

  console.log("✅ Seed finalizado com sucesso!");
}

main().catch((error) => {
  console.error("❌ Erro durante o seed:", error);
  process.exit(1);
});
