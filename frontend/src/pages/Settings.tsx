
import {
    User,
    Bell,
    Trash2,
    Smartphone,
    Mail,
    Shield
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export function Settings() {
    const [userEmail, setUserEmail] = useState<string | null>("Loading...");

    useEffect(() => {
        async function getUser() {
            const { data: { user } } = await supabase.auth.getUser();
            setUserEmail(user?.email || "No email found");
        }
        getUser();
    }, []);

    const handleClearHistory = () => {
        toast.error("Clear history is disabled in this demo");
    };

    return (
        <div className="space-y-6 max-w-4xl">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-emerald-950">Settings</h1>
                <p className="text-muted-foreground mt-1">Manage your account settings and preferences.</p>
            </div>

            <div className="grid gap-6">
                {/* Profile Section */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <User className="h-6 w-6 text-emerald-600" />
                            <CardTitle>Profile Information</CardTitle>
                        </div>
                        <CardDescription>Manage your public profile and account details.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email Address</Label>
                                <div className="flex h-10 w-full rounded-md border border-input bg-muted px-3 py-2 text-sm text-muted-foreground ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                                    {userEmail}
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="role">Role</Label>
                                <div className="flex h-10 w-full rounded-md border border-input bg-muted px-3 py-2 text-sm text-muted-foreground">
                                    User
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Notifications Section */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <Bell className="h-6 w-6 text-emerald-600" />
                            <CardTitle>Notifications</CardTitle>
                        </div>
                        <CardDescription>Configure how you want to be notified.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex items-center justify-between space-x-2">
                            <div className="flex flex-col space-y-1">
                                <Label className="font-medium flex items-center gap-2">
                                    <Mail className="h-4 w-4" /> Email Notifications
                                </Label>
                                <span className="text-sm text-muted-foreground">Receive assessment results via email.</span>
                            </div>
                            <Switch defaultChecked />
                        </div>
                        <Separator />
                        <div className="flex items-center justify-between space-x-2">
                            <div className="flex flex-col space-y-1">
                                <Label className="font-medium flex items-center gap-2">
                                    <Smartphone className="h-4 w-4" /> Push Notifications
                                </Label>
                                <span className="text-sm text-muted-foreground">Receive push notifications for health tips.</span>
                            </div>
                            <Switch />
                        </div>
                    </CardContent>
                </Card>

                {/* Account Actions */}
                <Card className="border-red-100">
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <Shield className="h-6 w-6 text-red-600" />
                            <CardTitle className="text-red-950">Danger Zone</CardTitle>
                        </div>
                        <CardDescription>Irreversible actions for your account.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-between space-x-2 bg-red-50 p-4 rounded-lg border border-red-100">
                            <div>
                                <h4 className="font-medium text-red-900 flex items-center gap-2">
                                    <Trash2 className="h-4 w-4" /> Clear History
                                </h4>
                                <p className="text-sm text-red-700">Permanently delete all your past assessment records.</p>
                            </div>
                            <Button variant="destructive" onClick={handleClearHistory} size="sm">
                                Clear Data
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
