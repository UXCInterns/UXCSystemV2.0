interface Visit {
  id: number;
  projectName: string;
  projectManager: {
    image: string;
    name: string;
  };
  projectLead: {
    image: string;
    name: string;
  };
  coreTeam: {
    images: string[];
  };
  supportTeam: {
    images: string[];
  };
  startDate: string;
  endDate: string;
  priority: "Low" | "Medium" | "High" | "Urgent";
  status: "Pending" | "In Progress" | "Completed" | "Aborted";
}

const initialData: Visit[] = [
  {
    id: 1,
    projectName: "Acme Corp",
    projectManager: {
      image: "/images/user/user-01.jpg",
      name: "Lindsey Curtis",
    },
    projectLead: {
      image: "/images/user/user-02.jpg",
      name: "Nathan Wong",
    },
    coreTeam: {
      images: ["/images/user/user-03.jpg", "/images/user/user-04.jpg", "/images/user/user-05.jpg"],
    },
    supportTeam: {
      images: ["/images/user/user-06.jpg", "/images/user/user-07.jpg", "/images/user/user-08.jpg"],
    },
    startDate: "15 January 2024",
    endDate: "15 June 2024",
    priority: "High",
    status: "In Progress",
  },
  {
    id: 2,
    projectName: "Globex Inc.",
    projectManager: {
      image: "/images/user/user-09.jpg",
      name: "Sophia Lee",
    },
    projectLead: {
      image: "/images/user/user-10.jpg",
      name: "Daniel Tan",
    },
    coreTeam: {
      images: ["/images/user/user-11.jpg", "/images/user/user-12.jpg", "/images/user/user-13.jpg"],
    },
    supportTeam: {
      images: ["/images/user/user-14.jpg", "/images/user/user-15.jpg", "/images/user/user-16.jpg"],
    },
    startDate: "1 October 2023",
    endDate: "30 March 2024",
    priority: "Urgent",
    status: "Completed",
  },
  {
    id: 3,
    projectName: "Wayne Enterprises",
    projectManager: {
      image: "/images/user/user-17.jpg",
      name: "Bruce Wayne",
    },
    projectLead: {
      image: "/images/user/user-18.jpg",
      name: "Rachel Dawes",
    },
    coreTeam: {
      images: ["/images/user/user-19.jpg", "/images/user/user-20.jpg", "/images/user/user-21.jpg"],
    },
    supportTeam: {
      images: ["/images/user/user-22.jpg", "/images/user/user-23.jpg", "/images/user/user-24.jpg"],
    },
    startDate: "10 May 2024",
    endDate: "20 November 2024",
    priority: "High",
    status: "In Progress",
  },
  {
    id: 4,
    projectName: "Stark Industries",
    projectManager: {
      image: "/images/user/user-25.jpg",
      name: "Tony Stark",
    },
    projectLead: {
      image: "/images/user/user-26.jpg",
      name: "Pepper Potts",
    },
    coreTeam: {
      images: ["/images/user/user-27.jpg", "/images/user/user-28.jpg", "/images/user/user-29.jpg"],
    },
    supportTeam: {
      images: ["/images/user/user-30.jpg", "/images/user/user-01.jpg", "/images/user/user-02.jpg"],
    },
    startDate: "1 July 2023",
    endDate: "31 January 2024",
    priority: "Low",
    status: "Completed",
  },
  {
    id: 5,
    projectName: "Umbrella Corp",
    projectManager: {
      image: "/images/user/user-03.jpg",
      name: "Alice Abernathy",
    },
    projectLead: {
      image: "/images/user/user-04.jpg",
      name: "Dr. Marcus",
    },
    coreTeam: {
      images: ["/images/user/user-05.jpg", "/images/user/user-06.jpg", "/images/user/user-07.jpg"],
    },
    supportTeam: {
      images: ["/images/user/user-08.jpg", "/images/user/user-09.jpg", "/images/user/user-10.jpg"],
    },
    startDate: "20 February 2024",
    endDate: "10 September 2024",
    priority: "Medium",
    status: "Aborted",
  },
  {
    id: 6,
    projectName: "Black Mesa",
    projectManager: {
      image: "/images/user/user-11.jpg",
      name: "Gordon Freeman",
    },
    projectLead: {
      image: "/images/user/user-12.jpg",
      name: "Isaac Kleiner",
    },
    coreTeam: {
      images: ["/images/user/user-13.jpg", "/images/user/user-14.jpg", "/images/user/user-15.jpg"],
    },
    supportTeam: {
      images: ["/images/user/user-16.jpg", "/images/user/user-17.jpg", "/images/user/user-18.jpg"],
    },
    startDate: "5 January 2025",
    endDate: "25 July 2025",
    priority: "Urgent",
    status: "In Progress",
  },
  {
    id: 7,
    projectName: "Cyberdyne Systems",
    projectManager: {
      image: "/images/user/user-19.jpg",
      name: "Miles Dyson",
    },
    projectLead: {
      image: "/images/user/user-20.jpg",
      name: "Sarah Connor",
    },
    coreTeam: {
      images: ["/images/user/user-21.jpg", "/images/user/user-22.jpg", "/images/user/user-23.jpg"],
    },
    supportTeam: {
      images: ["/images/user/user-24.jpg", "/images/user/user-25.jpg", "/images/user/user-26.jpg"],
    },
    startDate: "1 March 2025",
    endDate: "30 October 2025",
    priority: "High",
    status: "Pending",
  },
  {
    id: 8,
    projectName: "Oscorp Technologies",
    projectManager: {
      image: "/images/user/user-27.jpg",
      name: "Norman Osborn",
    },
    projectLead: {
      image: "/images/user/user-28.jpg",
      name: "Dr. Curt Connors",
    },
    coreTeam: {
      images: ["/images/user/user-29.jpg", "/images/user/user-30.jpg", "/images/user/user-01.jpg"],
    },
    supportTeam: {
      images: ["/images/user/user-02.jpg", "/images/user/user-03.jpg", "/images/user/user-04.jpg"],
    },
    startDate: "15 April 2025",
    endDate: "20 December 2025",
    priority: "Medium",
    status: "Pending",
  },
  {
    id: 9,
    projectName: "InGen Corporation",
    projectManager: {
      image: "/images/user/user-05.jpg",
      name: "John Hammond",
    },
    projectLead: {
      image: "/images/user/user-06.jpg",
      name: "Dr. Alan Grant",
    },
    coreTeam: {
      images: ["/images/user/user-07.jpg", "/images/user/user-08.jpg", "/images/user/user-09.jpg"],
    },
    supportTeam: {
      images: ["/images/user/user-10.jpg", "/images/user/user-11.jpg", "/images/user/user-12.jpg"],
    },
    startDate: "10 June 2024",
    endDate: "5 February 2025",
    priority: "Low",
    status: "Completed",
  },
  {
    id: 10,
    projectName: "Weyland-Yutani Corp",
    projectManager: {
      image: "/images/user/user-13.jpg",
      name: "Carter Burke",
    },
    projectLead: {
      image: "/images/user/user-14.jpg",
      name: "Ellen Ripley",
    },
    coreTeam: {
      images: ["/images/user/user-15.jpg", "/images/user/user-16.jpg", "/images/user/user-17.jpg"],
    },
    supportTeam: {
      images: ["/images/user/user-18.jpg", "/images/user/user-19.jpg", "/images/user/user-20.jpg"],
    },
    startDate: "22 August 2024",
    endDate: "18 May 2025",
    priority: "Urgent",
    status: "In Progress",
  },
  {
    id: 11,
    projectName: "Aperture Science",
    projectManager: {
      image: "/images/user/user-21.jpg",
      name: "Cave Johnson",
    },
    projectLead: {
      image: "/images/user/user-22.jpg",
      name: "Caroline GLaDOS",
    },
    coreTeam: {
      images: ["/images/user/user-23.jpg", "/images/user/user-24.jpg", "/images/user/user-25.jpg"],
    },
    supportTeam: {
      images: ["/images/user/user-26.jpg", "/images/user/user-27.jpg", "/images/user/user-28.jpg"],
    },
    startDate: "8 September 2025",
    endDate: "12 March 2026",
    priority: "Medium",
    status: "Pending",
  },
  {
    id: 12,
    projectName: "LexCorp",
    projectManager: {
      image: "/images/user/user-29.jpg",
      name: "Lex Luthor",
    },
    projectLead: {
      image: "/images/user/user-30.jpg",
      name: "Mercy Graves",
    },
    coreTeam: {
      images: ["/images/user/user-01.jpg", "/images/user/user-02.jpg", "/images/user/user-03.jpg"],
    },
    supportTeam: {
      images: ["/images/user/user-04.jpg", "/images/user/user-05.jpg", "/images/user/user-06.jpg"],
    },
    startDate: "3 December 2024",
    endDate: "8 August 2025",
    priority: "High",
    status: "Aborted",
  },
  {
    id: 13,
    projectName: "Massive Dynamic",
    projectManager: {
      image: "/images/user/user-07.jpg",
      name: "William Bell",
    },
    projectLead: {
      image: "/images/user/user-08.jpg",
      name: "Walter Bishop",
    },
    coreTeam: {
      images: ["/images/user/user-09.jpg", "/images/user/user-10.jpg", "/images/user/user-11.jpg"],
    },
    supportTeam: {
      images: ["/images/user/user-12.jpg", "/images/user/user-13.jpg", "/images/user/user-14.jpg"],
    },
    startDate: "14 November 2025",
    endDate: "25 June 2026",
    priority: "Urgent",
    status: "Pending",
  },
  {
    id: 14,
    projectName: "Tyrell Corporation",
    projectManager: {
      image: "/images/user/user-15.jpg",
      name: "Eldon Tyrell",
    },
    projectLead: {
      image: "/images/user/user-16.jpg",
      name: "J.F. Sebastian",
    },
    coreTeam: {
      images: ["/images/user/user-17.jpg", "/images/user/user-18.jpg", "/images/user/user-19.jpg"],
    },
    supportTeam: {
      images: ["/images/user/user-20.jpg", "/images/user/user-21.jpg", "/images/user/user-22.jpg"],
    },
    startDate: "7 February 2025",
    endDate: "19 September 2025",
    priority: "Low",
    status: "In Progress",
  },
  {
    id: 15,
    projectName: "Initech",
    projectManager: {
      image: "/images/user/user-23.jpg",
      name: "Bill Lumbergh",
    },
    projectLead: {
      image: "/images/user/user-24.jpg",
      name: "Peter Gibbons",
    },
    coreTeam: {
      images: ["/images/user/user-25.jpg", "/images/user/user-26.jpg", "/images/user/user-27.jpg"],
    },
    supportTeam: {
      images: ["/images/user/user-28.jpg", "/images/user/user-29.jpg", "/images/user/user-30.jpg"],
    },
    startDate: "20 May 2025",
    endDate: "15 January 2026",
    priority: "Medium",
    status: "Pending",
  }
];

export const useProjectData = () => {
  return {
    data: initialData,
    totalProjects: initialData.length,
    statusCounts: {
      pending: initialData.filter(project => project.status === "Pending").length,
      inProgress: initialData.filter(project => project.status === "In Progress").length,
      completed: initialData.filter(project => project.status === "Completed").length,
      aborted: initialData.filter(project => project.status === "Aborted").length,
    },
    priorityCounts: {
      low: initialData.filter(project => project.priority === "Low").length,
      medium: initialData.filter(project => project.priority === "Medium").length,
      high: initialData.filter(project => project.priority === "High").length,
      urgent: initialData.filter(project => project.priority === "Urgent").length,
    }
  };
};

export type { Visit };