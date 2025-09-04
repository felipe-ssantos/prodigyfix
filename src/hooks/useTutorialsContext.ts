import { useContext } from "react";
import {
  TutorialContext,
  TutorialContextType,
} from "../contexts/TutorialContext";

export const useTutorials = (): TutorialContextType => {
  const context = useContext(TutorialContext);
  if (!context) {
    throw new Error("useTutorials must be used within a TutorialProvider");
  }
  return context;
};
