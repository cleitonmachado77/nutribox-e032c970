
import { Home, Users, User, Kanban, MessageCircle, Bot } from "lucide-react";
import { useLocation, Link } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";

const menuItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: Home,
  },
  {
    title: "Leads",
    url: "/leads",
    icon: Users,
  },
  {
    title: "Pacientes",
    url: "/pacientes",
    icon: User,
  },
  {
    title: "Kanban",
    url: "/kanban",
    icon: Kanban,
  },
  {
    title: "Conversas",
    url: "/conversas",
    icon: MessageCircle,
  },
  {
    title: "Nutribox IA",
    url: "/nutribox-ia",
    icon: Bot,
  },
];

export function AppSidebar() {
  const location = useLocation();

  return (
    <Sidebar className="border-r border-sidebar-border">
      <SidebarHeader className="p-6">
        <div className="flex items-center gap-2">
          <img 
            src="/lovable-uploads/07806ab8-72d7-4140-b6d6-977826fced95.png" 
            alt="Nutribox Logo" 
            className="w-32 h-auto"
          />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={location.pathname === item.url}>
                    <Link to={item.url} className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-sidebar-accent transition-colors">
                      <item.icon className="w-5 h-5" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
          <div>
            <p className="text-sm font-medium text-white">Dr. João Paulo</p>
            <p className="text-xs text-gray-300">Administrador</p>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
