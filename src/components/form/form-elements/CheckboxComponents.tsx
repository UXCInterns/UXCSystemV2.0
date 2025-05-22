"use client";
import React, { useState } from "react";
// import ComponentCard from "../../common/ComponentCard";
import Checkbox from "../input/Checkbox";
import Label from "../Label";

export default function CheckboxComponents() {
  const [isChecked, setIsChecked] = useState(false);
  const [isCheckedTwo, setIsCheckedTwo] = useState(false);
  return (
      <div className="flex items-center gap-4">
        <div>
          <Label>Conversion</Label>
        </div>
        <div className="flex items-center gap-3">
          <Checkbox checked={isChecked} onChange={setIsChecked} />
          <span className="block text-sm font-medium text-gray-700 dark:text-gray-400">
            Training
          </span>
        </div>
        <div className="flex items-center gap-3">
          <Checkbox checked={isCheckedTwo} onChange={setIsCheckedTwo} />
          <span className="block text-sm font-medium text-gray-700 dark:text-gray-400">
            Consultancy
          </span>
        </div>

      </div>
  );
}
