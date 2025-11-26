import Badge from "@/components/ui/badge/Badge";
import Avatar from "@/components/ui/avatar/Avatar";
import { Project } from "@/types/project";

interface Props {
  project: Project;
  onClick: () => void;
  showDates: boolean;
  getStatusBadgeProps: (status: string) => any;
}

export default function ProjectTableRow({ project, onClick, showDates, getStatusBadgeProps }: Props) {
  return (
    <tr onClick={onClick} className="hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors cursor-pointer">
      <td className="px-5 py-4 text-sm text-gray-500 dark:text-gray-400 text-left">
        {project.project_name}
      </td>
      <td className="px-4 py-4 text-sm text-left">
        <div className="flex items-center gap-2 min-w-0">
          <Avatar 
            src={project.project_manager.avatar_url}
            name={project.project_manager.name}
            size="medium"
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-800 dark:text-white truncate">
              {project.project_manager.name}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
              {project.project_manager.email}
            </p>
          </div>
        </div>
      </td>
      {showDates && (
        <>
          <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-400 text-center">
            {project.start_date}
          </td>
          <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-400 text-center">
            {project.end_date}
          </td>
        </>
      )}
      <td className="px-4 py-4 text-center">
        <div className="flex items-center justify-center gap-2">
          <div className="w-24 bg-gray-200 rounded-full h-2 dark:bg-gray-700">
            <div className="bg-blue-600 h-2 rounded-full transition-all duration-300" style={{ width: `${project.progress}%` }}></div>
          </div>
          <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">{project.progress}%</span>
        </div>
      </td>
      <td className="px-4 py-4 text-center">
        <Badge size="sm" {...getStatusBadgeProps(project.status)}>
          {project.status}
        </Badge>
      </td>
    </tr>
  );
}