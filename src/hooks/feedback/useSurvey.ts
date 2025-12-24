import { useState } from "react";
import { Question } from "@/types/question";

type Trainer = { id: string; name: string };
type StepType = "workshop" | "trainer" | "qualitative";

export const useSurvey = (trainers: Trainer[], questions: Question[]) => {
  // Categorize questions
  
  const workshopQuestions = questions.filter(q => q.analysisTag === "workshop");
  const trainerQuestions = questions.filter(q => q.analysisTag === "trainer");
  const qualitativeQuestions = questions.filter(q => q.analysisTag === "qualitative");

  const steps: StepType[] = ["workshop", "trainer", "qualitative"];

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [trainerIndex, setTrainerIndex] = useState(0);

  // Answers stored by question ID
  const [workshopAnswers, setWorkshopAnswers] = useState<{ [id: number]: number }>(
    Object.fromEntries(workshopQuestions.map(q => [q.id, 0]))
  );

  const [trainerAnswers, setTrainerAnswers] = useState<{ [trainerId: string]: { [id: number]: number } }>(
    {}
  );

  const [qualitative, setQualitative] = useState<{ [id: number]: string }>(
    Object.fromEntries(qualitativeQuestions.map(q => [q.id, ""]))
  );

  // Helpers
  const currentStep: StepType = steps[currentStepIndex];

  const handleWorkshopCircleClick = (questionId: number, value: number) => {
    setWorkshopAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const handleTrainerCircleClick = (trainerId: string, questionId: number, value: number) => {
    setTrainerAnswers(prev => {
      const existing = prev[trainerId] || Object.fromEntries(trainerQuestions.map(q => [q.id, 0]));
      return { ...prev, [trainerId]: { ...existing, [questionId]: value } };
    });
  };

  const handleQualitativeChange = (questionId: number, value: string) => {
  setQualitative(prev => ({
    ...prev,
    [questionId]: value
  }));
};


  const handleNextClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    next();
  };

  const next = () => {
    if (currentStep === "workshop") {
      setCurrentStepIndex(steps.indexOf("trainer"));
      setTrainerIndex(0);
    } else if (currentStep === "trainer") {
      if (trainerIndex < trainers.length - 1) setTrainerIndex(trainerIndex + 1);
      else setCurrentStepIndex(steps.indexOf("qualitative"));
    }
  };

  const back = () => {
    if (currentStep === "qualitative") setCurrentStepIndex(steps.indexOf("trainer"));
    else if (currentStep === "trainer") {
      if (trainerIndex > 0) setTrainerIndex(trainerIndex - 1);
      else setCurrentStepIndex(steps.indexOf("workshop"));
    }
  };

  const consolidateAnswers = () => ({
  workshopAnswers,
  trainerAnswers,
  qualitativeAnswers: qualitative,
});


 return {
  currentStep,
  trainerIndex,

  // Questions
  workshopQuestions,
  trainerQuestions,
  qualitativeQuestions,

  // Answers
  workshopAnswers,
  trainerAnswers,
  qualitative,

  // Setters (optional to keep)
  setWorkshopAnswers,
  setTrainerAnswers,
  setQualitative,

  // Navigation
  next,
  back,
  handleNextClick,

  // Handlers required by components
  handleWorkshopCircleClick,   // (questionId, value)
  handleTrainerCircleClick,    // (trainerId, questionId, value)
  handleQualitativeChange,     // (questionId, value)

  //answers
  consolidateAnswers
};

};
