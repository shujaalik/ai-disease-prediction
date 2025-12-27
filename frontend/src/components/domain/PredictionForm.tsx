import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, HeartPulse } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

import { predictHeartDisease } from "@/lib/api";
import { supabase } from "@/lib/supabase";

const formSchema = z.object({
    age: z.coerce.number().min(1).max(120),
    sex: z.string(),
    cp: z.string(),
    trestbps: z.coerce.number().min(50).max(250),
    chol: z.coerce.number().min(100).max(600),
    fbs: z.string(),
    restecg: z.string(),
    thalach: z.coerce.number().min(50).max(220),
    exang: z.string(),
    oldpeak: z.coerce.number().min(0).max(10),
    slope: z.string(),
    ca: z.coerce.number().min(0).max(3),
    thal: z.string(),
});

export function PredictionForm({ onSuccess }: { onSuccess?: () => void }) {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [open, setOpen] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setIsAuthenticated(!!session);
        });
    }, []);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            age: 50,
            sex: "1",
            cp: "0",
            trestbps: 120,
            chol: 200,
            fbs: "0",
            restecg: "0",
            thalach: 150,
            exang: "0",
            oldpeak: 0,
            slope: "1",
            ca: 0,
            thal: "2",
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setLoading(true);
        try {
            // Convert string values to numbers for the API
            const payload = {
                ...values,
                sex: parseInt(values.sex),
                cp: parseInt(values.cp),
                fbs: parseInt(values.fbs),
                restecg: parseInt(values.restecg),
                exang: parseInt(values.exang),
                slope: parseInt(values.slope),
                thal: parseInt(values.thal),
            };

            const apiResponse = await predictHeartDisease(payload);

            // Normalize API response
            const predictionResult = {
                prediction: apiResponse.risk_label === "High Risk" ? 1 : 0,
                probability: apiResponse.risk_score
            };

            const { data: { session } } = await supabase.auth.getSession();

            if (session) {
                // Logged In: Save
                const { error: saveError } = await supabase.from('assessments').insert({
                    user_id: session.user.id,
                    ...payload,
                    prediction: predictionResult.prediction,
                    probability: predictionResult.probability,
                });

                if (saveError) {
                    console.error("Supabase Save Error:", saveError);
                    toast.error("Prediction made, but failed to save history.");
                } else {
                    toast.success("Prediction complete! Result saved to dashboard.");
                }

                // Show result dialog even for logged in users
                setResult(predictionResult);
                setOpen(true);
            } else {
                // Guest: Show Dialog
                setResult(predictionResult);
                setOpen(true);
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to get prediction via API. Ensure backend is running.");
        } finally {
            setLoading(false);
        }
    }

    const handleClose = () => {
        setOpen(false);
        if (onSuccess) {
            onSuccess();
        } else if (result) {
            // Only navigate if we actually have a result (logged in flow usually)
            // Check if we are already on dashboard to avoid redundant navigation
            if (!window.location.pathname.includes('dashboard')) {
                navigate("/dashboard");
            }
        }
    };

    return (
        <>
            <Card className="w-full max-w-2xl mx-auto shadow-lg border-emerald-100">
                <CardHeader className="bg-emerald-50/50 border-b border-emerald-100">
                    <div className="flex items-center gap-2 text-emerald-700 mb-2">
                        <HeartPulse className="w-6 h-6" />
                        <span className="font-semibold uppercase tracking-wider text-sm">AI Diagnostic Tool</span>
                    </div>
                    <CardTitle className="text-2xl font-bold text-gray-900">Heart Disease Risk Assessment</CardTitle>
                    <CardDescription>
                        Enter clinical parameters to generate a risk profile using our AI model.
                    </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                                {/* Age */}
                                <FormField
                                    control={form.control}
                                    name="age"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Age (Years)</FormLabel>
                                            <FormControl>
                                                <Input type="number" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Sex */}
                                <FormField
                                    control={form.control}
                                    name="sex"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Sex</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select sex" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="1">Male</SelectItem>
                                                    <SelectItem value="0">Female</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* CP - Chest Pain Type */}
                                <FormField
                                    control={form.control}
                                    name="cp"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Chest Pain Type (CP)</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select pain type" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="0">Typical Angina</SelectItem>
                                                    <SelectItem value="1">Atypical Angina</SelectItem>
                                                    <SelectItem value="2">Non-anginal Pain</SelectItem>
                                                    <SelectItem value="3">Asymptomatic</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Trestbps - Resting BP */}
                                <FormField
                                    control={form.control}
                                    name="trestbps"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Resting Blood Pressure (mm Hg)</FormLabel>
                                            <FormControl>
                                                <Input type="number" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Chol - Cholesterol */}
                                <FormField
                                    control={form.control}
                                    name="chol"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Serum Cholesterol (mg/dl)</FormLabel>
                                            <FormControl>
                                                <Input type="number" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* FBS - Fasting Blood Sugar */}
                                <FormField
                                    control={form.control}
                                    name="fbs"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Fasting Blood Sugar ({">"} 120 mg/dl)</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select..." />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="1">True</SelectItem>
                                                    <SelectItem value="0">False</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* RestECG */}
                                <FormField
                                    control={form.control}
                                    name="restecg"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Resting ECG Results</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select..." />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="0">Normal</SelectItem>
                                                    <SelectItem value="1">ST-T Wave Abnormality</SelectItem>
                                                    <SelectItem value="2">Left Ventricular Hypertrophy</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Thalach - Max Heart Rate */}
                                <FormField
                                    control={form.control}
                                    name="thalach"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Max Heart Rate Achieved</FormLabel>
                                            <FormControl>
                                                <Input type="number" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Exang - Exercise Induced Angina */}
                                <FormField
                                    control={form.control}
                                    name="exang"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Exercise Induced Angina</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select..." />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="1">Yes</SelectItem>
                                                    <SelectItem value="0">No</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Oldpeak - ST Depression */}
                                <FormField
                                    control={form.control}
                                    name="oldpeak"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>ST Depression (Oldpeak)</FormLabel>
                                            <FormControl>
                                                <Input type="number" step="0.1" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Slope */}
                                <FormField
                                    control={form.control}
                                    name="slope"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Slope of Peak Exercise ST Segment</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select..." />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="0">Upsloping</SelectItem>
                                                    <SelectItem value="1">Flat</SelectItem>
                                                    <SelectItem value="2">Downsloping</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* CA - Number of Major Vessels */}
                                <FormField
                                    control={form.control}
                                    name="ca"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Major Vessels (0-3)</FormLabel>
                                            <FormControl>
                                                <Input type="number" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Thal */}
                                <FormField
                                    control={form.control}
                                    name="thal"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Thalassemia</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select..." />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="1">Normal</SelectItem>
                                                    <SelectItem value="2">Fixed Defect</SelectItem>
                                                    <SelectItem value="3">Reversable Defect</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                            </div>

                            <div className="pt-4">
                                <Button type="submit" size="lg" className="w-full bg-emerald-600 hover:bg-emerald-700" disabled={loading}>
                                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    {loading ? "Analyzing..." : "Generate Risk Assessment"}
                                </Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>

                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Assessment Result</DialogTitle>
                            <DialogDescription>
                                Analysis based on the provided clinical parameters.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="py-4">
                            {result && (
                                <div className="space-y-4 text-center">
                                    <div className={cn("text-4xl font-bold", result.prediction === 1 ? "text-red-600" : "text-emerald-600")}>
                                        {result.prediction === 1 ? "Positive (High Risk)" : "Negative (Low Risk)"}
                                    </div>
                                    <p className="text-gray-500">
                                        {result.prediction === 1
                                            ? "The model has detected patterns associated with heart disease. Please consult a cardiologist for further testing."
                                            : "The model shows no immediate signs of heart disease based on these parameters."}
                                    </p>
                                    <div className="text-xs text-gray-400 mt-4">
                                        Probability: {result.probability ? (result.probability * 100).toFixed(1) + "%" : "N/A"}
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="flex justify-end gap-2">
                            {onSuccess ? (
                                <Button onClick={handleClose}>Done</Button>
                            ) : isAuthenticated ? (
                                <Button onClick={handleClose}>Go to Dashboard</Button>
                            ) : (
                                <>
                                    <Button variant="outline" onClick={() => setOpen(false)}>Close</Button>
                                    <Button onClick={() => navigate("/register")}>Create Account to Save</Button>
                                </>
                            )}
                        </div>
                    </DialogContent>
                </Dialog>
            </Card>
        </>
    );
}
