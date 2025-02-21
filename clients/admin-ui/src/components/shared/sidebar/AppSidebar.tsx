import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { sideBarItems } from "@/configs/constants";
import { SidebarItem } from "@/configs/types";
import { cn } from "@/lib/utils";
import { LogOut } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  return (
    <Sidebar {...props}>
      <SidebarHeader className="bg-[#111C43] pb-16">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild className="bg-white">
              <Link href="/">
                <div className="flex aspect-square size-10 items-center justify-center rounded-lg text-sidebar-primary-foreground">
                  <Image
                    src="/imgs/logo-sidebar.png"
                    width={100}
                    height={100}
                    alt="Logo"
                    className=""
                  />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Fast Food</span>
                  <span className="truncate text-xs">Restaurant</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="bg-[#111C43]">
        {sideBarItems.map((item: SidebarItem, index: number) => (
          <SidebarMenuItem key={index} className="list-none py-1">
            <SidebarMenuButton
              className={cn(
                `flex items-center w-full text-2xl px-2 text-white`,
                pathname === item.link && "bg-white text-black"
              )}
            >
              <Link
                href={item.link}
                className="flex items-center w-full text-2xl px-2"
              >
                <span className="mr-4 text-3xl">{item.icon}</span>
                {item.name}
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarContent>
      <SidebarFooter className="bg-[#111C43]">
        <div className="flex items-center pl-3 cursor-pointer">
          <span className="mr-4 text-3xl">
            <LogOut className="text-white" />
          </span>
          <span className="text-white text-2xl">Logout</span>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}

export default AppSidebar;
