"use client";

import {
  LayoutDashboard,
  PieChart,
  ArrowLeftRight,
  Wallet,
  TrendingUp,
  Settings,
  LogOut,
  User as UserIcon,
  Calendar,
  Plus,
  FileText,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
} from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { signOut } from "@/resources/user/user.service";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/stores/user.store";
import { useEffect, useState } from "react";
import { CreateTransactionDialog } from "@/components/create-transaction-dialog";

// Menu items - Navegação principal
const navigationItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Posições",
    url: "/posicoes",
    icon: Wallet,
  },
  {
    title: "Patrimônio",
    url: "/patrimonio",
    icon: PieChart,
  },
  {
    title: "Eventos",
    url: "/eventos",
    icon: Calendar,
  },
  {
    title: "Transações",
    url: "/transacoes",
    icon: ArrowLeftRight,
  },
];

export function AppSidebar() {
  const router = useRouter();
  const user = useUserStore((state) => state.user);
  const [isMounted, setIsMounted] = useState(false);
  const [isTransactionDialogOpen, setIsTransactionDialogOpen] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  async function handleSignOut() {
    await signOut();
    router.push("/entrar");
  }

  return (
    <Sidebar>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="/dashboard">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <TrendingUp className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">InvestHub</span>
                  <span className="truncate text-xs">Consolidador</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navegação</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild size="sm" className="h-9">
                    <a href={item.url} className="text-sm font-medium">
                      <item.icon className="size-4" />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Ações</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  size="sm"
                  className="h-9 cursor-pointer font-medium"
                  onClick={() => setIsTransactionDialogOpen(true)}
                >
                  <Plus className="size-4" />
                  <span className="text-xs">Cadastrar transação</span>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton asChild size="sm" className="h-9">
                  <a href="/relatorios" className="text-sm font-medium">
                    <FileText className="size-4" />
                    <span>Gerar relatório</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton asChild size="sm" className="h-9">
                  <a href="/configuracoes" className="text-sm font-medium">
                    <Settings className="size-4" />
                    <span>Configurações</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <a href="/conta">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                  <UserIcon className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <div
                    className="truncate font-semibold"
                    suppressHydrationWarning
                  >
                    {isMounted ? (
                      user?.name
                    ) : (
                      <Skeleton className="h-4 w-24 my-1" />
                    )}
                  </div>
                  <div className="truncate text-xs" suppressHydrationWarning>
                    {isMounted ? (
                      user?.email
                    ) : (
                      <Skeleton className="h-3 w-32" />
                    )}
                  </div>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              className="cursor-pointer"
              onClick={handleSignOut}
            >
              <LogOut />
              <span>Sair</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <CreateTransactionDialog
        open={isTransactionDialogOpen}
        onOpenChange={setIsTransactionDialogOpen}
      />
    </Sidebar>
  );
}
