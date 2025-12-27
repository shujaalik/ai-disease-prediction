import { useEffect, useState } from "react";
import { Outlet, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { HeartPulse, LayoutDashboard } from "lucide-react";
import { supabase } from "@/lib/supabase";
import type { Session } from "@supabase/supabase-js";

export function PublicLayout() {
    const [session, setSession] = useState<Session | null>(null);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
        });

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });

        return () => subscription.unsubscribe();
    }, []);

    return (
        <div className="min-h-screen bg-slate-50 font-sans">
            <header className="border-b bg-white sticky top-0 z-50">
                <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-2 font-bold text-xl text-emerald-700">
                        <HeartPulse className="h-6 w-6" />
                        <span>AI Heart Disease Predictor</span>
                    </div>
                    <nav className="flex items-center gap-4">
                        {session ? (
                            <Link to="/dashboard">
                                <Button variant="default" className="bg-emerald-600 hover:bg-emerald-700 flex items-center gap-2">
                                    <LayoutDashboard className="h-4 w-4" />
                                    Go to Dashboard
                                </Button>
                            </Link>
                        ) : (
                            <>
                                <Link to="/login" className="text-sm font-medium hover:text-emerald-600">Login</Link>
                                <Link to="/register">
                                    <Button variant="default" className="bg-emerald-600 hover:bg-emerald-700">
                                        Get Started
                                    </Button>
                                </Link>
                            </>
                        )}
                    </nav>
                </div>
            </header>
            <main>
                <Outlet />
            </main>
            <footer className="border-t bg-white py-8 mt-12">
                <div className="container mx-auto px-4 text-center text-sm text-slate-500">
                    &copy; 2025 AI Heart Disease Predictor.
                </div>
            </footer>
        </div>
    )
}
