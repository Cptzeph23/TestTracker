import { useStore } from "@/lib/store";
import { Link, useLocation } from "wouter";
import { Calendar, Users, LogOut, LayoutDashboard, Bell, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatDistanceToNow } from "date-fns";
import logo from "@assets/18152e2c-9e0b-4100-8385-8fcf64ca11b7_1764764393554.png";

export function Layout({ children }: { children: React.ReactNode }) {
  const { user, logout, notifications, markNotificationAsRead, markAllNotificationsAsRead } = useStore();
  const [location] = useLocation();

  const userNotifications = notifications.filter(n => n.userId === user?.id);
  const unreadCount = userNotifications.filter(n => !n.read).length;

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Sidebar */}
      <aside className="w-72 bg-black border-r border-zinc-800 flex flex-col z-20 shadow-2xl relative">
        {/* Decorative gradient blur */}
        <div className="absolute -top-20 -left-20 w-64 h-64 bg-amber-500/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="p-8 flex flex-col items-center gap-4 border-b border-zinc-800/50 relative z-10">
          <div className="w-24 h-24 rounded-full border border-zinc-800 p-4 bg-zinc-900/50 shadow-[0_0_30px_-10px_rgba(217,119,6,0.3)] backdrop-blur-sm">
            <img 
              src={logo} 
              alt="SIMIA" 
              className="w-full h-full object-contain drop-shadow-lg"
            />
          </div>
          <div className="text-center space-y-1">
            <h1 className="font-display font-bold text-2xl tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-500 to-amber-200">SIMIA</h1>
            <div className="flex items-center justify-center gap-1.5 opacity-60">
              <Shield className="w-3 h-3 text-amber-500" />
              <p className="text-[10px] text-zinc-400 uppercase tracking-[0.2em] font-medium">Insurance Group</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-8">
          <Link href="/dashboard">
            <Button
              variant="ghost"
              className={`w-full justify-start gap-3 font-medium h-12 transition-all duration-300 ${
                location === "/dashboard" 
                  ? "bg-amber-500/10 text-amber-500 border-l-2 border-amber-500 pl-3" 
                  : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/50 border-l-2 border-transparent"
              }`}
            >
              <LayoutDashboard className={`w-5 h-5 ${location === "/dashboard" ? "text-amber-500" : "text-zinc-500"}`} />
              Calendar
            </Button>
          </Link>
          
          {user?.role === "admin" && (
            <Link href="/admin">
              <Button
                variant="ghost"
                className={`w-full justify-start gap-3 font-medium h-12 transition-all duration-300 ${
                  location === "/admin" 
                    ? "bg-amber-500/10 text-amber-500 border-l-2 border-amber-500 pl-3" 
                    : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/50 border-l-2 border-transparent"
                }`}
              >
                <Users className={`w-5 h-5 ${location === "/admin" ? "text-amber-500" : "text-zinc-500"}`} />
                Team Management
              </Button>
            </Link>
          )}
        </nav>

        <div className="p-6 border-t border-zinc-800/50 bg-zinc-900/30 backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-4 px-1">
            <div className="relative">
              <img
                src={user?.avatar}
                alt={user?.name}
                className="w-10 h-10 rounded-full border border-zinc-700 bg-zinc-800"
              />
              <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-black" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate text-zinc-200">{user?.name}</p>
              <p className="text-xs text-amber-500 capitalize font-medium">{user?.role}</p>
            </div>
            
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="relative text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-full h-8 w-8">
                  <Bell className="w-4 h-4" />
                  {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-0 bg-zinc-950 border-zinc-800 shadow-2xl" align="end" sideOffset={10}>
                <div className="p-3 border-b border-zinc-800 bg-zinc-900/50 flex items-center justify-between">
                  <h4 className="font-medium text-sm text-zinc-200">Notifications</h4>
                  {unreadCount > 0 && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-auto p-0 text-[10px] text-amber-500 hover:text-amber-400 uppercase tracking-wider font-medium"
                      onClick={markAllNotificationsAsRead}
                    >
                      Mark all read
                    </Button>
                  )}
                </div>
                <ScrollArea className="h-[300px]">
                  {userNotifications.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-40 text-zinc-500 gap-2">
                      <Bell className="w-8 h-8 opacity-20" />
                      <p className="text-sm">No new notifications</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-zinc-800/50">
                      {userNotifications.map((notification) => (
                        <div 
                          key={notification.id} 
                          className={`p-4 hover:bg-zinc-900/50 transition-colors cursor-pointer ${notification.read ? 'opacity-50' : 'bg-zinc-900/20'}`}
                          onClick={() => markNotificationAsRead(notification.id)}
                        >
                          <div className="flex items-start gap-3">
                            <div className={`mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 ${notification.read ? 'bg-zinc-700' : 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]'}`} />
                            <div className="flex-1 space-y-1">
                              <p className="text-sm text-zinc-200 leading-snug">{notification.message}</p>
                              <p className="text-[10px] text-zinc-500 font-medium">
                                {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </PopoverContent>
            </Popover>
          </div>
          <Button 
            variant="outline" 
            className="w-full gap-2 border-zinc-800 bg-zinc-950 text-zinc-400 hover:text-white hover:bg-zinc-900 hover:border-zinc-700 transition-all h-9 text-xs uppercase tracking-wider" 
            onClick={logout}
          >
            <LogOut className="w-3.5 h-3.5" />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto relative bg-zinc-50 dark:bg-black">
        {/* Subtle gold noise/grid overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_800px_at_100%_200px,#d4af3710,transparent)]" />
        
        <div className="relative min-h-full">
            {children}
        </div>
      </main>
    </div>
  );
}
