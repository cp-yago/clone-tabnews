import useSWR from "swr";

async function fetchAPI(key) {
  const response = await fetch(key);
  const responseBody = await response.json();
  return responseBody;
}

export default function StatusPage() {
  return (
    <>
      <h1>Status</h1>
      <UpdatedAt />
      <DatabaseStatus />
    </>
  );
}

function UpdatedAt() {
  const { data, isLoading } = useSWR("/api/v1/status", fetchAPI, {
    refreshInterval: 2000,
  });

  let updatedAtText = "Carregando...";

  if (!isLoading && data) {
    updatedAtText = new Date(data.updated_at).toLocaleString("pt-BR");
  }

  return <div>Última atualização: {updatedAtText}</div>;
}

function DatabaseStatus() {
  const { data, isLoading } = useSWR("/api/v1/status", fetchAPI, {
    refreshInterval: 2000,
  });

  let loadingText = "Carregando...";
  let maxConnections = loadingText;
  let openedConnections = loadingText;
  let version = loadingText;

  if (!isLoading && data) {
    maxConnections = data.dependencies.database.max_connections;
    openedConnections = data.dependencies.database.opened_connections;
    version = data.dependencies.database.version;
  }

  return (
    <>
      <h1>Database</h1>
      <div>Max connections: {maxConnections}</div>
      <div>Opened connections: {openedConnections} </div>
      <div>Version: {version}</div>
    </>
  );
}
