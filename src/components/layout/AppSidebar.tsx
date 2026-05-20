import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Users,
  Hand,
  Wallet,
  Settings,
  User as UserIcon,
  Calendar,
  Target,
  Crown,
  Cog,
  Shield,
  Activity,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useAuth, type AppRole } from "@/hooks/use-auth";
import { usePermissions } from "@/hooks/use-permissions";
import { useTheme } from "@/hooks/use-theme";
import type { Permission } from "@/lib/permissions";

type Item = {
  title: string;
  url: string;
  icon: any;
  roles?: AppRole[];
  permission?: Permission;
  /** dashboard view filter when url is "/" */
  view?: "overview" | "eventos" | "metas" | "usuarios" | "auditoria";
};

const mainItems: Item[] = [
  {
    title: "Início",
    url: "/",
    icon: LayoutDashboard,
    view: "overview",
    permission: "dashboard.view",
  },
  { title: "Membros", url: "/membros", icon: Users, permission: "membros.view" },
  { title: "Visitantes", url: "/visitantes", icon: Hand, permission: "visitantes.view" },
  { title: "Ofertas", url: "/ofertas", icon: Wallet, permission: "ofertas.view" },
];

const gestaoItems: Item[] = [
  { title: "Eventos", url: "/", icon: Calendar, view: "eventos", permission: "eventos.view" },
  { title: "Metas", url: "/", icon: Target, view: "metas", permission: "metas.view" },
];

const adminItems: Item[] = [
  { title: "Usuários", url: "/", icon: Shield, view: "usuarios", roles: ["admin"] },
  { title: "Auditoria", url: "/", icon: Activity, view: "auditoria", roles: ["admin"] },
  { title: "Painel Admin", url: "/admin", icon: Crown, roles: ["admin"] },
  { title: "Sistema", url: "/sistema", icon: Cog, roles: ["admin"] },
];

const footerItems: Item[] = [
  { title: "Perfil", url: "/perfil", icon: UserIcon },
  { title: "Configurações", url: "/configuracoes", icon: Settings },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const path = useRouterState({ select: (r) => r.location.pathname });
  const search = useRouterState({ select: (r) => r.location.search as { view?: string } });
  const { hasRole, isAdmin } = useAuth();
  const { can } = usePermissions();
  const { theme } = useTheme();
  const isBlackTheme = theme === "black";
  const currentView = (search?.view as string | undefined) ?? "overview";

  const isActive = (it: Item) => {
    if (it.url === "/") {
      if (path !== "/") return false;
      const v = it.view ?? "overview";
      return currentView === v;
    }
    return path.startsWith(it.url);
  };
  const visible = (it: Item) => {
    if (it.roles && !it.roles.some((r) => hasRole(r))) return false;
    if (it.permission && !can(it.permission)) return false;
    return true;
  };

  const renderItems = (items: Item[]) =>
    items.filter(visible).map((item) => {
      const linkProps =
        item.url === "/"
          ? {
              to: "/" as const,
              search: (item.view && item.view !== "overview" ? { view: item.view } : {}) as any,
            }
          : { to: item.url };
      const active = isActive(item);
      return (
        <SidebarMenuItem key={`${item.url}|${item.view ?? ""}|${item.title}`}>
          <SidebarMenuButton asChild isActive={active} tooltip={item.title}>
            <Link
              {...(linkProps as any)}
              className={`group relative flex items-center gap-3 rounded-2xl transition-all duration-300 ${
                active
                  ? isBlackTheme
                    ? "border border-[rgba(214,168,95,0.22)] bg-[rgba(214,168,95,0.10)] text-foreground shadow-[0_0_20px_rgba(214,168,95,0.08)]"
                    : "border border-primary/20 bg-primary/[0.12] text-foreground shadow-[0_0_20px_color-mix(in_oklab,var(--brand-blue)_8%,transparent)]"
                  : "text-sidebar-foreground/75 hover:bg-white/[0.05] hover:text-foreground"
              }`}
            >
              {active && (
                <span
                  aria-hidden
                  className={`absolute left-0 top-1/2 h-5 w-[2px] -translate-y-1/2 rounded-r-full ${isBlackTheme ? "bg-gradient-to-b from-[#f0d28a] to-[#d6a85f] shadow-[0_0_8px_rgba(214,168,95,0.42)]" : "bg-gradient-to-b from-[color:var(--brand-blue-glow)] to-[color:var(--brand-blue)] shadow-[0_0_8px_var(--brand-blue-glow)]"}`}
                />
              )}
              <item.icon
                className={`h-4 w-4 transition-colors ${active ? (isBlackTheme ? "text-[#f0d28a]" : "text-[color:var(--brand-blue-glow)]") : "text-sidebar-foreground/60 group-hover:text-foreground/90"}`}
              />
              <span className="text-[13px] font-medium tracking-tight">{item.title}</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      );
    });

  return (
    <Sidebar
      collapsible="icon"
      className="border-r border-white/5 bg-[#060816]/95 backdrop-blur-2xl"
    >
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex items-center gap-3 px-2 py-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[color:var(--brand-blue)] to-[color:var(--brand-red)] text-sm font-bold text-white shadow-[var(--shadow-glow-blue)]">
            A
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <p className="truncate text-sm font-bold tracking-wide text-sidebar-foreground">
                GRUPO <span className="text-[color:var(--brand-blue-glow)]">ADNA</span>
              </p>
              <p className="truncate text-[10px] uppercase tracking-widest text-sidebar-foreground/60">
                Painel SaaS
              </p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        {mainItems.filter(visible).length > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel>Principal</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>{renderItems(mainItems)}</SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {gestaoItems.filter(visible).length > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel>Gestão</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>{renderItems(gestaoItems)}</SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {isAdmin && (
          <SidebarGroup>
            <SidebarGroupLabel>Administração</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>{renderItems(adminItems)}</SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border">
        <SidebarMenu>{renderItems(footerItems)}</SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
