import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";

import { getProfile } from "@/resources/user/user.service";
import { redirect } from "next/navigation";
import StoreInitializer from "@/components/store-initializer";

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
      <StoreInitializer user={profile.user} />
      <AppSidebar />
      <main className="w-full">
        <div className="p-4 pt-0">{children}</div>
      </main>
    </SidebarProvider>
  );
}
