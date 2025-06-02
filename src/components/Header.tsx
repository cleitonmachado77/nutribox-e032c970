
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, Settings, Wifi, WifiOff, LogIn, MessageCircle } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { UserMenu } from "./UserMenu";
import { useAuth } from "@/contexts/AuthContext";
import { useWhatsApp } from "@/contexts/WhatsAppContext";

interface HeaderProps {
  title: string;
  description?: string;
}

export const Header = ({ title, description }: HeaderProps) => {
  const { user } = useAuth();
  const { isConnected, unreadCount } = useWhatsApp();

  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-4">
        <SidebarTrigger />
        <div>
          <h1 className="text-3xl font-bold text-white">{title}</h1>
          {description && <p className="text-gray-400">{description}</p>}
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* WhatsApp Status */}
        <div className="flex items-center gap-2">
          {isConnected ? (
            <div className="flex items-center gap-2 text-green-400">
              <Wifi className="w-4 h-4" />
              <span className="text-sm">WhatsApp Conectado</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-red-400">
              <WifiOff className="w-4 h-4" />
              <span className="text-sm">WhatsApp Desconectado</span>
            </div>
          )}
        </div>

        {user ? (
          <>
            {/* WhatsApp Messages Notification */}
            <Button variant="ghost" size="icon" className="relative" asChild>
              <Link to="/dashboard/conversas">
                <MessageCircle className="w-5 h-5 text-gray-400" />
                {unreadCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center bg-green-500 text-white text-xs">
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </Badge>
                )}
              </Link>
            </Button>

            {/* General Notifications */}
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-5 h-5 text-gray-400" />
              <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center bg-red-500 text-white text-xs">
                3
              </Badge>
            </Button>

            {/* Settings */}
            <Button variant="ghost" size="icon" asChild>
              <Link to="/dashboard/settings">
                <Settings className="w-5 h-5 text-gray-400" />
              </Link>
            </Button>

            {/* User Menu */}
            <UserMenu />
          </>
        ) : (
          <Button asChild className="bg-purple-600 hover:bg-purple-700">
            <Link to="/auth">
              <LogIn className="w-4 h-4 mr-2" />
              Entrar
            </Link>
          </Button>
        )}
      </div>
    </div>
  );
};
