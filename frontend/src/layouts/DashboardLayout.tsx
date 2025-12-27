import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { HeartPulse, LayoutDashboard, History, Settings, LogOut } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function DashboardLayout() {
    const navigate = useNavigate();
    const location = useLocation();

    async function handleLogout() {
        await supabase.auth.signOut();
        toast.success("Logged out successfully");
        navigate("/login");
    }

    return (
        <div className="flex min-h-screen bg-slate-50 font-sans">
            {/* Sidebar */}
            <aside className="w-64 bg-emerald-900 text-white min-h-screen hidden md:flex flex-col">
                <div className="p-6 flex items-center gap-2 font-bold text-xl border-b border-emerald-800">
                    <HeartPulse className="h-6 w-6" />
                    <span>AI Heart Disease Predictor</span>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    <Link
                        to="/dashboard"
                        className={cn(
                            "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                            location.pathname === "/dashboard"
                                ? "bg-emerald-800 text-emerald-100"
                                : "text-emerald-100/70 hover:bg-emerald-800/30 hover:text-emerald-50"
                        )}
                    >
                        <LayoutDashboard className="h-5 w-5" />
                        Dashboard
                    </Link>
                    <Link
                        to="/history"
                        className={cn(
                            "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                            location.pathname === "/history"
                                ? "bg-emerald-800 text-emerald-100"
                                : "text-emerald-100/70 hover:bg-emerald-800/30 hover:text-emerald-50"
                        )}
                    >
                        <History className="h-5 w-5" />
                        History
                    </Link>
                    <Link
                        to="/settings"
                        className={cn(
                            "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                            location.pathname === "/settings"
                                ? "bg-emerald-800 text-emerald-100"
                                : "text-emerald-100/70 hover:bg-emerald-800/30 hover:text-emerald-50"
                        )}
                    >
                        <Settings className="h-5 w-5" />
                        Settings
                    </Link>
                </nav>

                <div className="p-4 border-t border-emerald-800">
                    <Button variant="ghost" className="w-full justify-start text-emerald-100 hover:text-white hover:bg-emerald-800" onClick={handleLogout}>
                        <LogOut className="h-5 w-5 mr-3" />
                        Sign Out
                    </Button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col">
                {/* Mobile Header */}
                <header className="bg-white border-b py-4 px-6 flex md:hidden items-center justify-between">
                    <div className="font-bold text-emerald-700 flex items-center gap-2">
                        <HeartPulse className="h-5 w-5" />
                        AI Heart Disease Predictor
                    </div>
                    <Button size="sm" variant="outline" onClick={handleLogout}>Logout</Button>
                </header>

                <main className="flex-1 p-8 overflow-y-auto">
                    <div className="max-w-7xl mx-auto">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    )
}
