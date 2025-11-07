import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-helpers";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

async function getAuditEvents() {
  return await prisma.auditEvent.findMany({
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
}

export default async function AdminAuditPage() {
  await requireAdmin();
  const events = await getAuditEvents();

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 py-8">
        <div className="container px-4">
          <h1 className="mb-8 text-4xl font-bold">Audit Log</h1>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Actor</th>
                      <th className="text-left p-2">Entity</th>
                      <th className="text-left p-2">Action</th>
                      <th className="text-left p-2">Timestamp</th>
                    </tr>
                  </thead>
                  <tbody>
                    {events.map((event) => (
                      <tr key={event.id} className="border-b">
                        <td className="p-2">{event.actor?.email || "System"}</td>
                        <td className="p-2">{event.entity}</td>
                        <td className="p-2">{event.action}</td>
                        <td className="p-2">{event.createdAt.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
