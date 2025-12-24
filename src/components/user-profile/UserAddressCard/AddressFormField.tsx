import React from "react";
import { AddressFormFieldProps } from "@/types/UserProfileTypes/Address";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";

export default function AddressFormField({
  label,
  name,
  value,
  onChange
}: AddressFormFieldProps) {
  return (
    <div className="col-span-2 lg:col-span-1">
      <Label>{label}</Label>
      <Input 
        type="text" 
        name={name}
        value={value || ""} 
        onChange={onChange}
      />
    </div>
  );
}