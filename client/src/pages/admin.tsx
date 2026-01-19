import { Layout } from "@/components/layout";
import { UserManagement } from "@/components/user-management";
import { useStore } from "@/lib/store";
import { useLocation } from "wouter";
import { useEffect } from "react";

export default function AdminPage() {
  const { user } = useStore();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!user) {
      setLocation("/");
    } else if (user.role !== "admin") {
      setLocation("/dashboard");
    }
  }, [user, setLocation]);

  if (!user || user.role !== "admin") return null;

  return (
    <Layout>
      <UserManagement />
    </Layout>
  );
}
