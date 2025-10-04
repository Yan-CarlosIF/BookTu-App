import { useNavigation } from "@react-navigation/native";
import { AlertTriangle, CheckCircle, Loader2 } from "lucide-react-native";
import { FlatList, Text, View } from "react-native";

import {
  AlertDialog,
  AlertDialogBackdrop,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
} from "@/components/ui/alert-dialog";
import { Button, ButtonText } from "@/components/ui/button";
import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
import { VStack } from "@/components/ui/vstack";

import { AppNavigatorRoutesProps } from "../routes/AppRoutes";
import { SyncInventoryError } from "../screens/Home";

type SyncInventoriesDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  isLoading: boolean;
  errors: SyncInventoryError[];
};

export function SyncInventoriesDialog({
  isLoading,
  isOpen,
  onClose,
  errors,
}: SyncInventoriesDialogProps) {
  const { navigate } = useNavigation<AppNavigatorRoutesProps>();

  function handleNavigateToInventories() {
    onClose();
    navigate("inventories");
  }

  const hasErrors = errors.length > 0;

  function getHeaderTitle() {
    if (isLoading) return "Sincronizando inventários...";
    if (hasErrors) return "Alguns inventários não foram sincronizados";
    return "Inventários sincronizados com sucesso!";
  }

  function getHeaderColor() {
    if (isLoading) return "text-teal-700";
    if (hasErrors) return "text-red-600";
    return "text-emerald-600";
  }

  function renderIcon() {
    if (isLoading)
      return (
        <Icon
          as={Loader2}
          color="#0d9488"
          size={56}
          className="mx-auto animate-spin"
        />
      );
    if (hasErrors)
      return (
        <Icon
          as={AlertTriangle}
          size={64}
          color="#ef4444"
          className="mx-auto"
        />
      );
    return (
      <Icon as={CheckCircle} color="#10b981" size={64} className="mx-auto" />
    );
  }

  return (
    <AlertDialog isOpen={isOpen} size="lg">
      <AlertDialogBackdrop />
      <AlertDialogContent className="rounded-2xl bg-white p-6">
        <AlertDialogHeader className="mb-4">
          <Text
            className={`text-center text-xl font-semibold ${getHeaderColor()}`}
          >
            {getHeaderTitle()}
          </Text>
        </AlertDialogHeader>

        <AlertDialogBody>
          {renderIcon()}

          {isLoading && (
            <Text className="mt-4 text-center text-gray-600">
              Aguarde enquanto os inventários são sincronizados...
            </Text>
          )}

          {!isLoading && hasErrors && (
            <View className="mt-6 max-h-72">
              <Text className="mb-2 text-center text-base font-medium text-gray-800">
                Detalhes dos erros:
              </Text>

              <FlatList
                data={errors}
                keyExtractor={({ inventoryId }) => inventoryId}
                renderItem={({ item }) => (
                  <VStack className="mb-3 rounded-lg border border-red-200 bg-red-50 p-3">
                    <Text className="font-semibold text-red-600">
                      Inventário {item.inventoryId}
                    </Text>
                    <Text className="mt-1 text-sm text-red-500">
                      {item.message}
                    </Text>

                    {item.errors && item.errors.length > 0 && (
                      <FlatList
                        data={item.errors}
                        keyExtractor={({ id }) => id}
                        nestedScrollEnabled
                        renderItem={({ item: { id, type } }) => (
                          <Text className="ml-2 mt-1 text-sm text-gray-700">
                            • Erro no{" "}
                            {type === "book" ? "livro" : "estabelecimento"} de
                            ID: {id}
                          </Text>
                        )}
                      />
                    )}
                  </VStack>
                )}
              />
            </View>
          )}

          {!isLoading && !hasErrors && (
            <Text className="mt-4 text-center text-gray-600">
              Todos os inventários foram sincronizados corretamente
            </Text>
          )}
        </AlertDialogBody>

        {!isLoading && (
          <AlertDialogFooter className="mt-6">
            <HStack className="w-full justify-end gap-3">
              <Button
                onPress={onClose}
                variant="outline"
                className="border-teal-600 data-[active=true]:border-teal-500"
              >
                <ButtonText className="text-teal-700 data-[active=true]:text-teal-500">
                  Fechar
                </ButtonText>
              </Button>

              <Button
                onPress={handleNavigateToInventories}
                className="bg-teal-600 data-[active=true]:bg-teal-500"
              >
                <ButtonText>
                  {hasErrors ? "Corrigir erros" : "Ver inventários"}
                </ButtonText>
              </Button>
            </HStack>
          </AlertDialogFooter>
        )}
      </AlertDialogContent>
    </AlertDialog>
  );
}
