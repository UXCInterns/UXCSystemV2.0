import React, { useState } from "react";
import KanbanColumn from "./KanbanColumn";
import KanbanCard from "./KanbanCard";
import EditTaskModal from "./common/EditTaskModal";

type Priority = "Low" | "Medium" | "High" | "Urgent";

type CardType = {
  id: string;
  title: string;
  description?: string;
  date: string;
  status: string;
  priority?: Priority;
  commentsCount?: number;
  avatars?: string[];
};

type ColumnType = {
  title: string;
  count: number;
  status: string;
  cards: CardType[];
};

type KanbanBoardProps = {
  columns: ColumnType[];
  setColumns: React.Dispatch<React.SetStateAction<ColumnType[]>>;
  onAddClick: (status: string) => void;
};

export const initialColumns: ColumnType[] = [
  {
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
      {
        id: "todo-3",
        title: "Change license and remove products",
        description: "Update licensing model and remove deprecated SKUs.",
        date: "Jan 8, 2027",
        status: "todo",
        priority: "Medium",
        avatars: [
          "../../../images/user/user-05.jpg",
          "../../../images/user/user-07.jpg"
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
      {
        id: "inprogress-2",
        title: "Setup analytics tracking",
        description: "Integrate GA4 and segment event funnels for dashboard views.",
        date: "June 30, 2025",
        status: "inprogress",
        priority: "Urgent",
        avatars: [
          "../../../images/user/user-24.jpg",
          "../../../images/user/user-30.jpg"
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
      {
        id: "review-1",
        title: "QA Test Case Audit",
        description: "Conduct audit of QA test cases and ensure consistency.",
        date: "July 9, 2025",
        status: "review",
        priority: "Medium",
        avatars: [
          "../../../images/user/user-14.jpg",
          "../../../images/user/user-16.jpg"
        ],
        commentsCount: 3,
      },
    ],
  },
  {
    title: "Completed",
    count: 1,
    status: "completed",
    cards: [
      {
        id: "completed-1",
        title: "Launch v1.0",
        description: "Successfully deployed v1.0 to production with release notes.",
        date: "June 1, 2025",
        status: "completed",
        priority: "Low",
        avatars: [
          "../../../images/user/user-18.jpg",
          "../../../images/user/user-29.jpg",
          "../../../images/user/user-27.jpg",
        ],
        commentsCount: 4,
      },
    ],
  },
];

const KanbanBoard: React.FC<KanbanBoardProps> = ({ columns, setColumns, onAddClick }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editData, setEditData] = useState<{
    colIndex: number;
    cardIndex: number;
    card: CardType;
  } | null>(null);

  const handleEdit = (colIndex: number, cardIndex: number) => {
    const card = columns[colIndex].cards[cardIndex];
    setEditData({ colIndex, cardIndex, card });
    setIsModalOpen(true);
  };

  const handleUpdate = (updatedCard: CardType) => {
    if (!editData) return;

    const updatedCols = [...columns];
    const { colIndex, cardIndex, card } = editData;

    if (updatedCard.status !== card.status) {
      updatedCols[colIndex].cards.splice(cardIndex, 1);
      updatedCols[colIndex].count = updatedCols[colIndex].cards.length;

      const newColIndex = updatedCols.findIndex(col => col.status === updatedCard.status);
      if (newColIndex !== -1) {
        updatedCols[newColIndex].cards.push(updatedCard);
        updatedCols[newColIndex].count = updatedCols[newColIndex].cards.length;
      }
    } else {
      updatedCols[colIndex].cards[cardIndex] = updatedCard;
    }

    setColumns(updatedCols);
    setIsModalOpen(false);
  };

  const handleDelete = (colIndex: number, cardIndex: number) => {
    const updatedCols = [...columns];
    updatedCols[colIndex].cards.splice(cardIndex, 1);
    updatedCols[colIndex].count = updatedCols[colIndex].cards.length;
    setColumns(updatedCols);
  };

  const handleDragStart = (
    e: React.DragEvent,
    cardIndex: number,
    fromStatus: string
  ) => {
    e.dataTransfer.setData("cardIndex", cardIndex.toString());
    e.dataTransfer.setData("fromStatus", fromStatus);
  };

  const handleDrop = (e: React.DragEvent, toStatus: string) => {
    const cardIndex = parseInt(e.dataTransfer.getData("cardIndex"), 10);
    const fromStatus = e.dataTransfer.getData("fromStatus");

    if (fromStatus === toStatus) return;

    const updatedColumns = [...columns];
    const fromCol = updatedColumns.find((col) => col.status === fromStatus);
    const toCol = updatedColumns.find((col) => col.status === toStatus);
    if (!fromCol || !toCol) return;

    const [movedCard] = fromCol.cards.splice(cardIndex, 1);
    movedCard.status = toStatus;
    toCol.cards.push(movedCard);

    fromCol.count = fromCol.cards.length;
    toCol.count = toCol.cards.length;
    setColumns(updatedColumns);
  };

  return (
    <>
      <div className="grid grid-cols-1 gap-0 md:grid-cols-4 border-t border-gray-200 dark:border-gray-800">
        {columns.map((col, colIndex) => (
          <div
            key={col.title}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => handleDrop(e, col.status)}
            className="border-l first:border-0 border-gray-200 dark:border-gray-800"
          >
            <KanbanColumn
              title={col.title}
              count={col.count}
              onAddClick={() => onAddClick(col.status)} // ✅ fixed here
            >
              {col.cards.map((card, cardIndex) => (
                <div
                  key={card.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, cardIndex, col.status)}
                >
                  <KanbanCard
                    {...card}
                    onEdit={() => handleEdit(colIndex, cardIndex)}
                    onDelete={() => handleDelete(colIndex, cardIndex)}
                  />
                </div>
              ))}
            </KanbanColumn>
          </div>
        ))}
      </div>

      {isModalOpen && editData && (
        <EditTaskModal
          task={editData.card}
          onClose={() => setIsModalOpen(false)}
          onSave={(updatedTask) =>
            handleUpdate({
              ...editData.card,
              ...updatedTask,
            })
          }
        />
      )}
    </>
  );
};

export default KanbanBoard;
