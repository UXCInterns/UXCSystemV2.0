// Flippable metric card component showing value on front and company list on back
import React, { useState } from "react";
import { MetricCardLoadingSkeleton } from "./MetricCardLoadingSkeleton";
import { MetricCardFront } from "./MetricCardFront";
import { MetricCardBack } from "./MetricCardBack";

interface MetricCardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  badge: React.ReactNode;
  companies: string[];
  comparisonValue?: string;
  loading?: boolean;
}

export const MetricCard = ({
  icon,
  title,
  value,
  badge,
  companies,
  comparisonValue,
  loading = false,
}: MetricCardProps) => {
  const [flipped, setFlipped] = useState(false);

  if (loading) {
    return <MetricCardLoadingSkeleton />;
  }

  return (
    <div 
      className="relative w-full cursor-pointer [perspective:1000px]" 
      onClick={() => setFlipped((prev) => !prev)}
    >
      <div 
        className={`inset-0 transition-transform duration-500 [transform-style:preserve-3d] ${
          flipped ? "[transform:rotateY(180deg)]" : ""
        }`}
      >
        <MetricCardFront
          icon={icon}
          title={title}
          value={value}
          badge={badge}
          comparisonValue={comparisonValue}
        />
        <MetricCardBack companies={companies} />
      </div>
    </div>
  );
};