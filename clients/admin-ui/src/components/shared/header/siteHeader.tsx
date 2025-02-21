"use client";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { SearchForm } from "./searchForm";

export function SiteHeader() {
  return (
    <header className="flex h-16 sticky top-0 shrink-0 z-10 items-center gap-2 border-b px-4 bg-[#17296b]">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-2 h-4" />
      <SearchForm className="w-full sm:ml-auto sm:w-auto" />
    </header>
  );
}
