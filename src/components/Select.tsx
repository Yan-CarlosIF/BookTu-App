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
} from "@/components/ui/select";
import { Funnel } from "lucide-react-native";
import { useState } from "react";

type SelectProps<T extends string> = {
  selectedFilter: T | undefined;
  setSelectedFilter: React.Dispatch<React.SetStateAction<T | undefined>>;
  options: Readonly<{ label: string; value: T }[]>;
};

export function Select<T extends string>({
  options,
  selectedFilter,
  setSelectedFilter,
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

  return (
    <UISelect selectedValue={selectedFilter}>
      <SelectTrigger
        onPress={() => setIsSelectOpen((prevState) => !prevState)}
        className="border-0"
        size="md"
      >
        <InputIcon as={Funnel} />
      </SelectTrigger>
      <SelectPortal isOpen={isSelectOpen}>
        <SelectBackdrop onPress={() => setIsSelectOpen(false)} />
        <SelectContent>
          <SelectDragIndicatorWrapper>
            <SelectDragIndicator />
          </SelectDragIndicatorWrapper>
          {options.map(({ label, value }) => (
            <SelectItem
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
