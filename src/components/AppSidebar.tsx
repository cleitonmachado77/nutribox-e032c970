
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
    <Sidebar className="border-r border-gray-200 bg-white">
      <SidebarHeader className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-center">
          <img 
            src="/lovable-uploads/83d718e0-f178-4131-ae80-27b184b0402a.png" 
            alt="Nutribox Logo" 
            className="h-10 w-auto object-contain" 
          />
        </div>
      </SidebarHeader>
      <SidebarContent className="px-3 py-4">
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
            Navegação
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={location.pathname === item.url}
                    className="w-full justify-start px-3 py-2 text-sm font-medium transition-colors rounded-lg hover:bg-gray-100 data-[active=true]:bg-purple-50 data-[active=true]:text-purple-600 data-[active=true]:border-purple-200"
                  >
                    <Link to={item.url} className="flex items-center space-x-3">
                      <item.icon className="w-4 h-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-3 border-t border-gray-100">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton 
              onClick={signOut}
              className="w-full justify-start px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4 mr-3" />
              <span>Sair</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
