import { useEffect, useState } from "react";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";

export function HistoryChart() {
    const [data, setData] = useState<{ date: string; risk: number }[]>([]);

    useEffect(() => {
        async function fetchData() {
            const { data: assessments } = await supabase
                .from('assessments')
                .select('created_at, probability')
                .order('created_at', { ascending: true });

            if (assessments && assessments.length > 0) {
                const formattedData = assessments.map(item => ({
                    date: new Date(item.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
                    risk: Math.round(item.probability * 100)
                }));
                setData(formattedData);
            } else {
                // Fallback/Empty state data so chart isn't empty on first load if no data
                setData([]);
            }
        }
        fetchData();
    }, []);

    return (
        <Card className="col-span-4">
            <CardHeader>
                <CardTitle>Risk Trend Analysis</CardTitle>
                <CardDescription>
                    Your heart disease risk score over time.
                </CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
                <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                            <XAxis
                                dataKey="date"
                                stroke="#888888"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                            />
                            <YAxis
                                stroke="#888888"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={(value) => `${value}%`}
                                domain={[0, 100]}
                            />
                            <Tooltip
                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                            />
                            <Line
                                type="monotone"
                                dataKey="risk"
                                stroke="hsl(var(--primary))"
                                strokeWidth={2}
                                activeDot={{ r: 8 }}
                                style={
                                    {
                                        stroke: "hsl(var(--primary))",
                                    } as React.CSSProperties
                                }
                            />
                        </LineChart>
                    </ResponsiveContainer>
                    {data.length === 0 && (
                        <div className="absolute inset-0 flex items-center justify-center text-muted-foreground bg-white/50">
                            No data available yet
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}
