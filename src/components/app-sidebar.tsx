"use client";

import {
  Calendar,
  Home,
  Inbox,
  PawPrint,
  Search,
  Settings,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

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
} from "@/components/ui/sidebar";
import { NavUser } from "./nav-user";

// Menu items.
const items = [
  {
    title: "首页",
    url: "/guild",
    icon: Home,
  },
  {
    title: "赛季讨伐记录",
    url: "/guild/battle",
    icon: Inbox,
  },
  {
    title: "公会扭蛋",
    url: "/guild/gacha",
    icon: Calendar,
  },
  {
    title: "公会捐献排行",
    url: "/donation",
    icon: Search,
  },
  {
    title: "设置",
    url: "/setting",
    icon: Settings,
  },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar>
      <SidebarHeader className="px-6 pt-4">
        <Link href="#" className="flex items-center gap-2 h-11">
          <div className="flex aspect-square size-8 items-center justify-center  bg-black text-main border-2">
            <PawPrint />
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-lg font-bold text-text">熊熊助手PRO</span>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup className="pt-1 px-4">
          <SidebarGroupLabel>公会讨伐战</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={pathname === item.url}>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t-2">
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
