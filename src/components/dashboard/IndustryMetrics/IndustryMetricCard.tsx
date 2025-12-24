// Flippable metric card for industry/sector data
// Shows front with metric and badge, back with list of companies
import React, { useState } from "react";
import { IndustryMetricCardLoadingSkeleton } from "./IndustryMetricCardLoadingSkeleton";
import { IndustryMetricCardFront } from "./IndustryMetricCardFront";
import { IndustryMetricCardBack } from "./IndustryMetricCardBack";

interface IndustryMetricCardProps {
  icon: React.ReactNode;
  titleTop: string;
  titleBottom: string;
  value: string;
  badgeText?: string;
  companies?: string[];
  loading?: boolean;
  comparisonValue?: string;
}

export const IndustryMetricCard = ({
  icon,
  titleTop,
  titleBottom,
  value,
  badgeText,
  companies,
  loading = false,
  comparisonValue,
}: IndustryMetricCardProps) => {
  const [flipped, setFlipped] = useState(false);

  if (loading) {
    return <IndustryMetricCardLoadingSkeleton />;
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
        <IndustryMetricCardFront
          icon={icon}
          titleTop={titleTop}
          titleBottom={titleBottom}
          value={value}
          badgeText={badgeText}
          comparisonValue={comparisonValue}
        />
        <IndustryMetricCardBack companies={companies} />
      </div>
    </div>
  );
};