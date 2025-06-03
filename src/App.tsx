
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { AuthProvider } from "@/contexts/AuthContext";
import { WhatsAppProvider } from "@/contexts/WhatsAppContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Leads from "./pages/Leads";
import Kanban from "./pages/Kanban";
import Pacientes from "./pages/Pacientes";
import Conversas from "./pages/Conversas";
import NutriboxIA from "./pages/NutriboxIA";
import Plans from "./pages/Plans";
import NotFound from "./pages/NotFound";
import Settings from "./pages/Settings";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <WhatsAppProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/dashboard/*" element={
                <ProtectedRoute>
                  <SidebarProvider>
                    <div className="min-h-screen flex w-full">
                      <AppSidebar />
                      <div className="flex-1">
                        <Routes>
                          <Route index element={<Dashboard />} />
                          <Route path="leads" element={<Leads />} />
                          <Route path="kanban" element={<Kanban />} />
                          <Route path="pacientes" element={<Pacientes />} />
                          <Route path="conversas" element={<Conversas />} />
                          <Route path="nutribox-ia" element={<NutriboxIA />} />
                          <Route path="plans" element={<Plans />} />
                          <Route path="settings" element={<Settings />} />
                        </Routes>
                      </div>
                    </div>
                  </SidebarProvider>
                </ProtectedRoute>
              } />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </WhatsAppProvider>
      </AuthProvider>
    </TooltipProvider>
    <Toaster />
  </QueryClientProvider>
);

export default App;
