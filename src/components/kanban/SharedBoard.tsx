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
  status: string;
  cards: CardType[];
};

type KanbanBoardProps = {
  columns: ColumnType[];
  setColumns: React.Dispatch<React.SetStateAction<ColumnType[]>>;
  onAddClick: (status: string) => void;
};

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

      const newColIndex = updatedCols.findIndex(col => col.status === updatedCard.status);
      if (newColIndex !== -1) {
        updatedCols[newColIndex].cards.push(updatedCard);
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
              count={col.cards.length} // ✅ derive count here
              onAddClick={() => onAddClick(col.status)}
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
