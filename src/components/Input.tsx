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

import { CircleAlert, LucideIcon } from "lucide-react-native";

type InputProps = {
  rightIcon?: React.ReactNode;
  leftIcon?: LucideIcon;
  helper?: string;
  label?: string;
  error?: string;
} & IInputProps &
  IInputFieldProps;

export function Input({
  error,
  value,
  onChangeText,
  secureTextEntry,
  helper,
  label,
  placeholder,
  leftIcon,
  rightIcon,
  ...props
}: InputProps) {
  return (
    <FormControl isInvalid={!!error}>
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
          value={value}
          onChangeText={onChangeText}
          autoCapitalize="none"
          secureTextEntry={secureTextEntry}
          style={{ color: "#666666" }}
          className={`font-inter font-semibold placeholder:text-gray-500 text-base`}
          placeholder={placeholder}
        />
        {rightIcon && rightIcon}
      </InputBase>
      <FormControlError>
        <FormControlErrorIcon as={CircleAlert} size={16} />
        <FormControlErrorText>{error}</FormControlErrorText>
      </FormControlError>
    </FormControl>
  );
}
