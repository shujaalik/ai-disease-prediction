import { useEffect, useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/lib/supabase";
import { Loader2, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AssessmentDetails } from "@/components/domain/AssessmentDetails";

interface Assessment {
    id: string;
    created_at: string;
    prediction: number;
    probability: number;
    age?: number;
    sex?: number;
    cp?: number;
    trestbps?: number;
    chol?: number;
    fbs?: number;
    restecg?: number;
    thalach?: number;
    exang?: number;
    oldpeak?: number;
}

export function History() {
    const [history, setHistory] = useState<Assessment[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedAssessment, setSelectedAssessment] = useState<Assessment | null>(null);
    const [detailsOpen, setDetailsOpen] = useState(false);

    useEffect(() => {
        async function fetchHistory() {
            // Fetch all records, or a reasonably large limit for now
            const { data, error } = await supabase
                .from('assessments')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(50);

            if (!error && data) {
                setHistory(data);
            }
            setLoading(false);
        }

        fetchHistory();
    }, []);

    const filteredHistory = history.filter(item =>
        // Simple search by ID or date string for now
        item.id.includes(searchTerm) ||
        new Date(item.created_at).toLocaleDateString().includes(searchTerm)
    );

    const handleViewDetails = (assessment: Assessment) => {
        setSelectedAssessment(assessment);
        setDetailsOpen(true);
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
                <Loader2 className="animate-spin h-8 w-8 text-emerald-600" />
                <p className="text-muted-foreground">Loading history...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-emerald-950">Assessment History</h1>
                    <p className="text-muted-foreground mt-1">View past predictions and results.</p>
                </div>
                {/* Search / Filter placeholder */}
                <div className="flex w-full sm:w-auto items-center space-x-2">
                    <div className="relative w-full sm:w-64">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Search by date..."
                            className="pl-8"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            <div className="rounded-md border bg-white shadow-sm">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Date & Time</TableHead>
                            <TableHead>Assessment ID</TableHead>
                            <TableHead>Risk Level</TableHead>
                            <TableHead>Confidence</TableHead>
                            <TableHead className="text-right">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredHistory.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-12 text-muted-foreground">
                                    {searchTerm ? "No matching records found." : "No assessments found history."}
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredHistory.map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell className="font-medium">
                                        <div className="flex flex-col">
                                            <span>{new Date(item.created_at).toLocaleDateString()}</span>
                                            <span className="text-xs text-muted-foreground">{new Date(item.created_at).toLocaleTimeString()}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="font-mono text-xs text-muted-foreground">
                                        {item.id.slice(0, 8)}...
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            variant={item.prediction === 1 ? "destructive" : "secondary"}
                                            className={item.prediction === 0 ? "bg-emerald-100 text-emerald-800 border-emerald-200" : ""}
                                        >
                                            {item.prediction === 1 ? "High Risk" : "Low Risk"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <span className={cn("font-medium", item.probability > 0.8 ? "text-emerald-700" : "")}>
                                            {(item.probability * 100).toFixed(1)}%
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                                            onClick={() => handleViewDetails(item)}
                                        >
                                            View Details
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            <div className="text-xs text-center text-muted-foreground mt-4">
                Showing recent 50 assessments.
            </div>

            <AssessmentDetails
                open={detailsOpen}
                onOpenChange={setDetailsOpen}
                assessment={selectedAssessment}
            />
        </div>
    );
}
