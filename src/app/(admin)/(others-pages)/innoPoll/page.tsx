"use client";

import InnoPoll from "../../../../components/innopoll/innopoll";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "../../../../components/innopoll/common/ComponentCard";
import SearchQuery from "@/components/innopoll/common/searchQuery";
import SortDropdown from "../../../../components/innopoll/common/sortDropdown";
import Pagination from "@/components/innopoll/common/Pagination";
import React, { useState } from "react";
import { PlusIcon } from "@/icons";

export default function BasicTables() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("Newest");

  const sortOptions = ["Newest", "Oldest", "Most Participated", "Least Participated"];

  return (
    <div>
      <PageBreadcrumb pageTitle="InnoPoll" />
      <div className="space-y-6">
       <ComponentCard
          header={
            <div className="flex justify-between items-center">
              {/* Left group: Search, Filter, Sort */}
              <div className="flex items-center gap-4">
                <SearchQuery value={searchQuery} onChange={setSearchQuery} />
                <SortDropdown options={sortOptions} selected={sortBy} onSelect={setSortBy} />
              </div>

              {/* Right group:Log New Visit */}
              <div className="flex items-center gap-4 mr-4">
                <button
                  // onClick={openModal}
                  className="flex items-center bg-brand-500 text-white px-4 py-2.5 text-theme-sm font-medium rounded-lg hover:bg-blue-700"
                >
                  Create Session <PlusIcon className="ml-2" />
                </button>
              </div>
            </div>
          }
        >
          <InnoPoll
            searchQuery={searchQuery}
            selectedSort={sortBy}
            onSortChange={setSortBy}
          />

          <Pagination
            currentPage={1}
            totalPages={3}
            onPageChange={(page: number): void => {
              // Implement pagination logic here
            }}
          />
        </ComponentCard>
      </div>
    </div>
  );
}

