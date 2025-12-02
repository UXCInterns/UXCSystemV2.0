import { Question } from "@/types/question";

export const FIXED_QUESTIONS: Question[] = [
    {
        id: 1,
        text: "I believe that the intended outcomes of this learning experience have been met.",
        type: "rating",
        required: true,
        enabled: true,
        analysisTag: "workshop",
    },
    // {
    //     id: 2,
    //     text: "I was engaged during the learning experience.",
    //     type: "rating",
    //     required: true,
    //     enabled: true,
    //     analysisTag: "workshop",
    // },
    // {
    //     id: 3,
    //     text: "I acquired useful knowledge, skills, or insights that will support me in my work.",
    //     type: "rating",
    //     required: true,
    //     enabled: true,
    //     analysisTag: "workshop",
    // },
    // {
    //     id: 4,
    //     text: "I am able to apply what I have learnt.",
    //     type: "rating",
    //     required: true,
    //     enabled: true,
    //     analysisTag: "workshop",
    // },
    // {
    //     id: 5,
    //     text: "I am satisfied with the overall quality of the session.",
    //     type: "rating",
    //     required: true,
    //     enabled: true,
    //     analysisTag: "workshop",
    // },
    // {
    //     id: 6,
    //     text: "On the whole, I am satisfied with the learning experience (e.g. programme / event / consultancy).",
    //     type: "rating",
    //     required: true,
    //     enabled: true,
    //     analysisTag: "workshop",
    // },

    // Trainer-specific question with placeholder
    {
        id: 7,
        text: "I felt that %[TrainerName]% was effective in helping me learn.",
        type: "rating",
        required: true,
        enabled: true,
        analysisTag: "trainer",
    },

    // Open-ended questions
    {
        id: 8,
        text: "What were the best feature(s) of the learning experience (e.g. programme / event / consultancy)?",
        type: "text",
        required: true,
        enabled: true,
        analysisTag: "qualitative",
    },
    // {
    //     id: 9,
    //     text: "How could the learning experience (e.g. programme / event / consultancy) be improved?",
    //     type: "text",
    //     required: true,
    //     enabled: true,
    //     analysisTag: "qualitative",
    // }
];
