"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import {
  UtensilsCrossed,
  QrCode,
  Settings,
  LayoutDashboard,
  Mail,
  Users,
  Briefcase,
  Kanban,
} from "lucide-react";

const navItems = [
  { title: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { title: "Speisekarte", href: "/admin/speisekarte", icon: UtensilsCrossed },
  { title: "QR-Codes", href: "/admin/qr-codes", icon: QrCode },
  { title: "Einstellungen", href: "/admin/einstellungen", icon: Settings },
];

const bewerbungItems = [
  { title: "Kanban-Board", href: "/admin/bewerbungen", icon: Kanban },
  { title: "Stellen", href: "/admin/bewerbungen/stellen", icon: Briefcase },
  { title: "E-Mail-Vorlagen", href: "/admin/bewerbungen/email-vorlagen", icon: Mail },
];

export function AdminSidebar({ restaurantName }: { restaurantName: string }) {
  const pathname = usePathname();

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-border px-4 py-3">
        <Link href="/admin" className="flex items-center gap-2">
          <UtensilsCrossed className="h-5 w-5 text-primary" />
          <span className="font-semibold tracking-tight">{restaurantName}</span>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Verwaltung</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={
                      item.href === "/admin"
                        ? pathname === "/admin"
                        : pathname.startsWith(item.href)
                    }
                  >
                    <Link href={item.href}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>BewerbungsBoard</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {bewerbungItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname.startsWith(item.href) && (
                      item.href !== "/admin/bewerbungen" || pathname === "/admin/bewerbungen"
                    )}
                  >
                    <Link href={item.href}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-border p-4">
        <div className="flex items-center gap-3">
          <UserButton
            appearance={{
              elements: { avatarBox: "h-8 w-8" },
            }}
          />
          <span className="text-sm text-muted-foreground truncate">
            {restaurantName}
          </span>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
