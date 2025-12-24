import React, { useState, useRef, useEffect } from 'react';
import { Filter, User, ChevronDown, ChevronRight, Calendar } from 'lucide-react';
import Button from '@/components/ui/button/Button';
import SearchQuery from "@/components/common/SearchQuery";
import Badge from "@/components/ui/badge/Badge";
import Checkbox from "@/components/form/input/Checkbox";
import Avatar from "@/components/ui/avatar/Avatar";
import { getPriorityBadgeProps } from '@/utils/CommonUtils/badgeUtils';
import { Dropdown } from '@/components/ui/dropdown/Dropdown';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.css';
import type { Profile } from "@/types/ProjectsTypes/project";

type Props = {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  showMyTasksOnly: boolean;
  setShowMyTasksOnly: (show: boolean) => void;
  currentUserId?: string;
  profiles: Profile[];
  onFilterChange: (filters: TaskFilters) => void;
  activeFilters: TaskFilters;
};

export type TaskFilters = {
  priorities: string[];
  dueDateRange: { start: string | null; end: string | null };
  assignees: string[];
};

const PRIORITY_OPTIONS = ['Low', 'Medium', 'High', 'Critical'];

export function KanbanToolbar({ 
  searchQuery, 
  setSearchQuery,
  showMyTasksOnly,
  setShowMyTasksOnly,
  currentUserId,
  profiles,
  onFilterChange,
  activeFilters
}: Props) {
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [localFilters, setLocalFilters] = useState<TaskFilters>(activeFilters);
  const dateRef = useRef<HTMLInputElement>(null);
  const flatpickrInstance = useRef<any>(null);

  // Initialize flatpickr when due date section expands
  useEffect(() => {
    if (dateRef.current && expandedSection === 'dueDate') {
      // Destroy existing instance if any
      if (flatpickrInstance.current) {
        flatpickrInstance.current.destroy();
      }

      flatpickrInstance.current = flatpickr(dateRef.current, {
        mode: 'range',
        dateFormat: 'Y-m-d',
        onChange: (selectedDates) => {
          if (selectedDates.length === 2) {
            const newFilters = {
              ...localFilters,
              dueDateRange: {
                start: selectedDates[0].toISOString().split('T')[0],
                end: selectedDates[1].toISOString().split('T')[0]
              }
            };
            setLocalFilters(newFilters);
            onFilterChange(newFilters);
          }
        },
        onOpen: () => {
          const calendar = document.querySelector('.flatpickr-calendar');
          if (calendar) {
            calendar.classList.add('dropdown-toggle');
          }
        },
        onClose: () => {
          if (dateRef.current) {
            dateRef.current.blur();
          }
          const calendar = document.querySelector('.flatpickr-calendar');
          if (calendar) {
            calendar.classList.remove('dropdown-toggle');
          }
        },
        clickOpens: true,
        allowInput: false
      });

      // Open the calendar immediately
      setTimeout(() => {
        if (flatpickrInstance.current) {
          flatpickrInstance.current.open();
        }
      }, 100);
    }

    return () => {
      if (flatpickrInstance.current && expandedSection !== 'dueDate') {
        flatpickrInstance.current.destroy();
        flatpickrInstance.current = null;
      }
    };
  }, [expandedSection]);

  // Sync local filters with active filters
  useEffect(() => {
    setLocalFilters(activeFilters);
  }, [activeFilters]);

  const handleMyTasksToggle = () => {
    if (!currentUserId) {
      alert('Unable to filter tasks. Please refresh the page.');
      return;
    }
    setShowMyTasksOnly(!showMyTasksOnly);
  };

  const handlePriorityToggle = (priority: string) => {
    const newFilters = {
      ...localFilters,
      priorities: localFilters.priorities.includes(priority)
        ? localFilters.priorities.filter(p => p !== priority)
        : [...localFilters.priorities, priority]
    };
    setLocalFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleAssigneeToggle = (assigneeId: string) => {
    const newFilters = {
      ...localFilters,
      assignees: localFilters.assignees.includes(assigneeId)
        ? localFilters.assignees.filter(a => a !== assigneeId)
        : [...localFilters.assignees, assigneeId]
    };
    setLocalFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearDateRange = () => {
    const newFilters = {
      ...localFilters,
      dueDateRange: { start: null, end: null }
    };
    setLocalFilters(newFilters);
    onFilterChange(newFilters);
    if (flatpickrInstance.current) {
      flatpickrInstance.current.clear();
    }
  };

  const handleClearAll = () => {
    const emptyFilters: TaskFilters = {
      priorities: [],
      dueDateRange: { start: null, end: null },
      assignees: []
    };
    setLocalFilters(emptyFilters);
    onFilterChange(emptyFilters);
    if (flatpickrInstance.current) {
      flatpickrInstance.current.clear();
    }
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (activeFilters.priorities.length > 0) count++;
    if (activeFilters.dueDateRange.start && activeFilters.dueDateRange.end) count++;
    if (activeFilters.assignees.length > 0) count++;
    return count;
  };

  const formatDateRange = () => {
    const { start, end } = localFilters.dueDateRange;
    if (start && end) {
      return `${start} to ${end}`;
    }
    return '';
  };

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const activeFilterCount = getActiveFilterCount();

  return (
    <div className="flex items-center gap-3">
      {/* Search Bar */}
      <div className="flex-1 relative">
        <SearchQuery value={searchQuery} onChange={setSearchQuery} placeholder='Search by task name...'/>
      </div>

      {/* Filter Dropdown */}
      <div className="relative">
        <Button
          size="sm"
          variant={activeFilterCount > 0 ? "primary" : "outline"}
          startIcon={<Filter size={16} />}
          onClick={() => setShowFilterDropdown(!showFilterDropdown)}
          className="px-4 py-3 dropdown-toggle"
        >
          Filter
          {activeFilterCount > 0 && (
            <span className="ml-2 px-1.5 py-0.5 text-xs rounded-full bg-white/20">
              {activeFilterCount}
            </span>
          )}
        </Button>

        <Dropdown 
          isOpen={showFilterDropdown} 
          onClose={() => {
            setShowFilterDropdown(false);
            setExpandedSection(null);
          }}
          className="w-80"
        >
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-800 dark:text-white">
                Filters
              </h3>
              <button
                onClick={handleClearAll}
                className="text-xs font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
              >
                Clear All
              </button>
            </div>

            <div className="space-y-2">
              {/* Priority Section */}
              <div className="border-b border-gray-200 dark:border-gray-700 pb-2">
                <button
                  onClick={() => toggleSection('priority')}
                  className="w-full flex items-center justify-between py-2 px-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Priority {localFilters.priorities.length > 0 && `(${localFilters.priorities.length})`}
                  </span>
                  {expandedSection === 'priority' ? (
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-gray-500" />
                  )}
                </button>
                {expandedSection === 'priority' && (
                  <div className="mt-2 space-y-1 pl-3">
                    {PRIORITY_OPTIONS.map(priority => (
                      <label
                        key={priority}
                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition-colors"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Checkbox
                          checked={localFilters.priorities.includes(priority)}
                          onChange={() => handlePriorityToggle(priority)}
                        />
                        <Badge size="sm" {...getPriorityBadgeProps(priority)}>
                          {priority}
                        </Badge>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* Due Date Section */}
              <div className="border-b border-gray-200 dark:border-gray-700 pb-2">
                <button
                  onClick={() => toggleSection('dueDate')}
                  className="w-full flex items-center justify-between py-2 px-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Due Date {formatDateRange() && '(Set)'}
                  </span>
                  {expandedSection === 'dueDate' ? (
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-gray-500" />
                  )}
                </button>
                {expandedSection === 'dueDate' && (
                  <div className="mt-2 pl-3">
                    <div className="flex items-center gap-2">
                      <div className="relative flex-1">
                        <input
                          ref={dateRef}
                          value={formatDateRange()}
                          onChange={() => {}}
                          onClick={() => {
                            if (flatpickrInstance.current) {
                              flatpickrInstance.current.open();
                            }
                          }}
                          className="w-full h-9 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 py-2 pl-9 pr-3 text-sm font-medium text-gray-700 dark:text-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
                          placeholder="Select date range"
                          readOnly
                        />
                        <div className="pointer-events-none absolute inset-0 left-3 flex items-center">
                          <Calendar className="w-4 h-4 text-gray-400" />
                        </div>
                      </div>
                      {formatDateRange() && (
                        <button
                          onClick={clearDateRange}
                          className="px-3 h-9 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 text-xs font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                        >
                          Clear
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Assigned To Section */}
              <div className="pb-2">
                <button
                  onClick={() => toggleSection('assignees')}
                  className="w-full flex items-center justify-between py-2 px-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Assigned To {localFilters.assignees.length > 0 && `(${localFilters.assignees.length})`}
                  </span>
                  {expandedSection === 'assignees' ? (
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-gray-500" />
                  )}
                </button>
                {expandedSection === 'assignees' && (
                  <div className="mt-2 space-y-1 pl-3 max-h-64 overflow-y-auto custom-scrollbar">
                    {profiles.length === 0 ? (
                      <p className="text-center text-sm text-gray-500 dark:text-gray-400 py-4">
                        No team members available
                      </p>
                    ) : (
                      profiles.map(profile => (
                        <label
                          key={profile.id}
                          className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition-colors"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Checkbox
                            checked={localFilters.assignees.includes(profile.id)}
                            onChange={() => handleAssigneeToggle(profile.id)}
                          />
                          <div className="flex items-center gap-2 flex-1 min-w-0">
                            <Avatar
                              src={profile.avatar_url}
                              name={profile.full_name || profile.email}
                              size="xsmall"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-800 dark:text-white truncate">
                                {profile.full_name || 'Unknown User'}
                              </p>
                            </div>
                          </div>
                        </label>
                      ))
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </Dropdown>
      </div>

      {/* My Tasks Button */}
      <Button
        size="sm"
        variant={showMyTasksOnly ? "primary" : "outline"}
        startIcon={<User size={16} />}
        onClick={handleMyTasksToggle}
        className="px-4 py-3"
      >
        My Tasks
      </Button>
    </div>
  );
}