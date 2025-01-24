import database from "infra/database";
import oschestrator from "tests/oschestrator";

beforeAll(async () => {
  await oschestrator.waitForAllServices();
  await database.query("drop schema public cascade; create schema public;");
});

describe("GET /api/v1/migrations", () => {
  describe("Anonymous user", () => {
    test("Retrieving pending migrations", async () => {
      const response = await fetch("http://localhost:3000/api/v1/migrations");
      expect(response.status).toBe(200);

      const responseBody = await response.json();

      expect(Array.isArray(responseBody)).toBe(true);
      expect(responseBody.length).toBeGreaterThan(0);
    });
  });
});

describe("Not allowed methods to /api/v1/migrations", () => {
  describe("Anonymous user", () => {
    test("Running pending migrations", async () => {
      const deleteResponse = await fetch(
        "http://localhost:3000/api/v1/migrations",
        {
          method: "DELETE",
        },
      );
      expect(deleteResponse.status).toBe(405);

      const putResponse = await fetch(
        "http://localhost:3000/api/v1/migrations",
        {
          method: "PUT",
        },
      );
      expect(putResponse.status).toBe(405);

      const patchResponse = await fetch(
        "http://localhost:3000/api/v1/migrations",
        {
          method: "PATCH",
        },
      );
      expect(patchResponse.status).toBe(405);
    });
  });
});
