'use client';

import { useState } from 'react';
import { 
  BookOpen, 
  Bell, 
  BarChart3, 
  Users, 
  HelpCircle,
  FileText,
  MessageSquare, 
  KanbanIcon
} from 'lucide-react';

type TabId = 'getting-started' | 'profile' | 'dashboard' | 'attendance' | 'project-board' | 'kanban' | 'manpower' | 'innopoll' | 'friends' | 'faq';

interface Tab {
  id: TabId;
  label: string;
  icon: React.ReactNode;
}

const tabs: Tab[] = [
  { id: 'getting-started', label: 'Getting Started', icon: <BookOpen className="w-4 h-4" /> },
  { id: 'profile', label: 'Profile', icon: <Users className="w-4 h-4" /> },
  { id: 'dashboard', label: 'Dashboard', icon: <BookOpen className="w-4 h-4" /> },
  { id: 'attendance', label: 'Attendance', icon: <FileText className="w-4 h-4" /> },
  { id: 'project-board', label: 'Project Board', icon: <BarChart3 className="w-4 h-4" /> },
  { id: 'kanban', label: 'Kanban', icon: <KanbanIcon className="w-4 h-4" /> },
  { id: 'manpower', label: 'Manpower', icon: <Users className="w-4 h-4" /> },
  { id: 'innopoll', label: 'InnoPoll', icon: <MessageSquare className="w-4 h-4" /> },
  { id: 'friends', label: 'Friends', icon: <Users className="w-4 h-4" /> },
  { id: 'faq', label: 'FAQ', icon: <HelpCircle className="w-4 h-4" /> },
];

