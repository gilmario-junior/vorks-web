import orchestrator from '@/src/tests/orchestrator';

export async function setup() {
  await orchestrator.waitForAllServices();
  await orchestrator.dropDatabase();
  await orchestrator.runPendingMigrations();
}
