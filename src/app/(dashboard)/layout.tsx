import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { DynamicBreadcrumbs } from "@/components/dynamic-breadcrumbs";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="bg-bg">
        <header className="flex h-16 shrink-0 items-center gap-2 border-b-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <DynamicBreadcrumbs />
        </header>
        <main className=" w-full p-4 min-h-[100vh] flex-1 rounded-xl md:min-h-min">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
