import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default async function AdminUsersPage() {
  await requireAdmin();

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      createdAt: true,
    },
  });

  async function toggleRole(formData: FormData) {
    "use server";
    await requireAdmin();
    const userId = formData.get("userId") as string;
    const currentRole = formData.get("currentRole") as string;
    const newRole = currentRole === "ADMIN" ? "USER" : "ADMIN";
    await prisma.user.update({
      where: { id: userId },
      data: { role: newRole },
    });
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Users</h1>
      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
        </CardHeader>
        <CardContent>
          {users.length === 0 ? (
            <p className="text-gray-500">No users found</p>
          ) : (
            <div className="space-y-2">
              {users.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
                >
                  <div>
                    <p className="font-medium">{user.email}</p>
                    <p className="text-sm text-gray-500">
                      {user.name || "No name"} • {user.role} • Joined{" "}
                      {new Date(user.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <form action={toggleRole}>
                    <input type="hidden" name="userId" value={user.id} />
                    <input type="hidden" name="currentRole" value={user.role} />
                    <Button
                      type="submit"
                      variant="outline"
                      size="sm"
                      disabled={user.role === "ADMIN"}
                    >
                      {user.role === "ADMIN" ? "Admin" : "Make Admin"}
                    </Button>
                  </form>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
