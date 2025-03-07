import { AppSidebar } from '@/components/app-sidebar'
import { DynamicBreadcrumbs } from '@/components/dynamic-breadcrumbs'
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="bg-white bg-[radial-gradient(#ddd_1px,transparent_1px)] bg-[length:16px_16px]">
        <header className="flex h-16 shrink-0 items-center gap-2 border-b-2 px-4 sticky top-0 z-50 backdrop-blur-md bg-white/70 transition-all duration-300 shadow-sm">
          <SidebarTrigger className="-ml-1" />
          <DynamicBreadcrumbs />
        </header>
        <main className="p-4 flex-1 overflow-auto min-h-[calc(100vh-4rem)]">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
