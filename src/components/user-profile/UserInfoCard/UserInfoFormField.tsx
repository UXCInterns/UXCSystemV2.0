import React from "react";
import { UserInfoFormFieldProps } from "@/types/UserProfileTypes/UserInfo";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";

export default function UserInfoFormField({
  label,
  name,
  type,
  value,
  onChange
}: UserInfoFormFieldProps) {
  return (
    <div className="col-span-2 lg:col-span-1">
      <Label>{label}</Label>
      <Input 
        type={type} 
        name={name}
        value={value || ""} 
        onChange={onChange}
      />
    </div>
  );
}