export interface AddressProfile {
  country: string;
  city: string;
  postal_code: string;
  address: string;
}

export interface AddressDisplayProps {
  country: string;
  city: string;
  postal_code: string;
  address: string;
  onEdit: () => void;
}

export interface AddressEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  formData: AddressProfile;
  onInputChange: (e: { target: { name: string; value: string } }) => void;
  onSave: () => void;
  saving: boolean;
}

export interface AddressFieldProps {
  label: string;
  value: string;
}

export interface AddressFormFieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: { target: { name: string; value: string } }) => void;
}