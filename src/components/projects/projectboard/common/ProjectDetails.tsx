"use client"

import React from "react";
import { Modal } from "@/components/ui/modal/index";
import Label from "@/components/form/Label";
import Radio from "@/components/form/input/Radio";
import Input from "@/components/form/input/InputField";
import TextArea from "@/components/form/input/TextArea";
import { Project } from "@/types/project";


interface ProjectDetailsModalProps {
    project: Project | null;
    isOpen: boolean;
    onClose: () => void;
    onDelete?:(id:string) => Promise<void>;
}


const ProjectDetailsModal: React.FC<ProjectDetailsModalProps> = ({
    project,
    isOpen,
    onClose,

}) => {
    if (!project) return null;

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            className="max-w-5xl max-h-[90vh] p-6 flex flex-col"
        >
            {/* Title */}
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-6">
                {project.project_name}
            </h2>

            {/* Scrollable content */}
            <div className="w-full max-h-[60vh] overflow-y-auto custom-scrollbar">
                <div className="w-full space-y-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-700 pb-2">
                        Company Information
                    </h3>

                    <div className="space-y-4">
                        <div className="w-full">
                            <Label>Project Details:</Label>
                            <Input
                                type="text"
                                value={project.description}
                                disabled
                                className="font-mono w-full"
                            />
                        </div>
                        <div className="w-full">
                            <Label>Team:</Label>
                            <Input
                                type="text"
                                value={
                                    project.project_members && project.project_members.length > 0
                                        ? project.project_members.map((member) => member.role).join(", ")
                                        : ""
                                }
                                disabled
                                className="font-mono w-full"
                            />
                        </div>
                        <div className="w-full">
                            <Label>Time Line</Label>
                            <Input
                                type="text"
                                value={`${project.start_date} → ${project.end_date}`}
                                disabled
                                className="font-mono w-full"
                            />
                        </div>
                        <div className="w-full">
                            <Label>Project's Status</Label>
                            <Input
                                type="text"
                                value={project.status}
                                disabled
                                className="font-mono w-full"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    )
}




export default ProjectDetailsModal;