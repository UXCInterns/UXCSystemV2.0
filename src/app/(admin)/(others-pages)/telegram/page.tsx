"use client";

import Telegram from "../../../../components/telegram/telegram"
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "../../../../components/telegram/common/ComponentCard";
import SearchQuery from "@/components/telegram/common/searchQuery";
import Pagination from "@/components/telegram/common/Pagination";
import React, { useState } from "react";
import { PlusIcon } from "@/icons";

export default function TelegramTable() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div>
      <PageBreadcrumb pageTitle="Telegram" />
      <div className="space-y-6">
       <ComponentCard
          header={
            <div className="flex justify-between items-center">
              {/* Left group: Search, Filter, Sort */}
              <div className="flex items-center gap-4">
                <SearchQuery value={searchQuery} onChange={setSearchQuery} />
              </div>

              {/* Right group:Log New Visit */}
              <div className="flex items-center gap-4 mr-4">
                <button
                  // onClick={openModal}
                  className="flex items-center bg-brand-500 text-white px-4 py-2.5 text-theme-sm font-medium rounded-lg hover:bg-blue-700"
                >
                 <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 384 480" className="mr-1"><path fill="currentColor" d="m192 5l192 86v128q0 89-55 162.5T192 475q-82-20-137-93.5T0 219V91zm-43 342l171-171l-30-30l-141 140l-55-55l-30 30z"/></svg> Authenticate User
                </button>
              </div>
            </div>
          }
        >
          <Telegram
            searchQuery={searchQuery}
          />

          <Pagination
            currentPage={1}
            totalPages={1}
            onPageChange={(page: number): void => {
              // Implement pagination logic here
            }}
          />
        </ComponentCard>
      </div>
    </div>
  );
}

