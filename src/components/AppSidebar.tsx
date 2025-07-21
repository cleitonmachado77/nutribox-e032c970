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
  const { signOut } = useAuth();
  return (
    <Sidebar className="w-60 min-h-screen bg-gradient-to-b from-[#2a174d] via-[#3a206b] to-[#1a102b] rounded-r-2xl shadow-2xl border-none">
      <SidebarHeader className="p-6 bg-gradient-to-b from-[#5c14eb] to-[#3a206b] rounded-t-2xl border-none">
        <div className="flex items-center justify-center h-24">
          <img
            alt="Nuttro Logo"
            src="/lovable-uploads/nuttro.png"
            className="h-16 w-auto object-contain drop-shadow-lg"
            style={{ maxWidth: '80%' }}
          />
        </div>
      </SidebarHeader>
      <SidebarContent className="bg-gradient-to-b from-[#3a206b] to-[#2a174d] flex-1 border-none">
        <SidebarGroup>
          <SidebarGroupLabel className="text-violet-200">Navegação</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map(item => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={location.pathname === item.url}
                    className="text-violet-100 hover:bg-fuchsia-700 hover:text-white transition-colors rounded-lg px-3 py-2 font-medium"
                  >
                    <Link to={item.url} className="flex items-center gap-3">
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
      <SidebarFooter className="p-6 bg-gradient-to-t from-[#5c14eb] to-[#3a206b] rounded-b-2xl border-none">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={signOut}
              className="text-violet-100 hover:bg-fuchsia-700 hover:text-white transition-colors rounded-lg px-3 py-2 font-medium"
            >
              <LogOut className="w-5 h-5" />
              <span>Sair</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}