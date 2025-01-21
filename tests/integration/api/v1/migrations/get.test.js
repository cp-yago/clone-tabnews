import database from "infra/database";

async function cleanDatabase() {
  await database.query("drop schema public cascade; create schema public;");
}

beforeAll(cleanDatabase);

test("GET to /api/v1/migrations should return 200", async () => {
  const response = await fetch("http://localhost:3000/api/v1/migrations");
  expect(response.status).toBe(200);

  const responseBody = await response.json();

  expect(Array.isArray(responseBody)).toBe(true);
  expect(responseBody.length).toBeGreaterThan(0);
});

test("Not allowed methods to /api/v1/migrations should return 405", async () => {
  const deleteResponse = await fetch(
    "http://localhost:3000/api/v1/migrations",
    {
      method: "DELETE",
    },
  );
  expect(deleteResponse.status).toBe(405);

  const putResponse = await fetch("http://localhost:3000/api/v1/migrations", {
    method: "PUT",
  });
  expect(putResponse.status).toBe(405);

  const patchResponse = await fetch("http://localhost:3000/api/v1/migrations", {
    method: "PATCH",
  });
  expect(patchResponse.status).toBe(405);
});
