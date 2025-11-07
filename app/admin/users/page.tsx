import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-helpers";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

async function getUsers() {
  return await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      createdAt: true,
    },
  });
}

export default async function AdminUsersPage() {
  await requireAdmin();
  const users = await getUsers();

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 py-8">
        <div className="container px-4">
          <h1 className="mb-8 text-4xl font-bold">Users</h1>

          <Card>
            <CardHeader>
              <CardTitle>All Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Email</th>
                      <th className="text-left p-2">Name</th>
                      <th className="text-left p-2">Role</th>
                      <th className="text-left p-2">Created</th>
                      <th className="text-left p-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id} className="border-b">
                        <td className="p-2">{user.email}</td>
                        <td className="p-2">{user.name || "-"}</td>
                        <td className="p-2">
                          <Badge variant={user.role === "ADMIN" ? "default" : "secondary"}>
                            {user.role}
                          </Badge>
                        </td>
                        <td className="p-2">{user.createdAt.toLocaleDateString()}</td>
                        <td className="p-2">
                          <Button variant="outline" size="sm">
                            Manage
                          </Button>
                        </td>
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
