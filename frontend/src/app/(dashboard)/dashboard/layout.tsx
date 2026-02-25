import { Providers } from "~/components/provides";
import { Toaster } from "~/components/ui/sonner";
// 添加 sidebar 组件
import { SidebarInset, SidebarProvider, SidebarTrigger } from "~/components/ui/sidebar";
import { Separator } from "~/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "~/components/ui/breadcrumb"
import BreadcrumbPageClient from "~/components/sidebar/breadrumb-page-client";
import AppSidebar from "~/components/sidebar/app-sidebar";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Voice Studio",
  description: "AI Voice Studio 是一个基于 AI 技术的语音识别和合成平台，提供了简单易用的 API 接口，帮助开发者快速集成语音功能到自己的应用中。",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
      <Providers>
        <SidebarProvider>
          {/* <SidebarTrigger /> */}
          <AppSidebar />
          <SidebarInset className="flex flex-col h-screen">
            <header className="bg-background/95 supports-[backdrop-filter]:bg-background/60 border-border/40 sticky top-0 z-10 border-b px-6 py-3 shadow-sm backdrop-blur">
            <div className="flex shrink-0 grow items-center gap-3">
              <SidebarTrigger className="hover:bg-muted -ml-1 h-8 w-8 transition-colors" />
              <Separator
                orientation="vertical"
                className="mr-2 h-6 data-[orientation=vertical]:h-6"
              />
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbPageClient />
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          </header>
          <main className="from-background to-muted/20 flex-1 overflow-y-auto bg-gradient-to-br p-6">
            {children}
          </main>
            
          </SidebarInset>
        </SidebarProvider>

        <Toaster />
      </Providers>
    )
}
