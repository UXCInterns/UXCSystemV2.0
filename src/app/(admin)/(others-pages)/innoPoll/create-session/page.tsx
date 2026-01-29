"use client";

import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import React, { useState } from "react";
import CreateSessionSidebar from "@/components/innopoll/createSession/details";
import QuestionInput from "@/components/innopoll/createSession/questions";
import ComponentCard from "@/components/innopoll/common/ComponentCard";

export default function CreateSession() {

const [questions, setQuestions] = useState([
    {
      question:
        "Does your company embrace discussions on experimentations to generate and test new ideas, concepts, business models, etc. to innovate?",
      statements: [
        {
          text: `An Innovation Culture fosters an atmosphere where employees feel empowered to take risks, collaborate, and continuously seek out opportunities for improvement and innovation in products, processes, or services. This is essential to staying competitive in today's rapidly changing landscape.`,
          title: `INNOVATION CULTURE`,
          desc: `Embrace Innovation`,
        },
      ],
    },
    {
      question:
        "How often does your company use business models, startup methodologies, design thinking or any other innovation tools and methods?",
      statements: [
        {
          text: `Innovation Practices often involve fostering a culture of innovation, conducting research and development, leveraging on technology and tools and processes for collaboration to thrive in an ever changing environmental and economic uncertainty to achieve sustainable advancements for all users.`,
          title: `INNOVATION PRACTICES`,
          desc: `Practice Innovation Tools & Methods`,
        },
      ],
    },
    {
      question:
        "How often do leaders in your organisation encourage the need for innovation and provide the resources to support innovation efforts?",
      statements: [
        {
          text: `Innovation leadership inspires organisations to foster a creative culture. They not only champion and support creative thinking but also provide strategic direction, allocate resources, and create an environment where experimentation and calculated risk-taking are encouraged.`,
          title: `INNOVATION LEADERSHIP`,
          desc: `Leaders who Champion Innovation`,
        },
      ],
    },
  ])
  return (
    <div>
      <PageBreadcrumb
        pageTitle="Create Session"
        items={[
          { label: "Home", href: "/" },
          { label: "InnoPoll", href: "/innoPoll" },
          { label: "Create Session" }, // last item, no href
        ]}
      />
      <div className="grid grid-cols-12 gap-6"> {/* Removed space-y-6 */}
        <ComponentCard
          className="col-span-12 xl:col-span-4"
          header={
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <h3 className="text-base font-medium text-gray-800 dark:text-white/90 ml-5">
                  Create Session
                </h3>
              </div>
            </div>
          }
        >
          <CreateSessionSidebar questions={questions} setQuestions={setQuestions} />
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