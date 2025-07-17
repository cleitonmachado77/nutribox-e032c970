import { Calendar, Home, Users, MessageSquare, Brain, KanbanSquare, UserCheck, LogOut, Settings } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarHeader } from "@/components/ui/sidebar";
import { useAuth } from "@/contexts/AuthContext";

// Menu items.
const items = [{
  title: "Dashboard",
  url: "/dashboard",
  icon: Home
}, {
  title: "Pacientes",
  url: "/dashboard/pacientes",
  icon: UserCheck
}, {
  title: "Consultas",
  url: "/dashboard/consultas",
  icon: Users
}, {
  title: "Kanban",
  url: "/dashboard/kanban",
  icon: KanbanSquare
}, {
  title: "Conversas",
  url: "/dashboard/conversas",
  icon: MessageSquare
}, {
  title: "NutriCoach",
  url: "/dashboard/nutricoach",
  icon: Brain
}, {
  title: "Painel Paciente",
  url: "/dashboard/painel-paciente",
  icon: Users
}, {
  title: "Configurações",
  url: "/dashboard/settings",
  icon: Settings
}];
export function AppSidebar() {
  const location = useLocation();
  const {
    signOut
  } = useAuth();
  return <Sidebar>
      <SidebarHeader className="p-4 bg-[#5c14eb]">
        <div className="flex items-center justify-center">
          <img alt="Nuttro Logo" src="/lovable-uploads/d1a56a3a-7bda-4b0b-9c07-2d4a088f628c.png" className="h-12 w-auto object-scale-down" />
        </div>
      </SidebarHeader>
      <SidebarContent className="bg-[#5c14eb]">
        <SidebarGroup>
          <SidebarGroupLabel>Navegação</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map(item => <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={location.pathname === item.url}>
                    <Link to={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>)}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4 bg-[#5c14eb]">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={signOut}>
              <LogOut />
              <span>Sair</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>;
}