import oschestrator from "tests/oschestrator";

beforeAll(async () => {
  await oschestrator.waitForAllServices();
});

describe("GET /api/v1/status", () => {
  describe("Anonymous user", () => {
    test("Retrieving current system status", async () => {
      const response = await fetch("http://localhost:3000/api/v1/status");
      const responseBody = await response.json();

      expect(response.status).toBe(200);

      const parsedUpdatedAt = new Date(responseBody.updated_at).toISOString();
      expect(responseBody.updated_at).toEqual(parsedUpdatedAt);

      const databaseDepencie = responseBody.dependencies.database;
      expect(databaseDepencie.version).toBeDefined();
      expect(databaseDepencie.version).toMatch(/^\d+\.\d+$/);

      expect(databaseDepencie.max_connections).toBeDefined();
      expect(Number.isInteger(databaseDepencie.max_connections)).toBe(true);

      expect(databaseDepencie.opened_connections).toBeDefined();
      expect(Number.isInteger(databaseDepencie.opened_connections)).toBe(true);
      expect(Number(databaseDepencie.opened_connections) >= 1).toBe(true);
    });
  });
});
