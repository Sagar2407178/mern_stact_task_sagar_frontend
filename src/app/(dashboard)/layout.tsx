"use client";

import AuthGuard from "@/components/auth/AuthGuard";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { logout } from "@/store/slices/authSlice";
import { LogOut, Package, LayoutDashboard, Settings } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const pathname = usePathname();

  const handleLogout = () => {
    dispatch(logout());
  };

  const navItems = [{ name: "Products", href: "/products", icon: Package }];

  return (
    <AuthGuard>
      <div className="flex h-screen bg-background text-foreground">
        {/* Sidebar */}
        <aside className="w-64 border-r border-border bg-card/50 backdrop-blur-xl flex flex-col">
          <div className="h-16 flex items-center justify-between px-6 border-b border-border">
            <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
              Store
            </h1>
            <ThemeToggle />
          </div>

          <nav className="flex-1 px-4 py-6 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? "bg-indigo-500/10 text-indigo-500"
                      : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.name}</span>
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t border-border">
            <div className="flex items-center space-x-3 px-4 py-3 mb-2">
              <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center font-bold text-white">
                {user?.name?.[0]?.toUpperCase()}
              </div>
              <div className="flex flex-col overflow-hidden">
                <span className="text-sm font-medium truncate">
                  {user?.name}
                </span>
                <span className="text-xs text-muted-foreground truncate">
                  {user?.email}
                </span>
              </div>
            </div>
            <Button
              variant="ghost"
              className="w-full flex items-center justify-start space-x-3 text-red-400 hover:text-red-300 hover:bg-red-950/30"
              onClick={handleLogout}
            >
              <LogOut className="w-5 h-5" />
              <span>Log out</span>
            </Button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-auto bg-background">
          <div className="h-full p-8">{children}</div>
        </main>
      </div>
    </AuthGuard>
  );
}
