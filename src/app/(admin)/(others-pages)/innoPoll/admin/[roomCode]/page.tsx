// this is the page to view the participants responses
"use client"


import { useParams } from "next/navigation"
import PageBreadcrumb from "@/components/common/PageBreadCrumb"
import React from "react"
import StatsCards from "@/components/innopoll/viewSession/StatsCards"
import ParticipantsTable from "@/components/innopoll/viewSession/PartIcipantTable"

export default function ViewAdmin() {

    const params = useParams()
    const { roomCode } = params

    return (
        <div>
            <PageBreadcrumb
                pageTitle="View Participants"
                items={[
                    { label: "Home", href: "/" },
                    { label: "InnoPoll", href: "/innoPoll" },
                    { label: "View Session" }, // last item, no href
                ]}
            />

            {/* Stats cards */}
            {/* Stats cards + table */}
            {roomCode && typeof roomCode === "string" && (
                <div className="mt-6 space-y-8">
                    <StatsCards roomCode={roomCode} />
                    <ParticipantsTable roomCode={roomCode} />
                </div>
            )}


        </div>



    )

}