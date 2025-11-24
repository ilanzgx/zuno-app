import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";

import { getProfile } from "@/resources/user/user.service";
import { redirect } from "next/navigation";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await getProfile();

  if (!profile || !profile.user) {
    redirect("/entrar");
  }

  return (
    <SidebarProvider>
      <AppSidebar user={profile.user} />
      <main className="w-full">
        <div className="p-4 pt-0">{children}</div>
      </main>
    </SidebarProvider>
  );
}
