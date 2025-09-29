import { InputIcon } from "@/components/ui/input";
import {
  Select as UISelect,
  SelectTrigger,
  SelectPortal,
  SelectBackdrop,
  SelectContent,
  SelectDragIndicatorWrapper,
  SelectDragIndicator,
  SelectItem,
  ISelectInputProps,
} from "@/components/ui/select";
import { Funnel, LucideIcon } from "lucide-react-native";
import { useState } from "react";
import { TextInputProps } from "react-native";

type SelectProps<T extends string> = {
  Input?: React.ForwardRefExoticComponent<
    Omit<ISelectInputProps, "ref"> & React.RefAttributes<TextInputProps>
  >;
  Icon?: LucideIcon;
  selectedFilter: T | undefined;
  setSelectedFilter: React.Dispatch<React.SetStateAction<T | undefined>>;
  options: Readonly<{ label: string; value: T }[]>;
  isDisabled?: boolean;
};

export function Select<T extends string>({
  Icon,
  Input,
  options,
  selectedFilter,
  setSelectedFilter,
  isDisabled,
}: SelectProps<T>) {
  const [isSelectOpen, setIsSelectOpen] = useState(false);

  function handleSelectFilter(filter: T) {
    if (filter === selectedFilter) {
      setSelectedFilter(undefined);
      return;
    }

    setSelectedFilter(filter);
    setIsSelectOpen(false);
  }

  const labelSelected = options.find(
    (option) => option.value === selectedFilter
  )?.label;

  return (
    <UISelect selectedValue={labelSelected}>
      <SelectTrigger
        disabled={isDisabled}
        onPress={() => setIsSelectOpen((prevState) => !prevState)}
        className={!Input ? "border-0" : "justify-between px-2 h-12"}
        size="md"
      >
        {Input && <Input placeholder="Selecione um Estabelecimento" />}
        {Icon ? <Icon size={18} /> : <InputIcon as={Funnel} />}
      </SelectTrigger>
      <SelectPortal isOpen={isSelectOpen}>
        <SelectBackdrop onPress={() => setIsSelectOpen(false)} />
        <SelectContent>
          <SelectDragIndicatorWrapper>
            <SelectDragIndicator />
          </SelectDragIndicatorWrapper>
          {options.map(({ label, value }) => (
            <SelectItem
              className={value === selectedFilter ? "bg-teal-300/15" : ""}
              onPress={() => handleSelectFilter(value)}
              key={value}
              label={label}
              value={value}
            />
          ))}
        </SelectContent>
      </SelectPortal>
    </UISelect>
  );
}
