import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

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

interface AssessmentDetailsProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    assessment: Assessment | null;
}

export function AssessmentDetails({ open, onOpenChange, assessment }: AssessmentDetailsProps) {
    if (!assessment) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Assessment Details</DialogTitle>
                    <DialogDescription>
                        Detailed view of the risk assessment recorded on {new Date(assessment.created_at).toLocaleDateString()}.
                    </DialogDescription>
                </DialogHeader>
                <div className="py-2 space-y-4">
                    <div className="text-center p-4 bg-slate-50 rounded-lg border">
                        <div className={cn("text-2xl font-bold mb-1", assessment.prediction === 1 ? "text-red-600" : "text-emerald-600")}>
                            {assessment.prediction === 1 ? "High Risk Detected" : "Low Risk Detected"}
                        </div>
                        <div className="text-sm text-gray-500">
                            Confidence: {(assessment.probability * 100).toFixed(1)}%
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm border-t pt-4">
                        {/* We can display some clinical data if available in the record */}
                        <div>
                            <span className="text-gray-500 block">ID</span>
                            <span className="font-mono text-xs">{assessment.id.slice(0, 8)}...</span>
                        </div>
                        <div>
                            <span className="text-gray-500 block">Date</span>
                            <span>{new Date(assessment.created_at).toLocaleDateString()}</span>
                        </div>
                        {/* Add more fields if they are returned by the SELECT * query */}
                        {assessment.age !== undefined && (
                            <div>
                                <span className="text-gray-500 block">Age</span>
                                <span>{assessment.age}</span>
                            </div>
                        )}
                        {assessment.sex !== undefined && (
                            <div>
                                <span className="text-gray-500 block">Sex</span>
                                <span>{assessment.sex === 1 ? "Male" : "Female"}</span>
                            </div>
                        )}
                    </div>
                </div>
                <div className="flex justify-end">
                    <Button onClick={() => onOpenChange(false)}>Close</Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
