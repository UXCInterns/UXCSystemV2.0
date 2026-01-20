"use client"

import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import React, { useState } from "react"
import EditSessionSidebar from "@/components/innopoll/editSession/details";
import QuestionInput from "@/components/innopoll/createSession/questions";
import ComponentCard from "@/components/innopoll/common/ComponentCard"
import { Question } from "@/types/question";

export default function EditSession() {

    
const [questions, setQuestions] = useState<Question[]>([]);


    return (
        <div>
            <PageBreadcrumb
                pageTitle="Edit Session"
                items={[
                    { label: "Home", href: "/" },
                    { label: "InnoPoll", href: "/innoPoll" },
                    { label: "Update Session" }, // last item, no href
                ]}
            />
            <div className="grid grid-cols-12 gap-6"> 
                <ComponentCard
                    className="col-span-12 xl:col-span-4"
                    header={
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-4">
                                <h3 className="text-base font-medium text-gray-800 dark:text-white/90 ml-5">
                                    Update Session
                                </h3>
                            </div>
                        </div>
                    }
                >
                    
                   <EditSessionSidebar questions={questions} setQuestions={setQuestions} />

                </ComponentCard>

                <ComponentCard
                    className="col-span-12 xl:col-span-8"
                    header={
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-4">
                                <h3 className="text-base font-medium text-gray-800 dark:text-white/90 ml-5">
                                    Questions
                                </h3>
                            </div>
                        </div>
                    }
                >
                    <QuestionInput questions={questions} setQuestions={setQuestions} />

                </ComponentCard>
            </div>
        </div>
    );

}