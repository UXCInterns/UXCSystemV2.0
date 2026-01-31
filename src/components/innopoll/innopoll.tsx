"use client";

import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useModal } from "@/hooks/useModal";
import Badge from "@/components/ui/badge/Badge";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { deleteSession } from "@/hooks/innopoll/sessionDelete";
import Button from "@/components/ui/button/Button";
import { Modal } from "@/components/ui/modal";

interface Visit {
  id: number;
  sessionName: string;
  dateCreated: string;
  roomCode: string;
  participantsAttended: number;
  status: string;
  created_by: string;
  creator_avatar: string | null;
}

interface InnoPollProps {
  searchQuery: string;
  selectedSort: string;
  onSortChange: (value: string) => void;
}

interface InnoPollApiItem {
  session_id: number;
  session_title: string;
  session_created_at: string;
  room_code: string;
  participant_count: number;
  session_status: string;
  creator_name: string;
  creator_avatar: string | null;
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

// Icon Components for better organization
const ChartIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 512 512">
    <path fill="currentColor" d="M480 496H48a32 32 0 0 1-32-32V32a16 16 0 0 1 32 0v432h432a16 16 0 0 1 0 32" />
    <path fill="currentColor" d="M156 432h-40a36 36 0 0 1-36-36V244a36 36 0 0 1 36-36h40a36 36 0 0 1 36 36v152a36 36 0 0 1-36 36m144 0h-40a36 36 0 0 1-36-36V196a36 36 0 0 1 36-36h40a36 36 0 0 1 36 36v200a36 36 0 0 1-36 36m143.64 0h-40a36 36 0 0 1-36-36V132a36 36 0 0 1 36-36h40a36 36 0 0 1 36 36v264a36 36 0 0 1-36 36" />
  </svg>
);

const UsersIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24">
    <path fill="currentColor" d="M1 20v-2.8q0-.85.438-1.563T2.6 14.55q1.55-.775 3.15-1.163T9 13q1.65 0 3.25.388t3.15 1.162q.725.375 1.163 1.088T17 17.2V20H1Zm18 0v-3q0-1.1-.613-2.113T16.65 13.15q1.275.15 2.4.513t2.1.887q.9.5 1.375 1.112T23 17v3h-4ZM9 12q-1.65 0-2.825-1.175T5 8q0-1.65 1.175-2.825T9 4q1.65 0 2.825 1.175T13 8q0 1.65-1.175 2.825T9 12Zm10-4q0 1.65-1.175 2.825T15 12q-.275 0-.7-.063t-.7-.137q.675-.8 1.038-1.775T15 8q0-1.05-.362-2.025T13.6 4.2q.35-.125.7-.163T15 4q1.65 0 2.825 1.175T19 8Z" />
  </svg>
);

const EyeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 512 512">
    <circle cx="256" cy="256" r="64" fill="currentColor" />
    <path fill="currentColor" d="M490.84 238.6c-26.46-40.92-60.79-75.68-99.27-100.53C349 110.55 302 96 255.66 96c-42.52 0-84.33 12.15-124.27 36.11c-40.73 24.43-77.63 60.12-109.68 106.07a31.92 31.92 0 0 0-.64 35.54c26.41 41.33 60.4 76.14 98.28 100.65C162 402 207.9 416 255.66 416c46.71 0 93.81-14.43 136.2-41.72c38.46-24.77 72.72-59.66 99.08-100.92a32.2 32.2 0 0 0-.1-34.76ZM256 352a96 96 0 1 1 96-96a96.11 96.11 0 0 1-96 96Z" />
  </svg>
);

const EditIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 576 512">
    <path fill="currentColor" d="m402.3 344.9l32-32c5-5 13.7-1.5 13.7 5.7V464c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V112c0-26.5 21.5-48 48-48h273.5c7.1 0 10.7 8.6 5.7 13.7l-32 32c-1.5 1.5-3.5 2.3-5.7 2.3H48v352h352V350.5c0-2.1.8-4.1 2.3-5.6zm156.6-201.8L296.3 405.7l-90.4 10c-26.2 2.9-48.5-19.2-45.6-45.6l10-90.4L432.9 17.1c22.9-22.9 59.9-22.9 82.7 0l43.2 43.2c22.9 22.9 22.9 60 .1 82.8zM460.1 174L402 115.9L216.2 301.8l-7.3 65.3l65.3-7.3L460.1 174zm64.8-79.7l-43.2-43.2c-4.1-4.1-10.8-4.1-14.8 0L436 82l58.1 58.1l30.9-30.9c4-4.2 4-10.8-.1-14.9z" />
  </svg>
);

const DeleteIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 48 48">
    <g fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="4">
      <path d="M9 10v34h30V10H9Z" />
      <path strokeLinecap="round" d="M20 20v13m8-13v13M4 10h40" />
      <path d="m16 10l3.289-6h9.488L32 10H16Z" />
    </g>
  </svg>
);

