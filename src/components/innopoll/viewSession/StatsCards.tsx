"use client"

import { useEffect, useState } from "react"

interface Stats {
    total: number
    completed: number
    pending: number
    completionRate: number
}

export default function StatsCards({ roomCode }: { roomCode: string }) {
    const [stats, setStats] = useState<Stats | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!roomCode) return

        const fetchStats = async () => {
            try {
                const res = await fetch(`/api/admin/${roomCode}`)
                const data = await res.json()
                setStats(data)
            } catch (err) {
                console.error("Failed to fetch stats:", err)
            } finally {
                setLoading(false)
            }
        }

        fetchStats()
    }, [roomCode])

    if (loading) {
        return (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Array(4).fill(0).map((_, i) => (
                    <div
                        key={i}
                        className=" p-4 rounded-2xl shadow-md h-24 animate-pulse bg-gray-100 dark:bg-white/[0.06] transition-colors"
                    />
                ))}
            </div>
        )
    }

    if (!stats) return null

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard label="Total Participants" value={stats.total} color="text-indigo-600" />
            <StatCard label="Completed" value={stats.completed} color="text-green-600" />
            <StatCard label="Pending" value={stats.pending} color="text-orange-600" />
            <StatCard
                label="Completion Rate"
                value={`${stats.completionRate}%`}
                color="text-indigo-600"
            />
        </div>
    )
}

function StatCard({
    label,
    value,
    color,
}: {
    label: string
    value: number | string
    color: string
}) {
    return (
        <div className=" p-4 rounded-2xl shadow-md bg-white dark:bg-white/[0.03] border border-gray-200 dark:border-white/[0.05] transition-colors">
            <div className="text-sm text-gray-500 dark:text-gray-400 ">{label}</div>
            <div className={`text-3xl font-bold mt-1 ${color} dark:opacity-90`}>
                {value}
            </div>
        </div>
    )
}
