import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { parseJson } from "@/lib/utils";

export default async function AdminAuditPage() {
  await requireAdmin();

  const events = await prisma.auditEvent.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
    include: {
      actor: {
        select: {
          email: true,
        },
      },
    },
  });

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Audit Log</h1>
      <Card>
        <CardHeader>
          <CardTitle>Recent Events</CardTitle>
        </CardHeader>
        <CardContent>
          {events.length === 0 ? (
            <p className="text-gray-500">No audit events yet</p>
          ) : (
            <div className="space-y-2">
              {events.map((event) => {
                const diff = parseJson<Record<string, any>>(event.diff || "{}", {});
                return (
                  <div
                    key={event.id}
                    className="p-3 border border-gray-200 rounded-lg"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium">
                          {event.action} {event.entity} ({event.entityId})
                        </p>
                        <p className="text-sm text-gray-500">
                          {event.actor?.email || "System"} •{" "}
                          {new Date(event.createdAt).toLocaleString()}
                        </p>
                        {Object.keys(diff).length > 0 && (
                          <pre className="text-xs mt-2 bg-gray-50 p-2 rounded overflow-auto">
                            {JSON.stringify(diff, null, 2)}
                          </pre>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
