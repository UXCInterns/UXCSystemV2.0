"use client"

import { useEffect, useState } from "react"

interface Participant {
    id: string
    name: string
    created_at: string
    responses: [
        {
            completed: boolean
            answers: number[]

        }
    ] | []
}

export default function ParticipantsTable({ roomCode, }: { roomCode: string }) {

    const [participants, setParticipants] = useState<Participant[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchParticipants = async () => {
            try {

                const res = await fetch(`/api/admin/${roomCode}`)
                const data = await res.json()

                setParticipants(data.participants)


            } catch (err) {
                console.error(err)
            } finally {
                setLoading(false)
            }
        }

        fetchParticipants()
    }, [roomCode])

    

    const calculateAverageScore = (scores: number[] | null) => {
        if (!scores) return 0
        return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
    }

    if (loading) {
        return <div className="text-gray-500">Loading participants…</div>
    }


    return (
        <div className="rounded-3xl shadow-md bg-white p-6  dark:bg-white/[0.06] transition-colors">

            {/* Headers */}
            <div className="grid grid-cols-[1.5fr_1fr_1fr_1fr_1fr] items-center
                text-gray-400 dark:text-gray-300 text-lg mb-4 px-4 ">
                <div className="text-center">Participant Name</div>
                <div className="text-center">Average</div>
                <div className="text-center">Q1</div>
                <div className="text-center">Q2</div>
                <div className="text-center">Q3</div>
            </div>
            {/* Rows */}
            <div className="space-y-3">
                {participants.map((p) => {
                    const response = p.responses?.[0]
                    const completed = response?.completed
                    const answers = response?.answers
                    const average = calculateAverageScore(completed ? answers ?? null : null)


                    return (
                        <div
                            key={p.id}
                            className="grid grid-cols-[1.5fr_1fr_1fr_1fr_1fr] items-center bg-gray-100 text-gray-800 dark:bg-white/[0.06] dark:text-gray-100 rounded-xl px-4 py-3 transition-colors"
                        >

                            {/* Participant name */}
                            <div className="font-medium text-gray-800 dark:text-gray-100 text-center">

                                {p.name}
                            </div>

                            <div className="text-center">
                                {completed ? `${average}%` : "X"}
                            </div>

                            {/* Q1 */}
                            <div className="text-center">
                                {completed ? `${answers?.[0]}%` : "X"}
                            </div>

                            {/* Q2 */}
                            <div className="text-center">
                                {completed ? `${answers?.[1]}%` : "X"}
                            </div>

                            {/* Q3 */}
                            <div className="text-center">
                                {completed ? `${answers?.[2]}%` : "X"}
                            </div>
                        </div>
                    )
                })}

            </div>

        </div>
    )
}