export default function SupportPage() {
  const [activeTab, setActiveTab] = useState<TabId>('getting-started');

  return (
      <div className="max-w-8xl mx-auto">
        {/* Main Content */}
        <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-800/50">
          <div className="flex flex-col lg:flex-row">
            {/* Sidebar Navigation */}
            <div className="lg:w-64 border-b lg:border-b-0 lg:border-r border-gray-200 dark:border-gray-700">
              <nav className="p-4 space-y-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`
                      w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200
                      ${activeTab === tab.id
                        ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
                        : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700/50'
                      }
                    `}
                  >
                    {tab.icon}
                    <span>{tab.label}</span>
                  </button>
                ))}
              </nav>
            </div>

            {/* Content Area */}
            <div className="flex-1 p-6 lg:p-8">
              {activeTab === 'getting-started' && <GettingStartedContent />}
              {activeTab === 'profile' && <ProfileContent />}
              {activeTab === 'dashboard' && <DashboardContent />}
              {activeTab === 'attendance' && <AttendanceContent />}
              {activeTab === 'project-board' && <ProjectBoardContent />}
              {activeTab === 'kanban' && <KanbanContent />}
              {activeTab === 'manpower' && <ManpowerContent />}
              {activeTab === 'innopoll' && <InnoPollContent />}
              {activeTab === 'friends' && <FriendsContent />}
              {activeTab === 'faq' && <FAQContent />}
            </div>
          </div>
        </div>
      </div>
  );
}

// Content Components
function GettingStartedContent() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Getting Started
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Welcome to the UXC System! Here's everything you need to get started.
        </p>
      </div>

      <div className="space-y-4">
        <Section title="1. Sign In">
          <p>
            It is preferred to use one Gmail account and not multiple accounts for signing in to the UXC System. 
            This ensures consistency across all features and simplifies account management.
          </p>
          
          <p>
            After logging in, you will be directed to your home page where you can view all your projects 
            and tasks at a glance. The home page provides a comprehensive overview of your current work, 
            upcoming deadlines, and recent activity.
          </p>
        </Section>

        <Section title="2. Complete Your Profile">
          <p>
            If this is your first time logging in or you're using a new Gmail account, you should complete 
            the details in the Profile page. Navigate to the Profile page in the user dropdown menu to add your information.
          </p>
          
          <p>
            You can upload your profile picture and banner image, which will be used across all features in the system. 
            A complete profile helps your team members identify and collaborate with you more effectively.
          </p>
        </Section>

        <Section title="3. Explore the Features">
          <p>
            Once your profile is set up, you can start exploring the various features available:
          </p>
          <ul className="list-disc list-inside ml-4 space-y-1">
            <li>UXC Learning Journey - Dashboard summarizing data from the learning journey attendance</li>
            <li>CET Training - Dashboard summarizing data from the CET training attendance</li>
            <li>Attendance - Create, view, edit, and manage LJ and CET attendance records</li>
            <li>Project Board - Create and manage projects with team member assignments</li>
            <li>Kanban - Drag-and-drop task management with detailed task views and comments</li>
            <li>Manpower - View team workload, project assignments, and availability</li>
            <li>InnoPoll - Create, manage, and analyze quizzes with QR code access</li>
            <li>Friends - View profiles and information about your colleagues</li>
          </ul>
        </Section>
      </div>
    </div>
  );
}

function ProfileContent() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Profile
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Manage your personal information and preferences.
        </p>
      </div>

      <div className="space-y-4">
        <Section title="Accessing Your Profile">
          <p>
            Access your profile by clicking on your profile picture or name in the user dropdown menu at the top right 
            of the screen, then select "Profile" from the menu.
          </p>
        </Section>

        <Section title="Profile Information">
          <p>
            Your profile contains important information that helps your team identify and connect with you:
          </p>
          <ul className="list-disc list-inside ml-4 space-y-1">
            <li>First name and last name</li>
            <li>Email address</li>
            <li>Job title and role</li>
            <li>Bio or description</li>
            <li>Birthday</li>
            <li>Phone number</li>
            <li>Address, city, postal code, and country</li>
            <li>Social media links (LinkedIn, Instagram, Facebook, Twitter)</li>
          </ul>
        </Section>

        <Section title="Profile and Banner Pictures">
          <p>
            Upload a profile picture and banner image to personalize your account. Your profile picture will be displayed 
            throughout the system in projects, tasks, comments, and the manpower board. The banner image appears at the 
            top of your profile page.
          </p>
          <p>
            To update your images, click on the current picture (for profile) or the edit button (for banner) and select a new image from your device.
          </p>
        </Section>

        <Section title="Editing Your Profile">
          <p>
            You can edit your profile information at any time. Simply navigate to the Profile page, make your changes, 
            and click "Save Changes". Your updates will be reflected immediately across the entire system.
          </p>
        </Section>

        <Section title="Deleting Your Account">
          <p>
            If you need to delete your account, you can do so from the Profile page by clicking the "Delete Account" 
            button. This action is permanent and will remove all your data from the system. You will be signed out and 
            redirected to the sign-in page.
          </p>
        </Section>
      </div>
    </div>
  );
}

function DashboardContent() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Dashboard
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Get an overview of your learning journey and CET training attendance.
        </p>
      </div>

      <div className="space-y-4">
        <Section title="Dashboard Overview">
          <p>
            The UXC dashboard provides comprehensive visualizations and statistics to help you understand attendance patterns 
            and trends for both Learning Journey (LJ) and CET Training programs.
          </p>
        </Section>

        <Section title="Switching Between Dashboards">
          <p>
            Toggle between the Non-PACE and PACE dashboards using the switcher at the top of the dashboard page. Each 
            dashboard displays data specific to its program type.
          </p>
        </Section>

        <Section title="Using Date Filters">
          <p>
            Customize your data view using the powerful filter options:
          </p>
          <ul className="list-disc list-inside ml-4 space-y-1">
            <li><strong>Calendar Year:</strong> View data for a specific calendar year</li>
            <li><strong>Financial Year:</strong> Filter by financial year periods</li>
            <li><strong>Quarterly:</strong> Analyze data by quarters (Q1, Q2, Q3, Q4)</li>
            <li><strong>Custom Date Range:</strong> Select specific start and end dates for detailed analysis</li>
          </ul>
        </Section>

        <Section title="Comparison Feature">
          <p>
            Compare attendance data across different time periods to identify trends and changes:
          </p>
          <ol className="list-decimal list-inside ml-4 space-y-1">
            <li>Click the "Compare" toggle to enable comparison mode</li>
            <li>Select your primary time period using the main date filters</li>
            <li>Choose a comparison period from the dropdown menu</li>
            <li>View side-by-side comparisons of key metrics and visualizations</li>
          </ol>
        </Section>

        <Section title="Resetting Filters">
          <p>
            Clear all applied filters and return to the default view by clicking the "Reset" button. This removes all 
            active filters and comparison settings.
          </p>
        </Section>
      </div>
    </div>
  );
}

function AttendanceContent() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Attendance
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Manage learning journey and CET training attendance records.
        </p>
      </div>

      <div className="space-y-4">
        <Section title="Creating Attendance Records">
          <p>
            To create a new attendance record:
          </p>
          <ol className="list-decimal list-inside ml-4 space-y-1">
            <li>Navigate to the Attendance page from the sidebar</li>
            <li>Click "Log new visit" (for LJ) or "Add new workshop" (for CET)</li>
            <li>Fill in the required details:
              <ul className="list-disc list-inside ml-6 mt-1">
                <li>Company name or course title</li>
                <li>Visit or workshop date</li>
                <li>Total registered participants</li>
                <li>Total attended participants</li>
                <li>Session details and notes</li>
              </ul>
            </li>
            <li>Click "Log visit" or "Create workshop" to save</li>
          </ol>
        </Section>

        <Section title="Viewing Attendance Records">
          <p>
            All attendance records are displayed in a table format showing key information such as company name, start & end date, 
            attendance numbers. Click on the expand icon to view detailed information including session details, 
            attendance metrics, and participant information.
          </p>
        </Section>

        <Section title="Filtering Records">
          <p>
            Use the filter options to quickly find specific records:
          </p>
          <ul className="list-disc list-inside ml-4 space-y-1">
            <li>Filter by date range</li>
            <li>Search by company name or course title</li>
            <li>Filter by attendance status or completion</li>
            <li>Sort by date, attendance rate, or other metrics</li>
          </ul>
        </Section>

        <Section title="Editing Attendance Records">
          <p>
            To edit an existing record:
          </p>
          <ol className="list-decimal list-inside ml-4 space-y-1">
            <li>Locate the record you want to edit</li>
            <li>Click the edit icon</li>
            <li>Modify the necessary fields</li>
            <li>Click "Save changes" to update the record</li>
          </ol>
        </Section>

        <Section title="Deleting Records">
          <p>
            To delete an attendance record, click the delete icon next to the record.
            Note that this action cannot be undone, so make sure you want to permanently remove the record.
          </p>
        </Section>

        <Section title="Exporting Records">
          <p>
            Export your attendance data for external analysis or reporting:
          </p>
          <ol className="list-decimal list-inside ml-4 space-y-1">
            <li>Click the "Export" button</li>
            <li>Apply any desired filters to select specific records</li>
            <li>Click the export button</li>
            <li>The file will be downloaded to your device</li>
          </ol>
        </Section>
      </div>
    </div>
  );
}

function ProjectBoardContent() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Project Board
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Create and manage projects with your team.
        </p>
      </div>

      <div className="space-y-4">
        <Section title="Creating a New Project">
          <p>
            To create a new project:
          </p>
          <ol className="list-decimal list-inside ml-4 space-y-1">
            <li>Click the "New Project" button on the Project Board page</li>
            <li>Fill in the project details:
              <ul className="list-disc list-inside ml-6 mt-1">
                <li>Project name</li>
                <li>Description</li>
                <li>Start and end dates</li>
                <li>Project Manager & Lead</li>
              </ul>
            </li>
            <li>Select team members to assign to the project</li>
            <li>Click the tick icon to save</li>
          </ol>
        </Section>

        <Section title="Viewing Project Details">
          <p>
            Click on any project card to open the project side panel. The side panel displays comprehensive information 
            including project description, timeline, assigned team members, and recent activity.
          </p>
        </Section>

        <Section title="Accessing the Kanban Board">
          <p>
            To access a project's Kanban board:
          </p>
          <ol className="list-decimal list-inside ml-4 space-y-1">
            <li>Click on a project to open its side panel</li>
            <li>Look for the yellow Kanban icon in the side panel</li>
            <li>Click the Kanban icon to navigate to the project's task board</li>
          </ol>
        </Section>

        <Section title="Editing Projects">
          <p>
            To edit a project:
          </p>
          <ol className="list-decimal list-inside ml-4 space-y-1">
            <li>Open the project side panel by clicking on the project</li>
            <li>Click on the pencil icon</li>
            <li>Modify the project details or team members</li>
            <li>Click on the tick icon to update</li>
          </ol>
        </Section>

        <Section title="Deleting Projects">
          <p>
            To delete a project:
          </p>
          <ol className="list-decimal list-inside ml-4 space-y-1">
            <li>Open the project side panel</li>
            <li>Click on the trash can icon</li>
            <li>Confirm the deletion when prompted</li>
          </ol>
          <p className="mt-2">
            Note: Deleting a project will also remove all associated tasks and data. This action cannot be undone.
          </p>
        </Section>

        <Section title="Managing Team Members">
          <p>
            Add or remove team members from a project at any time through the project edit interface.
          </p>
        </Section>
      </div>
    </div>
  );
}

function KanbanContent() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Kanban Board
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Manage tasks with drag-and-drop functionality and detailed task views.
        </p>
      </div>

      <div className="space-y-4">
        <Section title="Accessing the Kanban Board">
          <p>
            Access the Kanban board through the Project Board:
          </p>
          <ol className="list-decimal list-inside ml-4 space-y-1">
            <li>Navigate to the Project Board</li>
            <li>Click on a project to open its side panel</li>
            <li>Click the yellow Kanban icon in the side panel</li>
          </ol>
        </Section>

        <Section title="Understanding Task Columns">
          <p>
            The Kanban board is organized into columns representing different task stages (e.g., To Do, In Progress, 
            Review, Done). Tasks flow from left to right as they progress through your workflow.
          </p>
        </Section>

        <Section title="Creating Tasks">
          <p>
            To create a new task:
          </p>
          <ol className="list-decimal list-inside ml-4 space-y-1">
            <li>Click the "Create Task" button at the top of the Kanban board</li>
            <li>Enter task details:
              <ul className="list-disc list-inside ml-6 mt-1">
                <li>Task title</li>
                <li>Description</li>
                <li>Assigned team member(s)</li>
                <li>Due date</li>
                <li>Priority level</li>
              </ul>
            </li>
            <li>Click the tick icon to save</li>
          </ol>
        </Section>

        <Section title="Drag-and-Drop Functionality">
          <p>
            Move tasks between columns by dragging and dropping:
          </p>
          <ol className="list-decimal list-inside ml-4 space-y-1">
            <li>Click and hold on a task card</li>
            <li>Drag it to the desired column</li>
            <li>Release to drop the task in its new position</li>
          </ol>
          <p className="mt-2">
            The task status will automatically update based on the column it's placed in.
          </p>
        </Section>

        <Section title="Viewing Detailed Task Information">
          <p>
            To view complete task details:
          </p>
          <ol className="list-decimal list-inside ml-4 space-y-1">
            <li>Locate the expand button on the top right corner of any task card</li>
            <li>Click the expand button to open the task side panel</li>
            <li>View all task information including details, timeline, assignees, description and comments</li>
          </ol>
        </Section>

        <Section title="Adding Comments">
          <p>
            Collaborate with your team through task comments:
          </p>
          <ol className="list-decimal list-inside ml-4 space-y-1">
            <li>Open the task side panel</li>
            <li>Scroll to the discussions section</li>
            <li>Type your comment in the text field</li>
            <li>Click up arrow icon to add your comment</li>
          </ol>
          <p className="mt-2">
            Comments are visible to all project members and include timestamps and author information.
            You can also edit and delete your own comments by hovering over them.
          </p>
        </Section>

        <Section title="Editing Tasks">
          <p>
            Edit any task by clicking on it to open the side panel, then click the pencil icon. Modify any field and 
            save your changes by clicking the tick icon.
          </p>
        </Section>

        <Section title="Deleting Tasks">
          <p>
            To delete a task, open the task side panel and click the trash can icon. The action cannot be undone.
          </p>
        </Section>

        <Section title="Table View">
          <p>
            Switch to table view for a different perspective:
          </p>
          <ol className="list-decimal list-inside ml-4 space-y-1">
            <li>Click the "Table View" button at the top of the Kanban board</li>
            <li>View all tasks in a sortable, filterable table format</li>
            <li>Click on any row to view or edit task details</li>
          </ol>
        </Section>

        <Section title="Filtering Tasks">
          <p>
            Use filters to focus on specific tasks:
          </p>
          <ul className="list-disc list-inside ml-4 space-y-1">
            <li><strong>Priority:</strong> Filter by Critical, High, Medium, or Low priority</li>
            <li><strong>Assigned To:</strong> Show tasks assigned to specific team members</li>
            <li><strong>Due Date:</strong> Filter by date ranges or overdue tasks</li>
            <li><strong>My Tasks:</strong> Quickly view only tasks assigned to you</li>
          </ul>
            <p className="mt-2">
              The Gantt chart uses similar filtering options to help you focus on relevant tasks and timelines.
            </p>
        </Section>

        <Section title="Gantt Chart View">
          <p>
            Visualize project timelines with the Gantt chart:
          </p>
          <ol className="list-decimal list-inside ml-4 space-y-1">
            <li>Located below the Kanban board</li>
            <li>View all tasks plotted on a timeline</li>
            <li>Drag task bars left or right to adjust due dates</li>
          </ol>
          <p className="mt-2">
            The Gantt chart helps you identify scheduling conflicts and visualize project progress over time.
          </p>
        </Section>
      </div>
    </div>
  );
}

function ManpowerContent() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Manpower Board
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          View team workload, project assignments, and availability.
        </p>
      </div>

      <div className="space-y-4">
        <Section title="Overview">
          <p>
            The Manpower Board provides a comprehensive view of your team's workload distribution, helping you identify 
            who is available for new assignments and who might be overloaded.
          </p>
        </Section>

        <Section title="Viewing Team Workload">
          <p>
            The Manpower Board displays each team member with the following information:
          </p>
          <ul className="list-disc list-inside ml-4 space-y-1">
            <li>Total number of projects assigned</li>
            <li>Total number of tasks assigned</li>
            <li>Current availability status</li>
            <li>Number for each roles taken</li>
            <li>Profile picture, email and name</li>
          </ul>
        </Section>

        <Section title="Understanding Availability">
          <p>
            Team members are categorized by their workload:
          </p>
          <ul className="list-disc list-inside ml-4 space-y-1">
            <li><strong>Available:</strong> Has capacity for additional work</li>
            <li><strong>Busy:</strong> Currently working on an average number of tasks (More than 2 core or 3 support)</li>
            <li><strong>Overloaded:</strong> Working on many tasks and projects (More than 5 core or 5 support)</li>
          </ul>
          <p className="mt-2">
            Use this information to make informed decisions when assigning new projects and tasks. Project Manager and Lead
            are counted as part of core roles.
          </p>
        </Section>

        <Section title="Resource Planning">
          <p>
            Use the Manpower Board for effective resource planning:
          </p>
          <ul className="list-disc list-inside ml-4 space-y-1">
            <li>Identify team members with available capacity before starting new projects</li>
            <li>Balance workload across the team</li>
            <li>Spot potential bottlenecks or overallocation</li>
            <li>Make data-driven decisions about task assignments</li>
          </ul>
        </Section>
      </div>
    </div>
  );
}

function InnoPollContent() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          InnoPoll
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Create and manage quizzes for Learning Journey sessions.
        </p>
      </div>

      <div className="space-y-4">
        <Section title="Creating a Quiz">
          <p>
            To create a new quiz:
          </p>
          <ol className="list-decimal list-inside ml-4 space-y-1">
            <li>Navigate to the InnoPoll page</li>
            <li>Click "Create Quiz" or "New Quiz"</li>
            <li>Enter quiz details:
              <ul className="list-disc list-inside ml-6 mt-1">
                <li>Quiz title</li>
                <li>Description or instructions</li>
                <li>Time limit (optional)</li>
              </ul>
            </li>
            <li>Add questions:
              <ul className="list-disc list-inside ml-6 mt-1">
                <li>Question text</li>
                <li>Question type (multiple choice, true/false, etc.)</li>
                <li>Answer options</li>
                <li>Correct answer</li>
                <li>Points value</li>
              </ul>
            </li>
            <li>Click "Create Quiz" to save</li>
          </ol>
        </Section>

        <Section title="Managing Your Quizzes">
          <p>
            All quizzes you create appear in your InnoPoll dashboard. You can edit or delete any quiz you own at any time.
          </p>
        </Section>

        <Section title="Editing Quizzes">
          <p>
            To edit an existing quiz:
          </p>
          <ol className="list-decimal list-inside ml-4 space-y-1">
            <li>Find your quiz in the list</li>
            <li>Click the edit icon or button</li>
            <li>Modify quiz settings, questions, or answers</li>
            <li>Click "Save Changes"</li>
          </ol>
          <p className="mt-2">
            Note: If participants have already completed the quiz, editing questions may affect the accuracy of existing results.
          </p>
        </Section>

        <Section title="Deleting Quizzes">
          <p>
            To delete a quiz, click the delete icon next to the quiz. Confirm the deletion when prompted. This will 
            permanently remove the quiz and all associated participant data.
          </p>
        </Section>

        <Section title="Viewing Participant Completion Rate">
          <p>
            To view how many participants have completed your quiz:
          </p>
          <ol className="list-decimal list-inside ml-4 space-y-1">
            <li>Find your quiz in the list</li>
            <li>Click the person icon next to the quiz</li>
            <li>View statistics including:
              <ul className="list-disc list-inside ml-6 mt-1">
                <li>Total number of participants</li>
                <li>Number who completed the quiz</li>
                <li>Completion percentage</li>
                <li>Individual participant progress</li>
              </ul>
            </li>
          </ol>
        </Section>

        <Section title="Viewing Participant Averages">
          <p>
            To view average scores and performance metrics:
          </p>
          <ol className="list-decimal list-inside ml-4 space-y-1">
            <li>Find your quiz in the list</li>
            <li>Click the eye icon next to the quiz</li>
            <li>View detailed analytics including:
              <ul className="list-disc list-inside ml-6 mt-1">
                <li>Average score across all participants</li>
                <li>Highest and lowest scores</li>
                <li>Question-by-question performance breakdown</li>
                <li>Common incorrect answers</li>
                <li>Time taken to complete</li>
              </ul>
            </li>
          </ol>
        </Section>

        <Section title="QR Code Access">
          <p>
            Make it easy for participants to join your quiz using QR codes:
          </p>
          <ol className="list-decimal list-inside ml-4 space-y-1">
            <li>Find your quiz in the list</li>
            <li>Click the eye icon (same as viewing analytics)</li>
            <li>Look for the QR code in the quiz details</li>
            <li>Participants can scan the QR code with their mobile devices to instantly access the quiz</li>
            <li>Display the QR code during Learning Journey sessions for quick access</li>
          </ol>
        </Section>

        <Section title="Best Practices">
          <p>
            Tips for creating effective quizzes:
          </p>
          <ul className="list-disc list-inside ml-4 space-y-1">
            <li>Keep questions clear and concise</li>
            <li>Test your quiz before sharing with participants</li>
            <li>Use the QR code feature during in-person sessions</li>
            <li>Review participant averages to identify areas where additional training may be needed</li>
            <li>Update quiz content based on feedback and performance data</li>
          </ul>
        </Section>
      </div>
    </div>
  );
}

function FriendsContent() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Friends
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          View profiles and connect with your colleagues.
        </p>
      </div>

      <div className="space-y-4">
        <Section title="Accessing the Friends Page">
          <p>
            The Friends page is located in the user dropdown menu at the top right of the screen. Click on your profile 
            picture or name, then select "Friends" from the menu.
          </p>
        </Section>

        <Section title="Viewing Colleague Profiles">
          <p>
            The Friends page displays all users who have created profiles in the UXC System. You can view basic information 
            about your colleagues to help you get to know your team better.
          </p>
        </Section>

        <Section title="Information Available">
          <p>
            When viewing colleague profiles, you can see (if they have provided the information):
          </p>
          <ul className="list-disc list-inside ml-4 space-y-1">
            <li>Profile picture and banner</li>
            <li>Full name</li>
            <li>Job title and role</li>
            <li>Bio or description</li>
            <li>Birthday (useful for team celebrations)</li>
            <li>Contact information (email, phone)</li>
            <li>Social media links</li>
            <li>When they joined the system</li>
          </ul>
        </Section>

        <Section title="Using the Friends Page">
          <p>
            Common uses for the Friends page include:
          </p>
          <ul className="list-disc list-inside ml-4 space-y-1">
            <li>Finding contact information for colleagues</li>
            <li>Checking team members' birthdays</li>
            <li>Learning more about new team members</li>
            <li>Finding colleagues' social media profiles for professional networking</li>
            <li>Understanding team structure and roles</li>
          </ul>
        </Section>

        <Section title="Privacy and Visibility">
          <p>
            All information displayed on the Friends page comes from user profiles. Only users who have created and 
            completed their profiles will appear in this section. The information visible is what each user has chosen 
            to add to their profile.
          </p>
        </Section>
      </div>
    </div>
  );
}

function FAQContent() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Frequently Asked Questions
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Quick answers to common questions.
        </p>
      </div>

      <div className="space-y-4">
        <FAQ 
          question="How do I reset my password?"
          answer="Navigate to Settings → Security and click 'Change Password'. You'll receive an email with instructions to reset your password."
        />
        
        <FAQ 
          question="Can I use multiple Gmail accounts?"
          answer="It is preferred to use only one Gmail account to sign in to the UXC System. This ensures consistency and simplifies your experience across all features."
        />
        
        <FAQ 
          question="How do I update my profile picture?"
          answer="Go to the Profile page from the user dropdown menu and click on your current profile picture or the upload area. Select a new image from your device. Your updated picture will be reflected across the entire system."
        />
        
        <FAQ 
          question="Where can I view my tasks?"
          answer="You can view your tasks in two places: (1) Your dashboard shows an overview of all assigned tasks, (2) Navigate to a project's Kanban board for detailed task management. Use the 'My Tasks' filter to quickly see only tasks assigned to you."
        />
        
        <FAQ 
          question="What should I do on my first login?"
          answer="On your first login, complete your profile by navigating to the Profile page from the user dropdown menu. Fill in all required information including your name, job title, bio, and upload a profile picture and banner image."
        />
        
        <FAQ 
          question="How do I access a project's Kanban board?"
          answer="Click on a project from the Project Board to open its side panel, then click the yellow Kanban icon to access the task board."
        />
        
        <FAQ 
          question="Can I edit attendance records after creating them?"
          answer="Yes, you can edit any attendance record by clicking the edit icon next to the record. Make your changes and click 'Save changes' to update."
        />
        
        <FAQ 
          question="How do I export attendance data?"
          answer="Navigate to the Attendance page, apply any desired filters, then click the 'Export' button. Choose your preferred format (CSV or Excel) and the file will be downloaded to your device."
        />
        
        <FAQ 
          question="How do I add comments to a task?"
          answer="Open the task by clicking the expand button on the top right corner of the task card. In the task side panel, scroll to the comments section, type your comment, and click 'Post'."
        />
        
        <FAQ 
          question="What is the Gantt chart view?"
          answer="The Gantt chart view displays all tasks on a timeline, allowing you to visualize project schedules and dependencies. You can drag task bars to adjust due dates directly from the Gantt view."
        />
        
        <FAQ 
          question="How do I check team workload?"
          answer="Navigate to the Manpower Board to see how many projects and tasks each team member is working on, along with their availability status."
        />
        
        <FAQ 
          question="How do participants access my InnoPoll quiz?"
          answer="Participants can access your quiz by scanning the QR code displayed in the quiz details (click the eye icon next to your quiz). This is especially useful during in-person Learning Journey sessions."
        />
        
        <FAQ 
          question="Can I see who completed my quiz?"
          answer="Yes, click the person icon next to your quiz to view participant completion rates and individual progress."
        />
        
        <FAQ 
          question="How do I delete my account?"
          answer="Navigate to your Profile page and click the 'Delete Account' button. Confirm the deletion when prompted. Note that this action is permanent and will remove all your data from the system."
        />
        
        <FAQ 
          question="Where can I find colleague contact information?"
          answer="Visit the Friends page from the user dropdown menu to view profiles and contact information for all colleagues who have created profiles in the system."
        />
        
        <FAQ 
          question="Is there a mobile app?"
          answer="The UXC System is fully responsive and works great on mobile browsers. Native iOS and Android apps are planned for future release."
        />
      </div>
    </div>
  );
}

// Helper Components
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-gray-50 dark:bg-gray-900/50 p-5 rounded-lg">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
        {title}
      </h3>
      <div className="text-gray-700 dark:text-gray-300 space-y-2">
        {children}
      </div>
    </div>
  );
}

function FAQ({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
      >
        <span className="font-medium text-gray-900 dark:text-white">
          {question}
        </span>
        <svg
          className={`w-5 h-5 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isOpen && (
        <div className="p-4 pt-0 text-gray-600 dark:text-gray-400">
          {answer}
        </div>
      )}
    </div>
  );
}