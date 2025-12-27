import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

export function Login() {
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    async function onSubmit(event: React.SyntheticEvent) {
        event.preventDefault();
        setIsLoading(true);

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        setIsLoading(false);

        if (error) {
            return toast.error("Login failed: " + error.message);
        }

        toast.success("Welcome back!");
        navigate("/dashboard");
    }

    return (
        <AuthLayout
            title="Login"
            subtitle="Enter your email to access your risk history"
        >
            <div className="grid gap-6">
                <form onSubmit={onSubmit}>
                    <div className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                placeholder="name@example.com"
                                type="email"
                                autoCapitalize="none"
                                autoComplete="email"
                                autoCorrect="off"
                                disabled={isLoading}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                disabled={isLoading}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <Button disabled={isLoading} className="bg-emerald-600 hover:bg-emerald-700">
                            {isLoading && (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            )}
                            Sign In with Email
                        </Button>
                    </div>
                </form>
                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-background px-2 text-muted-foreground">
                            Or
                        </span>
                    </div>
                </div>
                <div className="text-center text-sm">
                    Don&apos;t have an account?{" "}
                    <Link to="/register" className="underline hover:text-emerald-600">
                        Sign up
                    </Link>
                </div>
            </div>
        </AuthLayout>
    )
}
