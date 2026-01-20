import React from "react";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import DetailsSection from "./DetailsSection";
import { Visit } from "@/types/LearningJourneyAttendanceTypes/visit";
import { formatCurrency } from "@/utils/ViewDetailsModalUtils/formatUtils";
import { useUser } from "@/hooks/useUser";

interface RevenueDisplayProps {
  visit: Visit;
}

const RevenueDisplay: React.FC<RevenueDisplayProps> = ({ visit }) => {
  const { role, loading } = useUser();

  // Check if the user's role is Center Director or Senior Director
  const canViewRevenue = React.useMemo(() => {
    if (!role) return false;
    const normalizedRole = role.toLowerCase().trim();
    return normalizedRole === "center director" || normalizedRole === "senior director" ||  normalizedRole === "centre director";
  }, [role]);

  // Function to get the display value based on permissions
  const getDisplayValue = () => {
    if (loading) {
      return "Loading...";
    }
    
    if (!canViewRevenue) {
      return "You do not have permission to view revenue data";
    }
    
    return visit.revenue > 0 ? formatCurrency(visit.revenue) : "No Revenue Generated";
  };

  return (
    <DetailsSection title="Financial Impact">
      <div>
        <Label>Revenue Generated</Label>
        <Input
          type="text"
          value={getDisplayValue()}
          disabled={true}
          className={`text-2xl font-bold ${
            !canViewRevenue || loading
              ? "bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400"
              : "bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-800"
          }`}
        />
      </div>
    </DetailsSection>
  );
};

export default RevenueDisplay;