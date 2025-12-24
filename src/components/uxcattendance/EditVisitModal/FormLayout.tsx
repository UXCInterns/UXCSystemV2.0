import React from "react";

interface FormLayoutProps {
  leftColumn: React.ReactNode;
  rightColumn: React.ReactNode;
  fullWidth?: React.ReactNode;
}

const FormLayout: React.FC<FormLayoutProps> = ({ 
  leftColumn, 
  rightColumn, 
  fullWidth 
}) => {
  return (
    <div className="flex-1 max-h-[60vh] overflow-y-auto custom-scrollbar px-2">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">{leftColumn}</div>
        <div className="space-y-6">{rightColumn}</div>
      </div>
      {fullWidth && <div>{fullWidth}</div>}
    </div>
  );
};

export default FormLayout;