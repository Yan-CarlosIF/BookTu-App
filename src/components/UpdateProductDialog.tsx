import { Input } from "@components/Input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Text } from "react-native";
import { z } from "zod";

import {
  AlertDialog,
  AlertDialogBackdrop,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
} from "@/components/ui/alert-dialog";
import { Button, ButtonText } from "@/components/ui/button";

import { InventoryBook } from "../shared/types/inventoryBook";
import { OfflineInventoryBook } from "../shared/types/offlineInventoryBook";

type UpdateProductDialogProps = {
  book: InventoryBook | OfflineInventoryBook;
  setBooks: React.Dispatch<
    React.SetStateAction<InventoryBook[] | OfflineInventoryBook[]>
  >;
  isOpen: boolean;
  onClose: () => void;
};

const quantitySchema = z.object({
  productQuantity: z
    .string()
    .regex(/^\d+$/, "Digite apenas números")
    .refine((val) => Number(val) >= 1, {
      message: "Quantidade deve ser no mínimo 1",
    }),
});

type QuantityForm = z.infer<typeof quantitySchema>;

export function UpdateProductDialog({
  setBooks,
  isOpen,
  onClose,
  book: {
    quantity: defaultQuantity,
    book: { title, id },
  },
}: UpdateProductDialogProps) {
  const {
    control,
    handleSubmit,
    formState: { isValid },
  } = useForm<QuantityForm>({
    mode: "all",
    resolver: zodResolver(quantitySchema),
    defaultValues: {
      productQuantity: String(defaultQuantity),
    },
  });

  function handleUpdateQuantity({ productQuantity }: QuantityForm) {
    setBooks((prevBooks) =>
      prevBooks.map((book) => {
        if (book.book_id === id) {
          return {
            ...book,
            quantity: Number(productQuantity),
          };
        }
        return book;
      }),
    );

    onClose();
  }

  return (
    <AlertDialog isOpen={isOpen} onClose={onClose} size="md">
      <AlertDialogBackdrop />
      <AlertDialogContent>
        <AlertDialogHeader>
          <Text className="font-poppins-semibold text-gray-800">
            Atualize a quantidade do produto{"\n"}
            <Text className="text-teal-600">{title}</Text>
          </Text>
        </AlertDialogHeader>
        <AlertDialogBody className="mb-4">
          <Controller
            control={control}
            name="productQuantity"
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <Input
                className="data-[focus=true]:border-teal-500"
                onChangeText={(text) => onChange(text.replace(/[^0-9]/g, ""))}
                value={value}
                error={error?.message}
                keyboardType="numeric"
              />
            )}
          />
        </AlertDialogBody>
        <AlertDialogFooter className="">
          <Button
            variant="outline"
            action="secondary"
            onPress={onClose}
            size="sm"
          >
            <ButtonText>Cancelar</ButtonText>
          </Button>
          <Button
            isDisabled={!isValid}
            className="bg-teal-600 data-[active=true]:bg-teal-500"
            size="sm"
            onPress={handleSubmit(handleUpdateQuantity)}
          >
            <ButtonText>Atualizar</ButtonText>
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
