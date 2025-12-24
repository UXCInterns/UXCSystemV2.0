export interface UserInfoProfile {
  first_name: string;
  last_name: string;
  email: string;
  birthday: string;
  phone: string;
}

export interface UserInfoDisplayProps {
  profile: UserInfoProfile;
  onEdit: () => void;
}

export interface UserInfoEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  formData: UserInfoProfile;
  onInputChange: (e: { target: { name: string; value: string } }) => void;
  onSave: () => void;
  saving: boolean;
}

export interface UserInfoFieldProps {
  label: string;
  value: string;
  formatValue?: (value: string) => string;
}

export interface UserInfoFormFieldProps {
  label: string;
  name: string;
  type: string;
  value: string;
  onChange: (e: { target: { name: string; value: string } }) => void;
}