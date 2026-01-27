"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase } from "../../../lib/supabase/supabaseClient";

export interface PollQuestion {
    id: string;
    title: string;
    yourScore: number;
    avgScore: number;
    unit: string;
}

interface ResponseRow {
    participant_id: string;
    answers: number[];
    room_code: string;
}

export interface PollData {
    [key: string]: PollQuestion;
}

// Category mapping by answer index
const CATEGORY_TITLES = ["INNOVATION CULTURE", "INNOVATION PRACTICES", "INNOVATION LEADERSHIP"];

export const useRealtimePollResults = (roomCode: string, participantId: string | null) => {
    const [pollData, setPollData] = useState<PollData>({});
    const [allResponses, setAllResponses] = useState<ResponseRow[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const buildPollData = useCallback((responses: ResponseRow[]): PollData => {
        const pollDataObj: PollData = {};

        // Initialize categories
        CATEGORY_TITLES.forEach((title, idx) => {
            pollDataObj[`q${idx}`] = {
                id: `q${idx}`,
                title,
                yourScore: 0,
                avgScore: 0,
                unit: "%",
            };
        });

        // Sum scores and set yourScore if participantId matches
        responses.forEach((r) => {
            r.answers.forEach((score: number, idx: number) => {
                const key = `q${idx}`;
                pollDataObj[key].avgScore += score;

                if (participantId && r.participant_id === participantId) {
                    pollDataObj[key].yourScore = score;
                }
            });
        });

        // Compute average
        const totalResponses = responses.length || 1; // avoid division by 0
        Object.keys(pollDataObj).forEach((key) => {
            pollDataObj[key].avgScore = pollDataObj[key].avgScore / totalResponses;
        });

        return pollDataObj;
    }, [participantId]);

    const fetchInitialData = useCallback(async () => {
        try {
            setIsLoading(true);

            const { data: responses, error } = await supabase
                .from("responses")
                .select("participant_id, answers, room_code")
                .eq("room_code", roomCode);

            if (error) throw error;

            setAllResponses(responses || []);
            setPollData(buildPollData(responses || []));

        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message); 
            } else {
                setError("Failed to fetch poll results");
            }
        } finally {
            setIsLoading(false);
        }

    }, [roomCode, buildPollData]);

    useEffect(() => {
        if (!roomCode) return;

        fetchInitialData();

        const subscription = supabase
            .channel(`poll-${roomCode}`)
            .on(
                "postgres_changes",
                {
                    event: "INSERT",
                    schema: "public",
                    table: "responses",
                    filter: `room_code=eq.${roomCode}`,
                },
                (payload: { new: ResponseRow }) => {
                    setAllResponses((prev) => {
                        const updated = [...prev, payload.new];
                        setPollData(buildPollData(updated));
                        return updated;
                    });
                }

            )
            .subscribe();

        return () => {
            supabase.removeChannel(subscription);
        };
    }, [roomCode, fetchInitialData, buildPollData]);

    return { pollData, isLoading, error, allResponses, refresh: fetchInitialData };
};
