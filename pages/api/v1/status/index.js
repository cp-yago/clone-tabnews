import database from "infra/database.js";

async function status(request, response) {
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

export default status;
