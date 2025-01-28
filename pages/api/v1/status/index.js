import { createRouter } from "next-connect";
import database from "infra/database.js";
import { InternalServerError, MethodNotAllowedError } from "infra/errors";

const router = createRouter();

router.get(getHandler);

export default router.handler({
  onNoMatch: onNoMatchHandler,
  onError: onErrorHandler,
});

function onErrorHandler(error, request, response) {
  const publicErrorObject = new InternalServerError({
    cause: error,
  });

  console.log("\n Erro dentro do catch do next-connect");
  console.error(publicErrorObject);

  response.status(500).json(publicErrorObject);
}

function onNoMatchHandler(request, response) {
  const publicErrorObject = new MethodNotAllowedError();
  response.status(publicErrorObject.statusCode).json(publicErrorObject);
}

async function getHandler(request, response) {
  const updatedAt = new Date().toISOString();
  const databaseVersionResult = await database.query("SELECT version();");
  const databaseVersionValue = databaseVersionResult.rows[0].version;
  const versionMatch = databaseVersionValue.match(/PostgreSQL (\d+\.\d+)/)[1];

  const maxConnectionsResult = await database.query(
    "SELECT current_setting('max_connections');",
  );
  const maxConnections = parseInt(maxConnectionsResult.rows[0].current_setting);

  const databaseName = process.env.POSTGRES_DB;
  const activeConnections = await database.query({
    text: "SELECT * FROM pg_stat_activity WHERE datname = $1;",
    values: [databaseName],
  });

  response.status(200).json({
    updated_at: updatedAt,
    dependencies: {
      database: {
        version: versionMatch,
        max_connections: maxConnections,
        opened_connections: activeConnections.rowCount,
      },
    },
  });
}
