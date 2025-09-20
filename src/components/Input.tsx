import {
  FormControl,
  FormControlLabel,
  FormControlLabelText,
  FormControlError,
  FormControlErrorIcon,
  FormControlErrorText,
} from "@/components/ui/form-control";
import {
  InputField,
  Input as InputBase,
  IInputProps,
  IInputFieldProps,
  InputIcon,
  InputSlot,
} from "@/components/ui/input";

import { LucideIcon } from "lucide-react-native";

type InputProps = {
  rightIcon?: React.ReactNode;
  leftIcon?: LucideIcon;
  helper?: string;
  label?: string;
} & IInputProps &
  IInputFieldProps;

export function Input({
  secureTextEntry,
  helper,
  label,
  placeholder,
  leftIcon,
  rightIcon,
  ...props
}: InputProps) {
  return (
    <FormControl>
      <FormControlLabel>
        <FormControlLabelText>{label}</FormControlLabelText>
      </FormControlLabel>
      <InputBase {...props}>
        {leftIcon && (
          <InputSlot>
            <InputIcon as={leftIcon} size={20} />
          </InputSlot>
        )}
        <InputField
          autoCapitalize="none"
          secureTextEntry={secureTextEntry}
          className={`font-inter font-semibold text-gray-600 text-base `}
          placeholder={placeholder}
        />
        {rightIcon && rightIcon}
      </InputBase>
      <FormControlError>
        <FormControlErrorIcon />
        <FormControlErrorText />
      </FormControlError>
    </FormControl>
  );
}
