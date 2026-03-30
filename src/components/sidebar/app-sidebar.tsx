import { NavUser } from "./nav-user";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
} from "@/components/ui/sidebar";

export function AppSidebar() {
  return (
    <Sidebar>
      <Button>hi</Button>
      <SidebarHeader />
      <SidebarContent>
        <SidebarGroup />
        <SidebarGroup />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={{ avatar: "", email: "example@domain.com", name: "Example User" }} />
      </SidebarFooter>
      <SidebarFooter />
    </Sidebar>
  );
}
