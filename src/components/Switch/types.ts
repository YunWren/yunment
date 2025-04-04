export type SwitchValueType = boolean | string | number;
export interface SwtichProps {
  modelValue: SwitchValueType;
  disabled?: boolean;
  activeText?: string;
  inactiveText?: string;
  activeValue: SwitchValueType;
  inactiveValue: SwitchValueType;
  name?: string;
  id?: string;
  size?: 'small' | 'large';
  night?: boolean;
}

export interface SwtichEmits {
  (e: 'update:modelValue', value: SwitchValueType): void;
  (e: 'change', value: SwitchValueType): void;
}