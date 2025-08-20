"use client";

import { useState } from "react";

const users = [
  {
    id: 1,
    name: "Kaiya George",
    role: "Project Manager",
    time: "15 mins ago",
    avatar: "/images/user/user-01.jpg",
    online: true,
  },
  {
    id: 2,
    name: "Lindsey Curtis",
    role: "UI/UX Designer",
    time: "30 mins ago",
    avatar: "/images/user/user-02.jpg",
    online: true,
  },
  {
    id: 3,
    name: "Samuel Brooks",
    role: "Frontend Developer",
    time: "1 hour ago",
    avatar: "/images/user/user-03.jpg",
    online: false,
  },
  {
    id: 4,
    name: "Nora Hart",
    role: "Backend Engineer",
    time: "5 mins ago",
    avatar: "/images/user/user-04.jpg",
    online: true,
  },
  {
    id: 5,
    name: "Adrian Walker",
    role: "DevOps Engineer",
    time: "Just now",
    avatar: "/images/user/user-05.jpg",
    online: true,
  },
  {
    id: 6,
    name: "Isla Bennett",
    role: "QA Tester",
    time: "2 hours ago",
    avatar: "/images/user/user-06.jpg",
    online: false,
  },
  {
    id: 7,
    name: "Leo Hayes",
    role: "Product Owner",
    time: "45 mins ago",
    avatar: "/images/user/user-07.jpg",
    online: true,
  },
  {
    id: 8,
    name: "Ruby Wallace",
    role: "Marketing Lead",
    time: "10 mins ago",
    avatar: "/images/user/user-08.jpg",
    online: true,
  },
  {
    id: 9,
    name: "Miles Foster",
    role: "Data Analyst",
    time: "3 hours ago",
    avatar: "/images/user/user-09.jpg",
    online: false,
  },
  {
    id: 10,
    name: "Clara Moore",
    role: "Business Analyst",
    time: "1 day ago",
    avatar: "/images/user/user-10.jpg",
    online: false,
  },
];

const ChatSidebar = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(false);

  return (
    <div
      className={`${
        isMobile ? "fixed inset-0 z-50 bg-white dark:bg-gray-900" : "hidden xl:flex"
      } w-[320px] flex-col xl:flex rounded-2xl border border-gray-200 dark:border-gray-800 dark:bg-white/[0.03]`}
    >
      {/* Header */}
      <div className="sticky px-4 pb-4 pt-4 sm:px-5 sm:pt-5 xl:pb-0">
        <div className="flex items-start justify-between">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white/90">Chats</h3>
          <div className="relative">
            <button
              onClick={() => setOpenDropdown(!openDropdown)}
              className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M10.2441 6C10.2441 5.0335 11.0276 4.25 11.9941 4.25H12.0041C12.9706 4.25 13.7541 5.0335 13.7541 6C13.7541 6.9665 12.9706 7.75 12.0041 7.75H11.9941C11.0276 7.75 10.2441 6.9665 10.2441 6ZM10.2441 18C10.2441 17.0335 11.0276 16.25 11.9941 16.25H12.0041C12.9706 16.25 13.7541 17.0335 13.7541 18C13.7541 18.9665 12.9706 19.75 12.0041 19.75H11.9941C11.0276 19.75 10.2441 18.9665 10.2441 18ZM11.9941 10.25C11.0276 10.25 10.2441 11.0335 10.2441 12C10.2441 12.9665 11.0276 13.75 11.9941 13.75H12.0041C12.9706 13.75 13.7541 12.9665 13.7541 12C13.7541 11.0335 12.9706 10.25 12.0041 10.25H11.9941Z"
                />
              </svg>
            </button>
            {openDropdown && (
              <div className="absolute right-0 mt-2 w-40 rounded-2xl border border-gray-200 bg-white shadow-lg dark:border-gray-800 dark:bg-gray-800 z-50 p-2">
                <button className="w-full px-3 py-2 text-left text-sm text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-white/5">
                  View More
                </button>
                <button className="w-full px-3 py-2 text-left text-sm text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-white/5">
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Search */}
        <div className="mt-4 flex items-center gap-3">
          {isMobile && (
            <button
              onClick={() => setIsMobile(false)}
              className="h-11 w-11 flex items-center justify-center rounded-lg border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-400 xl:hidden"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M4 5.25C3.59 5.25 3.25 5.59 3.25 6C3.25 6.41 3.59 6.75 4 6.75H20C20.41 6.75 20.75 6.41 20.75 6C20.75 5.59 20.41 5.25 20 5.25H4ZM4 17.25C3.59 17.25 3.25 17.59 3.25 18C3.25 18.41 3.59 18.75 4 18.75H20C20.41 18.75 20.75 18.41 20.75 18C20.75 17.59 20.41 17.25 20 17.25H4ZM3.25 12C3.25 11.59 3.59 11.25 4 11.25H20C20.41 11.25 20.75 11.59 20.75 12C20.75 12.41 20.41 12.75 20 12.75H4C3.59 12.75 3.25 12.41 3.25 12Z"
                />
              </svg>
            </button>
          )}
          <div className="relative w-full">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z" />
              </svg>
            </span>
            <input
              type="text"
              placeholder="Search chats..."
              className="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent py-2.5 pl-[42px] pr-3.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
            />
          </div>
        </div>
      </div>

      {/* User List */}
      <div className="flex max-h-full flex-col overflow-auto px-4 sm:px-5 py-3">
        <div className="custom-scrollbar max-h-full space-y-1 overflow-auto">
            {users.map((user) => (
            <div
                key={user.id}
                className="flex cursor-pointer items-center gap-3 rounded-lg p-3 hover:bg-gray-100 dark:hover:bg-white/[0.03]"
            >
                <div className="relative h-11 w-11">
                <img
                    src={user.avatar}
                    className="h-full w-full object-cover rounded-full"
                    alt={user.name}
                />
                {user.online && (
                    <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-green-500" />
                )}
                </div>
                <div className="flex-1">
                <div className="text-sm font-medium text-gray-800 dark:text-white">{user.name}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">{user.role}</div>
                </div>
                <div className="text-xs text-gray-400">{user.time}</div>
            </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default ChatSidebar;
