// 📁 src/data/presetQuestions.ts
export interface Question {
  id: number;
  text: string;
  type: "text" | "textarea" | "rating";
  enabled: boolean;
  custom?: boolean;
}

export interface Section {
  title: string;
  icon: string;
  questions: Question[];
}

export interface Sections {
  [key: string]: Section;
}

export const PRESET_SECTIONS: Sections = {
  workshop: {
    title: "Workshop Feedback",
    icon: "📊",
    questions: [
      { id: 1, text: "The session met my expectations.", type: "rating", enabled: true },
      { id: 2, text: "The workshop content was relevant to my needs.", type: "rating", enabled: true },
    ],
  },
  trainer: {
    title: "Trainer Feedback",
    icon: "👨‍🏫",
    questions: [
      { id: 3, text: "The trainer explained concepts clearly.", type: "rating", enabled: true },
      { id: 4, text: "The trainer encouraged participation.", type: "rating", enabled: true },
    ],
  },
  qualitative: {
    title: "Open-Ended Feedback",
    icon: "💬",
    questions: [
      { id: 5, text: "What did you find most useful about the workshop?", type: "textarea", enabled: true },
      { id: 6, text: "What could be improved?", type: "textarea", enabled: true },
    ],
  },
};
