"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Input from "../../form/input/InputField";

interface User {
  id: string;
  full_name: string;
  banner_url?: string;
  avatar_url: string;
  job_title?: string;
  bio?: string;
}

export default function FriendsPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    try {
      const response = await fetch("/api/profiles");

      if (!response.ok) throw new Error("Failed to fetch users");

      const { profiles } = await response.json();
      setUsers(profiles || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load users");
    } finally {
      setLoading(false);
    }
  }

  const filteredUsers = users.filter((user) =>
    user.full_name?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="animate-pulse bg-gray-100 dark:bg-gray-800 rounded-2xl p-6 h-56"
            />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="-mt-8">
      {/* Header */}
      <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="mt-1 text-gray-600 dark:text-gray-400">
            {users.length} {users.length === 1 ? "person" : "people"} connected
          </p>
        </div>

        <Input
            type="text"
            placeholder="Search people..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-64"
        />
      </div>

      {/* Grid */}
      {filteredUsers.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredUsers.map((user) => (
           <Link key={user.id} href={`/profile/${user.id}`} className="group">
            <div className="relative overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-dark transition-all hover:-translate-y-1 hover:shadow-xl">

                {/* Banner */}
                <div className="relative h-24 w-full">
                {user.banner_url ? (
                    <Image
                    src={user.banner_url}
                    alt={`${user.full_name}'s banner`}
                    fill
                    className="object-cover"
                    />
                ) : (
                    <div className="h-full w-full bg-gradient-to-r from-blue-500/80 to-purple-500/80" />
                )}

                {/* Avatar */}
                <div className="absolute left-1/2 bottom-0 translate-y-1/2 -translate-x-1/2">
                    <div className="relative h-25 w-25 rounded-full border-4 border-white dark:border-gray-dark bg-white">
                    <Image
                        src={user.avatar_url || "/default-avatar.png"}
                        alt={user.full_name || "User"}
                        fill
                        className="rounded-full object-cover"
                    />
                    </div>
                </div>
                </div>

                {/* Content */}
                <div className="pt-14 px-6 pb-6 text-center">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    {user.full_name || "Anonymous User"}
                </h3>

                {/* Job title or default */}
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    {user.job_title || "Staff"}
                </p>

                {/* Bio or standard fallback */}
                <p className="mt-4 text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                    {user.bio || "Let’s connect and learn more about each other."}
                </p>
                </div>
            </div>
           </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-gray-500 dark:text-gray-400">
            No matching users found.
          </p>
        </div>
      )}
    </div>
  );
}
