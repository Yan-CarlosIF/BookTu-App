import { Funnel, LucideIcon } from "lucide-react-native";
import { useState } from "react";
import { TextInputProps } from "react-native";

import { InputIcon } from "@/components/ui/input";
import {
  ISelectInputProps,
  Select as UISelect,
  SelectBackdrop,
  SelectContent,
  SelectDragIndicator,
  SelectDragIndicatorWrapper,
  SelectFlatList,
  SelectItem,
  SelectPortal,
  SelectTrigger,
} from "@/components/ui/select";

type SelectProps<T extends string> = {
  Input?: React.ForwardRefExoticComponent<
    Omit<ISelectInputProps, "ref"> & React.RefAttributes<TextInputProps>
  >;
  Icon?: LucideIcon;
  selectedFilter: T | undefined;
  setSelectedFilter: React.Dispatch<React.SetStateAction<T | undefined>>;
  options: readonly { label: string; value: T }[];
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
    (option) => option.value === selectedFilter,
  )?.label;

  return (
    <UISelect selectedValue={labelSelected}>
      <SelectTrigger
        disabled={isDisabled}
        onPress={() => setIsSelectOpen((prevState) => !prevState)}
        className={!Input ? "border-0" : "h-12 justify-between px-2"}
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

          <SelectFlatList
            data={options}
            keyExtractor={(item) => (item as { label: string; value: T }).value}
            renderItem={({ item }) => {
              const { label, value } = item as { label: string; value: T };

              return (
                <SelectItem
                  className={value === selectedFilter ? "bg-teal-300/15" : ""}
                  onPress={() => handleSelectFilter(value)}
                  key={value}
                  label={label}
                  value={value}
                />
              );
            }}
          />
        </SelectContent>
      </SelectPortal>
    </UISelect>
  );
}
