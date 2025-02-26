import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { AssessmentBox } from "@/components/assessment-box";
import { NeuralBackground } from "@/components/neural-background";
import { motion } from "framer-motion";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";

type AssessmentStep = "none" | "problem" | "prediction" | "solution";

export default function HomePage() {
  const { user, logoutMutation } = useAuth();
  const [currentStep, setCurrentStep] = useState<AssessmentStep>("none");
  const [problem, setProblem] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const handleAnalyze = () => {
    setIsAnalyzing(true);
    // Simulate AI analysis
    setTimeout(() => {
      if (currentStep === "problem") {
        setResult("Based on the analysis, there's a 78% chance this is a critical vulnerability affecting system authentication...");
        setCurrentStep("prediction");
      } else if (currentStep === "prediction") {
        setResult("Recommended actions: 1. Update authentication middleware 2. Implement rate limiting 3. Add input validation...");
        setCurrentStep("solution");
      }
      setIsAnalyzing(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <NeuralBackground />

      <header className="p-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-primary">
            Welcome, {user?.username}
          </h1>
          <Button variant="outline" onClick={() => logoutMutation.mutate()}>
            Logout
          </Button>
        </div>
      </header>

      <div className="flex-grow flex flex-col justify-end p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto w-full space-y-8"
        >
          {currentStep === "problem" && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="space-y-4"
            >
              <Textarea
                placeholder="Describe the security vulnerability or concern..."
                className="min-h-[200px] bg-background/80 backdrop-blur"
                value={problem}
                onChange={(e) => setProblem(e.target.value)}
              />
              <Button 
                onClick={handleAnalyze}
                disabled={!problem || isAnalyzing}
                className="w-full"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  "Analyze Vulnerability"
                )}
              </Button>
            </motion.div>
          )}

          {(currentStep === "prediction" || currentStep === "solution") && result && (
            <Alert className="bg-background/80 backdrop-blur">
              <AlertDescription className="whitespace-pre-line">
                {result}
              </AlertDescription>
            </Alert>
          )}

          {currentStep === "prediction" && (
            <Button 
              onClick={handleAnalyze}
              disabled={isAnalyzing}
              className="w-full"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating Solutions...
                </>
              ) : (
                "Get Solutions"
              )}
            </Button>
          )}

          <div className="grid md:grid-cols-3 gap-6">
            <AssessmentBox
              type="problem"
              title="Describe Problem"
              description="Detail the security concern or vulnerability you've identified"
              onClick={() => setCurrentStep(currentStep === "problem" ? "none" : "problem")}
              isActive={currentStep === "problem"}
            />
            <AssessmentBox
              type="prediction"
              title="AI Prediction"
              description="Get AI-powered analysis and risk assessment"
              onClick={() => {}}
              isActive={currentStep === "prediction"}
            />
            <AssessmentBox
              type="solution"
              title="Solutions"
              description="Receive detailed mitigation strategies and recommendations"
              onClick={() => {}}
              isActive={currentStep === "solution"}
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
}