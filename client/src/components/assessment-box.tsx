import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Brain, LineChart, Lightbulb } from "lucide-react";

interface AssessmentBoxProps {
  type: "problem" | "prediction" | "solution";
  title: string;
  description: string;
  onClick: () => void;
  isActive: boolean;
}

export function AssessmentBox({ type, title, description, onClick, isActive }: AssessmentBoxProps) {
  const icons = {
    problem: Brain,
    prediction: LineChart,
    solution: Lightbulb
  };

  const Icon = icons[type];

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      animate={{ 
        boxShadow: isActive 
          ? "0 0 25px rgba(100, 149, 237, 0.3)" 
          : "0 0 5px rgba(100, 149, 237, 0)"
      }}
    >
      <Card 
        className={`cursor-pointer transition-colors ${
          isActive ? "bg-primary/10 border-primary" : "hover:bg-primary/5"
        }`}
        onClick={onClick}
      >
        <CardHeader className="space-y-1">
          <CardTitle className="flex items-center gap-2">
            <Icon className={`w-5 h-5 ${isActive ? "text-primary" : "text-muted-foreground"}`} />
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">{description}</p>
        </CardContent>
      </Card>
    </motion.div>
  );
}
