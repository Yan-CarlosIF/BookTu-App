import {
  Button as UIButton,
  IButtonProps as UIButtonProps,
} from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

type ButtonProps = UIButtonProps & {
  isLoading?: boolean;
};

export function Button({
  children,
  isLoading,
  className,
  ...rest
}: ButtonProps) {
  return (
    <UIButton
      className={className + (isLoading ? " opacity-70" : "")}
      {...rest}
    >
      {isLoading ? <Spinner color="white" /> : children}
    </UIButton>
  );
}
