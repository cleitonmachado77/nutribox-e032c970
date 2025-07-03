
import { Calendar, Home, Users, MessageSquare, Brain, KanbanSquare, UserCheck, LogOut, Settings } from "lucide-react"
import { Link, useLocation } from "react-router-dom"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
} from "@/components/ui/sidebar"
import { useAuth } from "@/contexts/AuthContext"

// Menu items.
const items = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Pacientes",
    url: "/dashboard/pacientes",
    icon: UserCheck,
  },
  {
    title: "Consultas",
    url: "/dashboard/consultas",
    icon: Users,
  },
  {
    title: "Kanban",
    url: "/dashboard/kanban",
    icon: KanbanSquare,
  },
  {
    title: "Conversas",
    url: "/dashboard/conversas",
    icon: MessageSquare,
  },
  {
    title: "NutriCoach",
    url: "/dashboard/nutricoach",
    icon: Brain,
  },
  {
    title: "Painel Paciente",
    url: "/dashboard/painel-paciente",
    icon: Users,
  },
  {
    title: "Configurações",
    url: "/dashboard/settings",
    icon: Settings,
  },
]

export function AppSidebar() {
  const location = useLocation()
  const { signOut } = useAuth()

  return (
    <Sidebar className="border-r border-purple-100 bg-gradient-to-b from-purple-600 to-purple-700 text-white shadow-lg">
      <SidebarHeader className="p-6 border-b border-purple-500/30">
        <div className="flex items-center justify-center">
          <img 
            src="/lovable-uploads/83d718e0-f178-4131-ae80-27b184b0402a.png" 
            alt="Nutribox Logo" 
            className="h-12 w-auto object-contain filter brightness-0 invert" 
          />
        </div>
      </SidebarHeader>
      <SidebarContent className="px-3 py-4">
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-medium text-purple-100 uppercase tracking-wider mb-3">
            Navegação
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={location.pathname === item.url}
                    className="w-full justify-start px-4 py-3 text-sm font-medium transition-all duration-200 rounded-xl hover:bg-purple-500/30 hover:shadow-md hover:scale-[1.02] data-[active=true]:bg-white data-[active=true]:text-purple-600 data-[active=true]:shadow-lg data-[active=true]:font-semibold"
                  >
                    <Link to={item.url} className="flex items-center space-x-3">
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
      <SidebarFooter className="p-4 border-t border-purple-500/30">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton 
              onClick={signOut}
              className="w-full justify-start px-4 py-3 text-sm font-medium text-purple-100 hover:text-white hover:bg-purple-500/30 rounded-xl transition-all duration-200 hover:shadow-md"
            >
              <LogOut className="w-5 h-5 mr-3" />
              <span>Sair</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
