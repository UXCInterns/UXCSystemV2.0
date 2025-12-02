export interface Question {
  id: number;
  text: string;
  type: "rating" | "text" | "multiple_choice";
  required: boolean;
  enabled: boolean;
  analysisTag?: "workshop" | "trainer" | "qualitative"; // optional, for analysis grouping
}
