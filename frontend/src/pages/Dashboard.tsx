import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { HistoryChart } from "@/components/domain/HistoryChart";
import { RecentHistory } from "@/components/domain/RecentHistory";
import { PredictionForm } from "@/components/domain/PredictionForm";
import { Activity, Users, AlertTriangle, PlusCircle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { supabase } from "@/lib/supabase";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface DashboardStats {
    total: number;
    avgRisk: string;
    lastCheckup: string;
}

export function Dashboard() {
    const [open, setOpen] = useState(false);
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [date, setDate] = useState<Date | undefined>(new Date());

    useEffect(() => {
        async function fetchStats() {
            const { data, error } = await supabase
                .from('assessments')
                .select('*')
                .order('created_at', { ascending: false });

            if (!error && data) {
                // Calculate Stats
                const total = data.length;

                let avgRisk = "N/A";
                let lastCheckup = "Never";

                if (total > 0) {
                    const highRiskCount = data.filter(i => i.prediction === 1).length;
                    const riskRatio = highRiskCount / total;
                    avgRisk = riskRatio > 0.5 ? "High" : "Low";

                    const lastDate = new Date(data[0].created_at);
                    const diffDays = Math.floor((new Date().getTime() - lastDate.getTime()) / (1000 * 3600 * 24));
                    lastCheckup = diffDays === 0 ? "Today" : `${diffDays} days ago`;
                }

                setStats({ total, avgRisk, lastCheckup });
            }
            setLoading(false);
        }
        fetchStats();
    }, [open]); // Refresh stats when dialog closes (after new prediction)

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Dashboard</h1>
                    <p className="text-muted-foreground mt-1">Overview of your heart health status and history.</p>
                </div>
                <div className="flex items-center gap-3">


                    <Dialog open={open} onOpenChange={setOpen}>
                        <DialogTrigger asChild>
                            <Button className="bg-emerald-600 hover:bg-emerald-700">
                                <PlusCircle className="mr-2 h-4 w-4" />
                                New Assessment
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                                <DialogTitle>New Heart Risk Assessment</DialogTitle>
                                <DialogDescription>
                                    Fill in the clinical parameters below to generate a new risk analysis.
                                </DialogDescription>
                            </DialogHeader>
                            <PredictionForm onSuccess={() => setOpen(false)} />
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-3">
                {loading ? (
                    Array(3).fill(0).map((_, i) => (
                        <Card key={i}>
                            <CardHeader><Skeleton className="h-4 w-[100px]" /></CardHeader>
                            <CardContent><Skeleton className="h-8 w-[50px] mb-2" /><Skeleton className="h-3 w-[80px]" /></CardContent>
                        </Card>
                    ))
                ) : (
                    <>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total Assessments</CardTitle>
                                <Activity className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stats?.total ?? 0}</div>
                                <p className="text-xs text-muted-foreground">Lifetime checks</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Average Risk Profile</CardTitle>
                                <Users className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className={`text-2xl font-bold ${stats?.avgRisk === 'High' ? 'text-destructive' : 'text-emerald-600'}`}>
                                    {stats?.avgRisk}
                                </div>
                                <p className="text-xs text-muted-foreground">Based on historical data</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Last Checkup</CardTitle>
                                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stats?.lastCheckup}</div>
                                <p className="text-xs text-muted-foreground">Keep monitoring regularly</p>
                            </CardContent>
                        </Card>
                    </>
                )}
            </div>

            {/* Content Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <HistoryChart />
                <div className="col-span-3">
                    <Card className="h-full">
                        <CardHeader>
                            <CardTitle>Recent Activity</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <RecentHistory />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
