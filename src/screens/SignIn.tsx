import { Text } from "react-native";
import { VStack } from "@/components/ui/vstack";
import { Input } from "@/components/Input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Lock, UserRound } from "lucide-react-native";
import { useState } from "react";
import { InputIcon, InputSlot } from "@/components/ui/input";

export function SingIn() {
  const [hidePassword, setHidePassword] = useState(true);

  return (
    <VStack className="flex-1 w-full items-center justify-center px-[45px] bg-white">
      <Text className="text-5xl font-poppins-bold">BookTu</Text>
      <Text className="font-inter font-semibold text-2xl mt-14">
        Iniciar sessão
      </Text>
      <VStack className="mt-14 gap-7 w-full">
        <Input
          leftIcon={UserRound}
          className="h-[50px] px-4 bg-gray-300 border-gray-500 group-data data-[focus=true]:border-teal-700"
          label="Login"
          placeholder="Login"
        />
        <Input
          leftIcon={Lock}
          rightIcon={
            <InputSlot
              onPress={() => setHidePassword((prevState) => !prevState)}
            >
              <InputIcon as={hidePassword ? Eye : EyeOff} size={20} />
            </InputSlot>
          }
          className="h-[50px] px-4 bg-gray-300 border-gray-500 data-[focus=true]:border-teal-700"
          label="Senha"
          placeholder="******"
          secureTextEntry={hidePassword}
        />
        <Button className="bg-teal-700 h-14 mt-16 data-[active=true]:bg-teal-600">
          <Text className="font-inter font-bold text-xl text-white">
            Iniciar sessão
          </Text>
        </Button>
      </VStack>
    </VStack>
  );
}
