// types
export type ColumnType = {
  title: string;
  count?: number;
  status: string;
  cards: {
    id: string;
    title: string;
    description: string;
    date: string;
    status: string;
    priority: string;
    avatars: string[];
    commentsCount: number;
  }[];
};

export const initialProjectBoards: Record<string, ColumnType[]> = {
  "1": [ {
    title: "To Do",
    count: 3,
    status: "todo",
    cards: [

    ],
  },
  {
    title: "In Progress",
    count: 2,
    status: "inprogress",
    cards: [

    ],
  },
  {
    title: "Review",
    count: 1,
    status: "review",
    cards: [

    ],
  },
  {
    title: "Completed",
    count: 1,
    status: "completed",
    cards: [

    ],
  },],
  "2": [{
    title: "To Do",
    count: 3,
    status: "todo",
    cards: [

    ],
  },
  {
    title: "In Progress",
    count: 2,
    status: "inprogress",
    cards: [

    ],
  },
  {
    title: "Review",
    count: 1,
    status: "review",
    cards: [

    ],
  },
  {
    title: "Completed",
    count: 1,
    status: "completed",
    cards: [

    ],
  },],
  "3": [{
    title: "To Do",
    count: 3,
    status: "todo",
    cards: [

    ],
  },
  {
    title: "In Progress",
    count: 2,
    status: "inprogress",
    cards: [

    ],
  },
  {
    title: "Review",
    count: 1,
    status: "review",
    cards: [

    ],
  },
  {
    title: "Completed",
    count: 1,
    status: "completed",
    cards: [

    ],
  },],
  "4": [{
    title: "To Do",
    count: 3,
    status: "todo",
    cards: [

    ],
  },
  {
    title: "In Progress",
    count: 2,
    status: "inprogress",
    cards: [

    ],
  },
  {
    title: "Review",
    count: 1,
    status: "review",
    cards: [

    ],
  },
  {
    title: "Completed",
    count: 1,
    status: "completed",
    cards: [

    ],
  },],
  "5": [{
    title: "To Do",
    count: 3,
    status: "todo",
    cards: [

    ],
  },
  {
    title: "In Progress",
    count: 2,
    status: "inprogress",
    cards: [

    ],
  },
  {
    title: "Review",
    count: 1,
    status: "review",
    cards: [

    ],
  },
  {
    title: "Completed",
    count: 1,
    status: "completed",
    cards: [

    ],
  },],
  "6": [{
    title: "To Do",
    count: 3,
    status: "todo",
    cards: [
      {
        id: "todo-1",
        title: "Work In Progress (WIP) Dashboard",
        description: "Design and prototype the WIP dashboard with charts and summaries.",
        date: "Jan 8, 2027",
        status: "todo",
        priority: "High",
        avatars: [
          "../../../images/user/user-01.jpg",
          "../../../images/user/user-02.jpg",
          "../../../images/user/user-21.jpg",
          "../../../images/user/user-04.jpg",
        ],
        commentsCount: 4,
      },
      {
        id: "todo-2",
        title: "Finish user onboarding",
        description: "Complete welcome tour and integration checklist for new users.",
        date: "Jan 8, 2027",
        status: "todo",
        priority: "Low",
        avatars: [
          "../../../images/user/user-01.jpg",
          "../../../images/user/user-12.jpg"
        ],
        commentsCount: 4,
      },
    ],
  },
  {
    title: "In Progress",
    count: 2,
    status: "inprogress",
    cards: [
      {
        id: "inprogress-1",
        title: "Redesign pricing page",
        description: "Revamp layout and highlight benefits of each pricing tier.",
        date: "Jan 8, 2027",
        status: "inprogress",
        priority: "High",
        avatars: [
          "../../../images/user/user-10.jpg",
          "../../../images/user/user-09.jpg",
          "../../../images/user/user-08.jpg",
        ],
        commentsCount: 4,
      },
    ],
  },
  {
    title: "Review",
    count: 1,
    status: "review",
    cards: [

    ],
  },
  {
    title: "Completed",
    count: 1,
    status: "completed",
    cards: [

    ],
  },],
};
