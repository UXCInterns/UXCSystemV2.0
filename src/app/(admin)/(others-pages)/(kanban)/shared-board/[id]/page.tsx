"use client";

import { useParams } from "next/navigation";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/kanban/common/ComponentCard";
import TaskTab from "@/components/kanban/common/TaskToggle";
import AddTaskModal from "@/components/kanban/common/AddTaskModal";
import KanbanBoard from "@/components/kanban/SharedBoard";
import { useEffect, useState } from "react";
import { initialData } from "@/components/projects/projectboard/currentProjects";
import type { ColumnType } from "@/hooks/useData";
import { initialProjectBoards } from "@/hooks/useData";

export default function SharedBoardPage() {
  const { id } = useParams(); // Get the dynamic project ID
  const [columns, setColumns] = useState<ColumnType[]>([]);
  const [projectName, setProjectName] = useState<string>("");
  const [showModal, setShowModal] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string>("todo");

  useEffect(() => {
    if (id && typeof id === "string") {
      // Fetch board data
      const board = initialProjectBoards[id];
      if (board) {
        setColumns(board);
      } else {
        setColumns([]);
      }

      // Fetch project name from initialData
      const project = initialData.find((p) => p.id.toString() === id.toString());
      if (project) {
        setProjectName(project.projectName);
      } else {
        setProjectName("Unknown Project");
      }
    }
  }, [id]);

  const counts = {
    all: columns.reduce((sum, col) => sum + col.cards.length, 0),
    todo: columns.find((c) => c.status === "todo")?.cards.length || 0,
    inprogress: columns.find((c) => c.status === "inprogress")?.cards.length || 0,
    completed: columns.find((c) => c.status === "completed")?.cards.length || 0,
  };

  function capitalizeFirstLetter(str: string) {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  const handleAddClick = (status: string) => {
    setSelectedStatus(status);
    setShowModal(true);
  };

  const handleAddTask = (task: {
    title: string;
    description: string;
    date: string;
    status: string;
  }) => {
    setColumns((prevCols) =>
      prevCols.map((col) =>
        col.status.toLowerCase() === task.status.toLowerCase()
          ? {
              ...col,
              cards: [
                {
                  id: Date.now().toString(),
                  title: capitalizeFirstLetter(task.title),
                  description: capitalizeFirstLetter(task.description),
                  status: task.status,
                  date: task.date,
                  priority: "Low", // default
                  commentsCount: 0,
                  avatars: [],
                },
                ...col.cards,
              ],
              count: col.cards.length + 1,
            }
          : col
      )
    );
    setShowModal(false);
  };

  return (
    <div>
      <PageBreadcrumb pageTitle={`Kanban - ${projectName}`} />

      <div className="space-y-6 mt-6">
        <ComponentCard
          header={
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4 ml-4">
                <TaskTab counts={counts} />
              </div>
              <div className="flex items-center gap-4 mr-4">
                <button className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-theme-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200">
                  <svg
                    className="stroke-current fill-white dark:fill-gray-800"
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M2.29004 5.90393H17.7067" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M17.7075 14.0961H2.29085" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path
                      d="M12.0826 3.33331C13.5024 3.33331 14.6534 4.48431 14.6534 5.90414C14.6534 7.32398 13.5024 8.47498 12.0826 8.47498C10.6627 8.47498 9.51172 7.32398 9.51172 5.90415C9.51172 4.48432 10.6627 3.33331 12.0826 3.33331Z"
                      strokeWidth="1.5"
                    />
                    <path
                      d="M7.91745 11.525C6.49762 11.525 5.34662 12.676 5.34662 14.0959C5.34661 15.5157 6.49762 16.6667 7.91745 16.6667C9.33728 16.6667 10.4883 15.5157 10.4883 14.0959C10.4883 12.676 9.33728 11.525 7.91745 11.525Z"
                      strokeWidth="1.5"
                    />
                  </svg>
                  Filter
                </button>
              </div>
            </div>
          }
        >
          <KanbanBoard columns={columns} setColumns={setColumns} onAddClick={handleAddClick} />
        </ComponentCard>
      </div>

      <AddTaskModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onAddTask={handleAddTask}
        defaultStatus={selectedStatus}
      />
    </div>
  );
}
