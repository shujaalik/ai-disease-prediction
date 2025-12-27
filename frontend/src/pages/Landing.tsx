import { PredictionForm } from "@/components/domain/PredictionForm";

export function Landing() {
    return (
        <div className="container mx-auto px-4 py-12">
            <div className="text-center mb-12 space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-emerald-100 text-emerald-800 hover:bg-emerald-200 mb-4">
                    Beta Release 1.0
                </div>
                <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-900">
                    AI-Powered <span className="text-emerald-600">Heart Screening</span>
                </h1>
                <p className="max-w-2xl mx-auto text-lg text-slate-600">
                    Early detection saves lives. Use our advanced machine learning model to assess your risk factors in seconds. Medical-grade accuracy, instant results.
                </p>
            </div>

            <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
                <PredictionForm />
            </div>
        </div>
    )
}
