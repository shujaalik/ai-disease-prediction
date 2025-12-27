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
import { Loader2 } from "lucide-react";
import { AssessmentDetails } from "./AssessmentDetails";

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

export function RecentHistory() {
    const [history, setHistory] = useState<Assessment[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedAssessment, setSelectedAssessment] = useState<Assessment | null>(null);
    const [detailsOpen, setDetailsOpen] = useState(false);

    useEffect(() => {
        async function fetchHistory() {
            const { data, error } = await supabase
                .from('assessments')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(5);

            if (!error && data) {
                setHistory(data);
            }
            setLoading(false);
        }

        fetchHistory();
    }, []);

    const handleViewDetails = (assessment: Assessment) => {
        setSelectedAssessment(assessment);
        setDetailsOpen(true);
    };

    if (loading) {
        return <div className="flex justify-center p-4"><Loader2 className="animate-spin h-6 w-6 text-emerald-600" /></div>;
    }

    return (
        <div className="rounded-md border bg-white">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Risk Level</TableHead>
                        <TableHead>Confidence</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {history.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                                No assessments found. Run a prediction to see it here.
                            </TableCell>
                        </TableRow>
                    ) : (
                        history.map((item) => (
                            <TableRow key={item.id}>
                                <TableCell className="font-medium">
                                    {new Date(item.created_at).toLocaleDateString()}
                                </TableCell>
                                <TableCell>
                                    <Badge
                                        variant={item.prediction === 1 ? "destructive" : "secondary"}
                                        className={item.prediction === 0 ? "bg-emerald-100 text-emerald-800 border-emerald-200" : ""}
                                    >
                                        {item.prediction === 1 ? "High Risk" : "Low Risk"}
                                    </Badge>
                                </TableCell>
                                <TableCell>{(item.probability * 100).toFixed(1)}%</TableCell>
                                <TableCell
                                    className="text-right text-emerald-600 cursor-pointer hover:underline"
                                    onClick={() => handleViewDetails(item)}
                                >
                                    View Details
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>

            <AssessmentDetails
                open={detailsOpen}
                onOpenChange={setDetailsOpen}
                assessment={selectedAssessment}
            />
        </div>
    )
}
