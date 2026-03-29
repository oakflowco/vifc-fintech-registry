import { fetchSheetData } from "@/lib/sheets";
import { RegistryTable } from "@/components/registry-table";
import { getSessionUserId } from "@/lib/session";
import { getUserById, hasActiveSubscription } from "@/lib/users";

interface RegistryPageProps {
  title: string;
  description: string;
  sheetUrl: string | undefined;
  envVarName: string;
  filterColumns?: string[];
  exportType?: string;
}

export async function RegistryPage({
  title,
  description,
  sheetUrl,
  envVarName,
  filterColumns,
  exportType,
}: RegistryPageProps) {
  // Check subscription status
  let subscribed = false;
  const userId = await getSessionUserId();
  if (userId) {
    const user = await getUserById(userId);
    if (user && hasActiveSubscription(user)) {
      subscribed = true;
    }
  }

  let headers: string[] = [];
  let data: Record<string, string>[] = [];
  let error = "";

  if (!sheetUrl) {
    error = `${envVarName} is not configured. Add a new tab to your Google Sheet, publish it as CSV, and set the URL in .env.local.`;
  } else {
    try {
      const result = await fetchSheetData(sheetUrl);
      headers = result.headers;
      data = result.data;
    } catch (e) {
      error = `Failed to fetch data. ${e instanceof Error ? e.message : ""}`;
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        <p className="text-sm text-muted-foreground mt-1">{description}</p>
      </div>

      {error ? (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-6 text-center">
          <p className="text-sm text-destructive">{error}</p>
          <p className="mt-2 text-xs text-muted-foreground">
            Set <code className="font-mono bg-muted px-1 py-0.5 rounded">{envVarName}</code> in your .env.local file.
          </p>
        </div>
      ) : data.length === 0 ? (
        <div className="rounded-lg border p-6 text-center">
          <p className="text-sm text-muted-foreground">
            No data found in the spreadsheet. Add some rows and refresh.
          </p>
        </div>
      ) : (
        <RegistryTable
          headers={headers}
          data={data}
          filterColumns={filterColumns}
          exportType={exportType}
          isPremium={subscribed}
        />
      )}
    </div>
  );
}