export default function InnoPoll({
  searchQuery,
  selectedSort,
}: InnoPollProps) {
  const [tableData, setTableData] = useState<Visit[]>([]);
  const { isOpen, openModal, closeModal } = useModal();
  const [sessionToDelete, setSessionToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const filteredData = tableData.filter((row) =>
    row.sessionName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/innopoll");
        const data: InnoPollApiItem[] = await res.json();

        const formatted: Visit[] = data.map((item) => ({
          id: item.session_id,
          sessionName: item.session_title,
          dateCreated: formatDate(item.session_created_at),
          roomCode: item.room_code,
          participantsAttended: item.participant_count,
          status: item.session_status,
          created_by: item.creator_name,
          creator_avatar: item.creator_avatar,
        }));

        setTableData(formatted);
      } catch (err) {
        console.error("Failed to load innopoll data", err);
      }
    }

    fetchData();
  }, []);

  const handleDeleteSession = (sessionId: string) => {
    setSessionToDelete(sessionId);
    openModal();
  };

  const confirmDelete = async () => {
    if (!sessionToDelete) return;

    setIsDeleting(true);
    try {
      await deleteSession(sessionToDelete);
      setTableData((prev) =>
        prev.filter((row) => String(row.id) !== sessionToDelete)
      );
      closeModal();
      setSessionToDelete(null);
    } catch (err) {
      console.error(err);
      alert("Failed to delete session");
    } finally {
      setIsDeleting(false);
    }
  };

  const getSortedData = () => {
    const dataCopy = [...filteredData];
    switch (selectedSort) {
      case "Newest":
        return dataCopy.sort(
          (a, b) =>
            new Date(b.dateCreated).getTime() - new Date(a.dateCreated).getTime()
        );
      case "Oldest":
        return dataCopy.sort(
          (a, b) =>
            new Date(a.dateCreated).getTime() - new Date(b.dateCreated).getTime()
        );
      case "Most Participated":
        return dataCopy.sort((a, b) => b.participantsAttended - a.participantsAttended);
      case "Least Participated":
        return dataCopy.sort((a, b) => a.participantsAttended - b.participantsAttended);
      default:
        return dataCopy;
    }
  };

  const sortedData = getSortedData();
  const router = useRouter();

  return (
    <>
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="max-w-auto overflow-x-auto">
          <Table className="table-fixed">
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                {[
                  "Session Name",
                  "Date Created",
                  "Room Code",
                  "Participants",
                  "Status",
                  "Created By",
                  "Actions",
                ].map((header) => (
                  <TableCell
                    key={header}
                    isHeader
                    className={`px-5 py-3 font-large text-gray-500 text-theme-sm dark:text-gray-400 ${
                      header === "Session Name" ? "text-start" : "text-center"
                    }`}
                  >
                    {header}
                  </TableCell>
                ))}
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05] group">
              {sortedData.map((row) => (
                <TableRow
                  key={row.id}
                  className="transition-opacity duration-200 group-hover:opacity-30 hover:!opacity-100"
                >
                  <TableCell className="px-5 py-4 text-start text-theme-sm text-gray-800 dark:text-white/90 max-w-[200px] truncate overflow-hidden whitespace-nowrap">
                    {row.sessionName}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-center text-theme-sm text-gray-500 dark:text-gray-400">
                    {row.dateCreated}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-center text-theme-sm text-gray-500 dark:text-gray-400">
                    {row.roomCode}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-center text-theme-sm text-gray-500 dark:text-gray-400">
                    {row.participantsAttended}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-center text-theme-sm text-gray-500 dark:text-gray-400">
                    <Badge
                      size="sm"
                      color={row.status === "Ongoing" ? "success" : "error"}
                    >
                      {row.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-5 py-4 text-theme-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center justify-center gap-3">
                      {row.creator_avatar ? (
                        <Image
                          src={row.creator_avatar}
                          alt={row.created_by}
                          width={40}
                          height={40}
                          className="rounded-full transition-transform hover:scale-105"
                          unoptimized
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center text-xs font-semibold text-gray-700 dark:text-gray-200">
                          {row.created_by?.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <span className="whitespace-nowrap">{row.created_by}</span>
                    </div>
                  </TableCell>

                  <TableCell className="px-5 py-4 text-theme-sm text-gray-500 dark:text-gray-400">
                    <div className="flex justify-center gap-5 items-center">
                      <button
                        onClick={() => router.push(`innoPoll/results/${row.roomCode}`)}
                        aria-label="View Results"
                        className="hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
                      >
                        <ChartIcon />
                      </button>
                      <button
                        onClick={() => router.push(`innoPoll/admin/${row.roomCode}`)}
                        aria-label="View Participants"
                        className="hover:text-yellow-600 dark:hover:text-yellow-400 transition-colors"
                      >
                        <UsersIcon />
                      </button>
                      <button
                        onClick={() => router.push(`/join/${row.roomCode}`)}
                        aria-label="View Session"
                        className="hover:text-green-600 dark:hover:text-green-400 transition-colors"
                      >
                        <EyeIcon />
                      </button>
                      <button
                        onClick={() => router.push(`/innoPoll/edit/${row.id}`)}
                        aria-label="Edit Session"
                        className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                      >
                        <EditIcon />
                      </button>
                      <button
                        onClick={() => handleDeleteSession(String(row.id))}
                        aria-label="Delete Session"
                        className="hover:text-red-600 dark:hover:text-red-400 transition-colors"
                      >
                        <DeleteIcon />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Delete Confirmation Modal using the reusable Modal component */}
      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-md mx-4">
        <div className="p-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-100">
            Confirm Delete
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
            Are you sure you want to delete this session? This action cannot be undone.
          </p>
          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => {
                closeModal();
                setSessionToDelete(null);
              }}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              onClick={confirmDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700 disabled:bg-red-300"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}