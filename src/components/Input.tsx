import { CircleAlert, LucideIcon } from "lucide-react-native";

import {
  FormControl,
  FormControlError,
  FormControlErrorIcon,
  FormControlErrorText,
  FormControlLabel,
  FormControlLabelText,
} from "@/components/ui/form-control";
import {
  IInputFieldProps,
  IInputProps,
  Input as InputBase,
  InputField,
  InputIcon,
  InputSlot,
} from "@/components/ui/input";

type InputProps = {
  iconSize?: number;
  rightIcon?: React.ReactNode;
  leftIcon?: LucideIcon;
  helper?: string;
  label?: string;
  error?: string;
} & IInputProps &
  IInputFieldProps;

export function Input({
  iconSize,
  error,
  value,
  onChangeText,
  secureTextEntry,
  helper,
  label,
  placeholder,
  leftIcon,
  rightIcon,
  keyboardType,
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
            <InputIcon as={leftIcon} size={iconSize ? iconSize : 20} />
          </InputSlot>
        )}
        <InputField
          keyboardType={keyboardType}
          value={value}
          onChangeText={onChangeText}
          autoCapitalize="none"
          secureTextEntry={secureTextEntry}
          style={{ color: "#666666" }}
          className="font-inter text-base font-normal"
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
