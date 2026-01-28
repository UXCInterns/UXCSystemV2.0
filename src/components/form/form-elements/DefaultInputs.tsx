"use client";
import React from 'react';
import ComponentCard from '../../common/ComponentCard';
import Label from '../Label';
import Input from '../input/InputField';
import CheckboxComponents from './CheckboxComponents';
import Select from '../Select';
import { ChevronDownIcon, TimeIcon } from '../../../icons';
import DatePicker from '@/components/form/date-picker';
import TextArea from '../input/TextArea';

export default function DefaultInputs() {
  const options = [
    { value: "marketing", label: "Marketing" },
    { value: "template", label: "Template" },
    { value: "development", label: "Development" },
  ];
  const handleSelectChange = (value: string) => {
    console.log("Selected value:", value);
  };
  return (
<ComponentCard title="Add New Visit">
  <div className="space-y-6">
    <div className="flex space-x-6">
      <div className="flex-1">
        <Label>Comapny Name</Label>
        <Input type="text" />
      </div>
      <div className="flex-1">
        <Label>UEN Number</Label>
        <Input type="text" />
      </div>
      <div className="flex-1">
        <DatePicker
          id="date-picker"
          label="Date of Visit"
          placeholder="Select a date"
          onChange={(dates, currentDateString) => {
            console.log({ dates, currentDateString });
          }}
        />
      </div>
    </div>



    <div className="flex space-x-6">
      <div className="flex-1">
        <Label>Total Registered</Label>
        <Input type="number" />
      </div>
      <div className="flex-1">
        <Label>Total Attended</Label>
        <Input type="number" />
      </div>
      <div className="flex-1">
        <Label>Revenue ($)</Label>
        <Input type="number" />
      </div>
    </div>

    <div className="flex space-x-6">
      <div className="flex-1">
        <Label>Start Time</Label>
        <div className="relative">
          <Input
            type="time"
            id="start-time"
            name="start-time"
            onChange={(e) => console.log(e.target.value)}
          />
          <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
            <TimeIcon />
          </span>
        </div>
      </div>
      <div className="flex-1">
        <Label>End Time</Label>
        <div className="relative">
          <Input
            type="time"
            id="end-time"
            name="end-time"
            onChange={(e) => console.log(e.target.value)}
          />
          <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
            <TimeIcon />
          </span>
        </div>
      </div>
      <div className="flex-1">
        <Label>AM/PM Session</Label>
        <div className="relative">
          <Select
            options={options}
            placeholder="Select an option"
            onChange={handleSelectChange}
            className="dark:bg-dark-900"
          />
          <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
            <ChevronDownIcon />
          </span>
        </div>
      </div>
      <div className="flex-1">
        <Label>Duration (hours)</Label>
        <Input type="number" />
      </div>
    </div>

    <div className="flex space-x-6">
      <div className="flex-1">
        <Label>Sector</Label>
        <div className="relative">
          <Select
            options={options}
            placeholder="Select an option"
            onChange={handleSelectChange}
            className="dark:bg-dark-900"
          />
          <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
            <ChevronDownIcon />
          </span>
        </div>
      </div>

      <div className="flex-1">
        <Label>Industry</Label>
        <div className="relative">
          <Select
            options={options}
            placeholder="Select an option"
            onChange={handleSelectChange}
            className="dark:bg-dark-900"
          />
          <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
            <ChevronDownIcon />
          </span>
        </div>
      </div>

      <div className="flex-1">
        <Label>Size</Label>
        <div className="relative">
          <Select
            options={options}
            placeholder="Select an option"
            onChange={handleSelectChange}
            className="dark:bg-dark-900"
          />
          <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
            <ChevronDownIcon />
          </span>
        </div>
      </div>
    </div>

    <div className="flex space-x-6">
      <div className="flex-1">
        <Label>Notes</Label>
        <TextArea />
      </div>
      <div className="flex-1">
        <CheckboxComponents />
      </div>
    </div>
  </div>
</ComponentCard>
  );
}
