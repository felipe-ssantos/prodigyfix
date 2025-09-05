import { useContext } from "react";
import {
  TutorialContext,
  TutorialContextType,
} from "../contexts/TutorialContext";

export const useTutorials = (): TutorialContextType => {
  const context = useContext(TutorialContext);
  if (context === undefined) {
    throw new Error(
      "useTutorials deve ser usado dentro de um TutorialProvider"
    );
  }
  return context;
};
