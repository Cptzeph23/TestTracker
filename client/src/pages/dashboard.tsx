import { Layout } from "@/components/layout";
import { CalendarView } from "@/components/calendar-view";
import { useStore } from "@/lib/store";
import { useLocation } from "wouter";
import { useEffect } from "react";

export default function DashboardPage() {
  const { user } = useStore();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!user) {
      setLocation("/");
    }
  }, [user, setLocation]);

  if (!user) return null;

  return (
    <Layout>
      <CalendarView />
    </Layout>
  );
}
